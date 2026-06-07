require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5032;

app.use(cors({ origin: '*' }));
app.use(express.json());

const fs = require('fs');
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'shoes.db');
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const db = new Database(DB_PATH);

// Init DB
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image TEXT,
    parent_id INTEGER DEFAULT NULL,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    brand_id INTEGER,
    category_id INTEGER,
    price INTEGER NOT NULL,
    sale_price INTEGER,
    description TEXT,
    image TEXT,
    images TEXT,
    sizes TEXT,
    colors TEXT,
    is_featured INTEGER DEFAULT 0,
    is_new INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 100,
    rating REAL DEFAULT 4.5,
    reviews_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_code TEXT UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    customer_address TEXT NOT NULL,
    items TEXT NOT NULL,
    total INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Migration: add columns missing in old Railway deployments
try { db.exec('ALTER TABLE categories ADD COLUMN parent_id INTEGER DEFAULT NULL'); } catch (_) {}
try { db.exec('ALTER TABLE categories ADD COLUMN sort_order INTEGER DEFAULT 0'); } catch (_) {}

// Migration: insert new categories if not yet present (for existing Railway DB)
{
  const _addChild = (name, slug, parentSlug, sort) => {
    if (db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug)) return;
    const parent = db.prepare('SELECT id FROM categories WHERE slug = ?').get(parentSlug);
    if (parent) db.prepare('INSERT INTO categories (name, slug, parent_id, sort_order) VALUES (?, ?, ?, ?)').run(name, slug, parent.id, sort);
  };
  const _addParent = (name, slug, sort) => {
    if (!db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug))
      db.prepare('INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)').run(name, slug, sort);
  };
  _addChild('Giày Pickleball',   'giay-pickleball',  'pickleball',       3);
  _addParent('PHỤ KIỆN BÓNG ĐÁ', 'phu-kien-bong-da', 8);
  _addChild('Túi Đựng Bóng',     'tui-dung-bong',    'phu-kien-bong-da', 1);
  _addChild('Băng Bảo Vệ',       'bang-bao-ve',      'phu-kien-bong-da', 2);
  _addChild('Tất Thể Thao',      'tat-the-thao',     'phu-kien-bong-da', 3);
  _addChild('Găng Tay Thủ Môn',  'gang-tay-thu-mon', 'phu-kien-bong-da', 4);
}

