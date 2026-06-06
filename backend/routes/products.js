const express = require('express');

const safeJSON = (str, fallback = '[]') => {
  try { return JSON.parse(str || fallback); } catch { return JSON.parse(fallback); }
};

module.exports = (db) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    const { category, brand, min_price, max_price, sort, featured, search, limit = 12, page = 1 } = req.query;
    let query = `SELECT p.*, b.name as brand_name, c.name as category_name
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1`;
    const params = [];

    if (category) {
      const parent = db.prepare('SELECT id FROM categories WHERE slug = ? AND parent_id IS NULL').get(category);
      if (parent) {
        query += ` AND c.parent_id = ?`; params.push(parent.id);
      } else {
        query += ` AND c.slug = ?`; params.push(category);
      }
    }
    if (brand) { query += ` AND b.slug = ?`; params.push(brand); }
    if (min_price) { query += ` AND p.price >= ?`; params.push(Number(min_price)); }
    if (max_price) { query += ` AND p.price <= ?`; params.push(Number(max_price)); }
    if (featured) { query += ` AND p.is_featured = 1`; }
    if (search) { query += ` AND p.name LIKE ?`; params.push(`%${search}%`); }

    if (sort === 'price_asc') query += ` ORDER BY COALESCE(p.sale_price, p.price) ASC`;
    else if (sort === 'price_desc') query += ` ORDER BY COALESCE(p.sale_price, p.price) DESC`;
    else if (sort === 'newest') query += ` ORDER BY p.is_new DESC, p.created_at DESC`;
    else if (sort === 'rating') query += ` ORDER BY p.rating DESC`;
    else query += ` ORDER BY p.is_featured DESC, p.created_at DESC`;

    const total = db.prepare(`SELECT COUNT(*) as cnt FROM (${query})`).get(...params).cnt;
    const offset = (Number(page) - 1) * Number(limit);
    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), offset);

    const products = db.prepare(query).all(...params);
    const parsed = products.map(p => ({
      ...p,
      images: safeJSON(p.images),
      sizes:  safeJSON(p.sizes),
      colors: safeJSON(p.colors),
    }));

    res.json({ products: parsed, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  });

  router.get('/:slug', (req, res) => {
    const p = db.prepare(`SELECT p.*, b.name as brand_name, c.name as category_name
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ?`).get(req.params.slug);
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json({
      ...p,
      images: safeJSON(p.images),
      sizes:  safeJSON(p.sizes),
      colors: safeJSON(p.colors),
    });
  });

  return router;
};
