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
`);

// Seed data
const catCount = db.prepare('SELECT COUNT(*) as cnt FROM categories').get();
if (catCount.cnt === 0) {
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
  insertChild.run('Vợt Pickleball',    'vot-pickleball',   p6, 1);
  insertChild.run('Phụ Kiện Pickleball','phu-kien-pickleball',p6,2);

  // Children of BÓNG CHUYỀN
  insertChild.run('Quả Bóng Chuyền',  'qua-bong-chuyen', p7, 1);
  insertChild.run('Áo Bóng Chuyền',   'ao-bong-chuyen',  p7, 2);
  insertChild.run('PK Bóng Chuyền',   'pk-bong-chuyen',  p7, 3);

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