// Seed/reseed: detect old structure (no ao-clb-dt) and reseed
const hasNewStructure = db.prepare("SELECT COUNT(*) as cnt FROM categories WHERE slug = 'ao-clb-dt'").get().cnt > 0;
if (!hasNewStructure) {
  db.exec('DELETE FROM products; DELETE FROM categories; DELETE FROM brands;');
  const insertParent = db.prepare('INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)');
  const insertChild  = db.prepare('INSERT INTO categories (name, slug, parent_id, sort_order) VALUES (?, ?, ?, ?)');

  // Parent categories
  const p1 = insertParent.run('ÁO CLB, ĐT',                            'ao-clb-dt',         1).lastInsertRowid;
  const p2 = insertParent.run('GIÀY BÓNG ĐÁ',                          'giay-bong-da',       2).lastInsertRowid;
  const p3 = insertParent.run('QUẢ BÓNG ĐÁ',                           'qua-bong-da',        3).lastInsertRowid;
  const p4 = insertParent.run('GIÀY CẦU LÔNG - BÓNG CHUYỀN - PK',      'giay-cau-long-bc-pk',4).lastInsertRowid;
  const p5 = insertParent.run('ÁO THỂ THAO - POLO',                    'ao-the-thao-polo',   5).lastInsertRowid;
  const p6 = insertParent.run('PICKLEBALL',                             'pickleball',         6).lastInsertRowid;
  const p7 = insertParent.run('BÓNG CHUYỀN',                           'bong-chuyen',        7).lastInsertRowid;
  const p8 = insertParent.run('PHỤ KIỆN BÓNG ĐÁ',                     'phu-kien-bong-da',   8).lastInsertRowid;

  // Children of ÁO CLB, ĐT
  insertChild.run('JP',                'jp',              p1, 1);
  insertChild.run('HD',                'hd',              p1, 2);
  insertChild.run('DK',                'dk',              p1, 3);
  insertChild.run('MK',                'mk',              p1, 4);
  insertChild.run('Mê Caro',           'me-caro',         p1, 5);
  insertChild.run('Áo Trẻ Em CLB, ĐT','ao-tre-em-clb-dt',p1, 6);
  insertChild.run('Strivend',          'strivend',        p1, 7);
  insertChild.run('Winsport',          'winsport',        p1, 8);

  // Children of GIÀY BÓNG ĐÁ
  insertChild.run('Giày Wika',     'giay-wika',     p2, 1);
  insertChild.run('Giày Kamito',   'giay-kamito',   p2, 2);
  insertChild.run('Giày Jogarbola','giay-jogarbola', p2, 3);
  insertChild.run('Giày Akka',     'giay-akka',     p2, 4);
  insertChild.run('Giày Mitre',    'giay-mitre',    p2, 5);
  insertChild.run('Giày Zocker',   'giay-zocker',   p2, 6);
  insertChild.run('Giày Trẻ Em',   'giay-tre-em',   p2, 7);

  // Children of QUẢ BÓNG ĐÁ
  insertChild.run('Bóng Động Lực', 'bong-dong-luc', p3, 1);
  insertChild.run('Bóng Wika',     'bong-wika',     p3, 2);
  insertChild.run('Bóng Zocker',   'bong-zocker',   p3, 3);
  insertChild.run('Bóng Bách Hiền','bong-bach-hien',p3, 4);
  insertChild.run('Bóng Thiên Long','bong-thien-long',p3,5);

  // Children of GIÀY CẦU LÔNG - BC - PK
  insertChild.run('Giày Thể Thao Wika',    'giay-tt-wika',    p4, 1);
  insertChild.run('Giày Thể Thao Lefus',   'giay-tt-lefus',   p4, 2);
  insertChild.run('Giày Thể Thao Sao Vàng','giay-tt-sao-vang',p4, 3);
  insertChild.run('Giày Thể Thao Beyono',  'giay-tt-beyono',  p4, 4);

  // Children of ÁO THỂ THAO - POLO
  insertChild.run('Áo Polo',           'ao-polo',          p5, 1);
  insertChild.run('Quần Áo Thể Thao',  'quan-ao-the-thao', p5, 2);

  // Children of PICKLEBALL
  insertChild.run('Vợt Pickleball',     'vot-pickleball',     p6, 1);
  insertChild.run('Phụ Kiện Pickleball','phu-kien-pickleball', p6, 2);
  insertChild.run('Giày Pickleball',    'giay-pickleball',    p6, 3);

  // Children of BÓNG CHUYỀN
  insertChild.run('Quả Bóng Chuyền',  'qua-bong-chuyen', p7, 1);
  insertChild.run('Áo Bóng Chuyền',   'ao-bong-chuyen',  p7, 2);
  insertChild.run('PK Bóng Chuyền',   'pk-bong-chuyen',  p7, 3);

  // Children of PHỤ KIỆN BÓNG ĐÁ
  insertChild.run('Túi Đựng Bóng',     'tui-dung-bong',   p8, 1);
  insertChild.run('Băng Bảo Vệ',       'bang-bao-ve',     p8, 2);
  insertChild.run('Tất Thể Thao',      'tat-the-thao',    p8, 3);
  insertChild.run('Găng Tay Thủ Môn',  'gang-tay-thu-mon',p8, 4);

  // Brands
  const insertBrand = db.prepare('INSERT INTO brands (name, slug) VALUES (?, ?)');
  for (const [name, slug] of [
    ['JP','jp'],['HD','hd'],['DK Sport','dk-sport'],['MK Sport','mk-sport'],
    ['Mê Caro','me-caro'],['Strivend','strivend'],['Winsport','winsport'],
    ['Wika','wika'],['Kamito','kamito'],['Jogarbola','jogarbola'],
    ['Akka','akka'],['Mitre','mitre'],['Zocker','zocker'],
    ['Động Lực','dong-luc'],['Bách Hiền','bach-hien'],['Thiên Long','thien-long'],
    ['Lefus','lefus'],['Sao Vàng','sao-vang'],['Beyono','beyono'],
  ]) insertBrand.run(name, slug);
}

// Seed/reseed products: wipe if any product has bad sizes (not valid JSON)
const firstProduct = db.prepare('SELECT sizes FROM products LIMIT 1').get();
const hasBadSizes = firstProduct && (() => {
  try { JSON.parse(firstProduct.sizes || '[]'); return false; } catch { return true; }
})();
if (hasBadSizes) db.exec('DELETE FROM products');

