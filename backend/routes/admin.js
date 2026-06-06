const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

function slugify(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

module.exports = (db) => {
  const router = express.Router();
  const SECRET = process.env.JWT_SECRET || 'vh24sport_secret_2025';

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 },
    fileFilter: (_, file, cb) => {
      if (file.mimetype.startsWith('image/')) cb(null, true);
      else cb(new Error('Chỉ chấp nhận file ảnh'));
    },
  });

  // ── Auth middleware ──────────────────────────────
  const auth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Chưa đăng nhập' });
    try {
      req.admin = jwt.verify(token, SECRET);
      next();
    } catch {
      res.status(401).json({ error: 'Phiên đăng nhập hết hạn' });
    }
  };

  // ── Login ────────────────────────────────────────
  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const ADMIN_USER = process.env.ADMIN_USER || 'admin';
    const ADMIN_PASS = process.env.ADMIN_PASS || 'vh24sport2025';
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const token = jwt.sign({ admin: true, username }, SECRET, { expiresIn: '8h' });
      res.json({ token, username });
    } else {
      res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
  });

  // ── Upload image → Cloudinary ────────────────────
  router.post('/upload', auth, upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Không có file' });
    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'vh24sport/products', resource_type: 'image', quality: 'auto', fetch_format: 'auto' },
          (err, result) => err ? reject(err) : resolve(result)
        );
        Readable.from(req.file.buffer).pipe(stream);
      });
      res.json({ url: result.secure_url, public_id: result.public_id });
    } catch (err) {
      res.status(500).json({ error: 'Upload thất bại: ' + err.message });
    }
  });

  // ── Products CRUD ────────────────────────────────
  router.get('/products', auth, (req, res) => {
    const rows = db.prepare(`
      SELECT p.*, b.name as brand_name, c.name as category_name
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `).all();
    res.json(rows.map(p => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      sizes: JSON.parse(p.sizes || '[]'),
      colors: JSON.parse(p.colors || '[]'),
    })));
  });

  router.post('/products', auth, (req, res) => {
    const { name, brand_id, category_id, price, sale_price, description,
      image, images, sizes, colors, is_featured, is_new, stock, rating, reviews_count } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'Thiếu tên hoặc giá' });

    let slug = slugify(name);
    let final = slug;
    let n = 1;
    while (db.prepare('SELECT id FROM products WHERE slug = ?').get(final)) final = `${slug}-${n++}`;

    const r = db.prepare(`INSERT INTO products
      (name, slug, brand_id, category_id, price, sale_price, description, image, images, sizes, colors, is_featured, is_new, stock, rating, reviews_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      name, final, brand_id, category_id, Number(price), sale_price ? Number(sale_price) : null,
      description, image || '', JSON.stringify(images || []),
      JSON.stringify(sizes || []), JSON.stringify(colors || []),
      is_featured ? 1 : 0, is_new ? 1 : 0,
      Number(stock) || 0, Number(rating) || 5.0, Number(reviews_count) || 0
    );
    res.json({ success: true, id: r.lastInsertRowid, slug: final });
  });

  router.put('/products/:id', auth, (req, res) => {
    const { id } = req.params;
    const { name, brand_id, category_id, price, sale_price, description,
      image, images, sizes, colors, is_featured, is_new, stock, rating, reviews_count } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'Thiếu tên hoặc giá' });

    let slug = slugify(name);
    let final = slug;
    let n = 1;
    while (db.prepare('SELECT id FROM products WHERE slug = ? AND id != ?').get(final, id)) final = `${slug}-${n++}`;

    db.prepare(`UPDATE products SET
      name=?, slug=?, brand_id=?, category_id=?, price=?, sale_price=?, description=?,
      image=?, images=?, sizes=?, colors=?, is_featured=?, is_new=?, stock=?, rating=?, reviews_count=?
      WHERE id=?`).run(
      name, final, brand_id, category_id, Number(price), sale_price ? Number(sale_price) : null,
      description, image || '', JSON.stringify(images || []),
      JSON.stringify(sizes || []), JSON.stringify(colors || []),
      is_featured ? 1 : 0, is_new ? 1 : 0,
      Number(stock) || 0, Number(rating) || 5.0, Number(reviews_count) || 0, id
    );
    res.json({ success: true, slug: final });
  });

  router.delete('/products/:id', auth, (req, res) => {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Brands & categories (for selects)
  router.get('/brands', auth, (req, res) => res.json(db.prepare('SELECT * FROM brands').all()));
  router.get('/categories', auth, (req, res) => res.json(db.prepare('SELECT * FROM categories').all()));

  return router;
};