const productCount = db.prepare('SELECT COUNT(*) as cnt FROM products').get();
if (productCount.cnt === 0) {
  const getCat   = (slug) => db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug)?.id;
  const getBrand = (slug) => db.prepare('SELECT id FROM brands WHERE slug = ?').get(slug)?.id;
  const IMG = 'https://placehold.co/600x600/EBF8FD/2AAEDF?text=VH24+SPORT';

  const ins = db.prepare(`INSERT INTO products
    (name,slug,brand_id,category_id,price,sale_price,description,image,sizes,is_featured,is_new,stock,rating,reviews_count)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);

  const sz = (arr) => JSON.stringify(arr); // sizes must be JSON array
  const products = [
    ['Áo Bóng Đá JP Đội Tuyển Việt Nam 2024','ao-jp-dt-vn-2024',       getBrand('jp'),       getCat('jp'),            175000,150000,'Áo đội tuyển Việt Nam phiên bản 2024, vải thoáng khí cao cấp.',IMG,sz(['S','M','L','XL','2XL']),  1,1,50,4.8,24],
    ['Áo Bóng Đá HD CLB Manchester United',  'ao-hd-mu',               getBrand('hd'),       getCat('hd'),            195000,null,  'Áo CLB MU bản HD chất lượng cao, form chuẩn Euro.',             IMG,sz(['S','M','L','XL','2XL']),  0,1,40,4.6,18],
    ['Áo MK Sport Training Xanh',            'ao-mk-training',         getBrand('mk-sport'), getCat('mk'),            130000,null,  'Áo training thể thao MK Sport, thấm hút mồ hôi tốt.',           IMG,sz(['S','M','L','XL']),        0,0,60,4.4,12],
    ['Giày Bóng Đá Wika AG Speed V3',        'giay-wika-ag-v3',        getBrand('wika'),     getCat('giay-wika'),     480000,420000,'Giày đá bóng Wika AG đế đinh nhân tạo, chống trơn trượt.',     IMG,sz(['39','40','41','42','43']), 1,1,30,4.9,35],
    ['Giày Bóng Đá Kamito Fuse Pro FG',      'giay-kamito-fuse-pro',   getBrand('kamito'),   getCat('giay-kamito'),   390000,null,  'Giày Kamito đế FG cỏ tự nhiên, mũi giày TPU cứng cáp.',       IMG,sz(['39','40','41','42','43']), 1,0,25,4.7,28],
    ['Giày Bóng Đá Mitre Striker TF',        'giay-mitre-striker-tf',  getBrand('mitre'),    getCat('giay-mitre'),    340000,300000,'Giày Mitre đế TF sân cỏ nhân tạo, bền bỉ, giá tốt.',          IMG,sz(['38','39','40','41','42']), 0,0,35,4.5,15],
    ['Giày Bóng Đá Zocker TF Elite',         'giay-zocker-tf-elite',   getBrand('zocker'),   getCat('giay-zocker'),   290000,null,  'Giày Zocker TF thiết kế năng động, phù hợp sân cỏ nhân tạo.',  IMG,sz(['38','39','40','41','42']), 0,1,40,4.5,10],
    ['Bóng Đá Động Lực UHV 2.05 FIFA',       'bong-dong-luc-uhv205',   getBrand('dong-luc'), getCat('bong-dong-luc'), 300000,270000,'Bóng Động Lực chuẩn FIFA, dùng thi đấu sân cỏ 11 người.',     IMG,'[]',                         1,0,20,4.8,42],
    ['Bóng Đá Wika AS10 Training',           'bong-wika-as10',         getBrand('wika'),     getCat('bong-wika'),     195000,null,  'Bóng Wika AS10 luyện tập hàng ngày, độ bền cao.',              IMG,'[]',                         0,1,45,4.5,19],
    ['Giày Thể Thao Wika Cầu Lông Classic',  'giay-wika-cau-long',     getBrand('wika'),     getCat('giay-tt-wika'),  450000,380000,'Giày thể thao Wika đa năng cầu lông / bóng chuyền, chống lật.',IMG,sz(['38','39','40','41','42']), 0,0,30,4.6,22],
  ];

  for (const p of products) ins.run(...p);
}

// Routes
const productsRouter = require('./routes/products')(db);
const ordersRouter = require('./routes/orders')(db);
const contactsRouter = require('./routes/contacts')(db);

app.use('/api/products', productsRouter);
app.get('/api/categories', (req, res) => {
  res.json(db.prepare('SELECT * FROM categories ORDER BY sort_order, id').all());
});
app.get('/api/brands', (req, res) => {
  res.json(db.prepare('SELECT * FROM brands ORDER BY name').all());
});
app.use('/api/orders', ordersRouter);
app.use('/api/contacts', contactsRouter);

const adminRouter = require('./routes/admin')(db);
app.use('/api/admin', adminRouter);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
