require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5032;

app.use(cors({ origin: '*' }));
app.use(express.json());

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'shoes.db');
const db = new Database(DB_PATH);

// Init DB
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image TEXT
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
  const insertCat = db.prepare('INSERT INTO categories (name, slug, image) VALUES (?, ?, ?)');
  insertCat.run('Sân Cỏ Tự Nhiên (FG)', 'san-co-tu-nhien', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400');
  insertCat.run('Sân Cỏ Nhân Tạo (AG)', 'san-co-nhan-tao', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400');
  insertCat.run('Sân Futsal (IC)', 'san-futsal', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400');
  insertCat.run('Sân Cứng (TF)', 'san-cung', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400');

  const insertBrand = db.prepare('INSERT INTO brands (name, slug, logo) VALUES (?, ?, ?)');
  insertBrand.run('Nike', 'nike', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/200px-Logo_NIKE.svg.png');
  insertBrand.run('Adidas', 'adidas', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/200px-Adidas_Logo.svg.png');
  insertBrand.run('Puma', 'puma', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Puma_AG.svg/200px-Puma_AG.svg.png');
  insertBrand.run('New Balance', 'new-balance', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/New_Balance_logo.svg/200px-New_Balance_logo.svg.png');
  insertBrand.run('Mizuno', 'mizuno', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Mizuno_logo.svg/200px-Mizuno_logo.svg.png');

  const insertProduct = db.prepare(`INSERT INTO products
    (name, slug, brand_id, category_id, price, sale_price, description, image, images, sizes, colors, is_featured, is_new, rating, reviews_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  const products = [
    ['Nike Mercurial Superfly 9 Elite FG', 'nike-mercurial-superfly-9-elite-fg', 1, 1, 6500000, 5800000,
     'Giày đá bóng đỉnh cao với công nghệ Nike Air Zoom, thiết kế cổ chân giúp bám đất tốt trên sân cỏ tự nhiên.',
     'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/43e22843-c25f-4b59-b8e4-6bc4b1a8c9b8/mercurial-superfly-9-elite-fg-firm-ground-soccer-cleats-brBCv0.png',
     JSON.stringify(['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800','https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800']),
     JSON.stringify(['38','39','40','41','42','43','44','45']), JSON.stringify(['Vàng/Đen','Xanh/Trắng']), 1, 1, 4.8, 124],

    ['Nike Phantom GX Elite FG', 'nike-phantom-gx-elite-fg', 1, 1, 5900000, null,
     'Giày đá bóng Phantom GX với vải dệt Flyknit ôm sát bàn chân, tối ưu cho các tiền vệ sáng tạo.',
     'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/be735274-7498-4ca5-8d84-91e9eb73b9d1/phantom-gx-elite-fg-firm-ground-soccer-cleats-wKtWWN.png',
     JSON.stringify(['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800']),
     JSON.stringify(['38','39','40','41','42','43','44']), JSON.stringify(['Đen/Vàng','Trắng/Xanh']), 1, 0, 4.7, 89],

    ['Adidas Predator Accuracy+ FG', 'adidas-predator-accuracy-fg', 2, 1, 6200000, 5500000,
     'Giày đá bóng Predator với công nghệ Controlskin mang lại độ bám bóng vượt trội cho những cú sút chính xác.',
     'https://assets.adidas.com/images/w_600,f_auto,q_auto/3cbcf05a0c6f4649a7a8af5b00b52b9e_9366/Predator_Accuracy+_Firm_Ground_Cleats_Black_GW4552_01_standard.jpg',
     JSON.stringify(['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800']),
     JSON.stringify(['39','40','41','42','43','44','45']), JSON.stringify(['Đen/Trắng','Xanh Navy']), 1, 1, 4.9, 156],

    ['Adidas Copa Pure 2 FG', 'adidas-copa-pure-2-fg', 2, 1, 4800000, 4200000,
     'Giày đá bóng Copa với chất liệu da kangaroo cao cấp, êm ái và ôm sát bàn chân cực kỳ thoải mái.',
     'https://assets.adidas.com/images/w_600,f_auto,q_auto/7c16c30d0c634b5f87d5af9900e57d41_9366/Copa_Pure_2_FG_Boots_White_HQ8896_01_standard.jpg',
     JSON.stringify(['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800']),
     JSON.stringify(['38','39','40','41','42','43','44']), JSON.stringify(['Trắng/Xanh','Đen/Đỏ']), 0, 0, 4.6, 73],

    ['Adidas X Crazyfast.1 FG', 'adidas-x-crazyfast-1-fg', 2, 1, 5600000, null,
     'Giày đá bóng siêu nhẹ X Crazyfast với đế Speedframe cải tiến giúp tăng tốc đột phá nhanh nhất.',
     'https://assets.adidas.com/images/w_600,f_auto,q_auto/e5cc0a8b3bbc4e9ab25aaf9700eb21e7_9366/X_Crazyfast.1_Firm_Ground_Soccer_Cleats_Black_GY7418_01_standard.jpg',
     JSON.stringify(['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800']),
     JSON.stringify(['39','40','41','42','43','44','45']), JSON.stringify(['Đen/Vàng','Trắng']), 1, 1, 4.7, 201],

    ['Puma Future 7 Ultimate FG/AG', 'puma-future-7-ultimate-fg-ag', 3, 1, 5200000, 4600000,
     'Giày đá bóng Future với dây buộc FUZIONFIT+ ôm sát 360 độ, phù hợp cả sân cỏ tự nhiên và nhân tạo.',
     'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/107700/01/sv01/fnd/PNA/fmt/png/FUTURE-7-ULTIMATE-FG/AG-Men%27s-Football-Boots',
     JSON.stringify(['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800']),
     JSON.stringify(['38','39','40','41','42','43','44']), JSON.stringify(['Xanh/Vàng','Đen/Đỏ']), 0, 1, 4.5, 67],

    ['Nike Mercurial Vapor 15 Academy AG', 'nike-mercurial-vapor-15-academy-ag', 1, 2, 2800000, 2400000,
     'Giày đá bóng sân cỏ nhân tạo phân khúc tầm trung, thiết kế nhẹ và bền bỉ cho học sinh và người chơi bán chuyên.',
     'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/dd41a2be-d7d8-4f55-9e6a-ca65e40a26a7/mercurial-vapor-15-academy-ag-artificial-ground-soccer-cleats-Bq2x6d.png',
     JSON.stringify(['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800']),
     JSON.stringify(['36','37','38','39','40','41','42','43','44']), JSON.stringify(['Xanh Dương','Đen/Vàng']), 0, 0, 4.3, 245],

    ['Adidas Predator Club AG', 'adidas-predator-club-ag', 2, 2, 1900000, null,
     'Giày đá bóng sân cỏ nhân tạo giá cả phải chăng cho người mới bắt đầu, thiết kế bền chắc.',
     'https://assets.adidas.com/images/w_600,f_auto,q_auto/e3ab1e0a8fef44609bddaf5d00d77a93_9366/Predator_Club_Flexible_Ground_Soccer_Cleats_Black_ID3725_01_standard.jpg',
     JSON.stringify(['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800']),
     JSON.stringify(['36','37','38','39','40','41','42','43','44','45']), JSON.stringify(['Đen/Xanh','Trắng/Đỏ']), 0, 0, 4.1, 312],

    ['Mizuno Morelia Neo IV Elite FG', 'mizuno-morelia-neo-iv-elite-fg', 5, 1, 7200000, 6500000,
     'Kiệt tác giày đá bóng Nhật Bản từ chất liệu da kangaroo nguyên bản, cảm giác bóng tuyệt vời không thể sánh bằng.',
     'https://www.mizuno.com/dw/image/v2/BCGC_PRD/on/demandware.static/-/Sites-mizuno-jp-Library/default/dw0c2e64a7/sports/football/footwear/morelia_neo4_elite/p1_morelia_neo4_elite_p1ds-p1dss_01.jpg',
     JSON.stringify(['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800']),
     JSON.stringify(['39','40','41','42','43','44','45']), JSON.stringify(['Trắng/Vàng','Đen']), 1, 0, 4.9, 88],

    ['Nike Tiempo Legend 10 Elite FG', 'nike-tiempo-legend-10-elite-fg', 1, 1, 5400000, 4800000,
     'Giày đá bóng Tiempo với mũi da K-Leather mềm mại, mang lại cảm giác bóng tự nhiên nhất cho tiền đạo và hậu vệ.',
     'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/f8f8e7bc-5e69-4e53-8ce3-8c8e6e0b2a6b/tiempo-legend-10-elite-fg-firm-ground-soccer-cleats-xxMLBV.png',
     JSON.stringify(['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800']),
     JSON.stringify(['38','39','40','41','42','43','44']), JSON.stringify(['Đen/Trắng','Đỏ/Trắng']), 0, 0, 4.6, 134],

    ['Puma King Platinum 21 FG', 'puma-king-platinum-21-fg', 3, 1, 3600000, 3100000,
     'Huyền thoại giày đá bóng Puma King được hồi sinh với thiết kế hiện đại, da mềm mại và đế FG bền bỉ.',
     'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/106889/01/sv01/fnd/PNA/fmt/png/PUMA-King-Platinum-21-FG/AG',
     JSON.stringify(['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800']),
     JSON.stringify(['38','39','40','41','42','43','44','45']), JSON.stringify(['Đen/Trắng']), 0, 0, 4.4, 56],

    ['New Balance Furon v7 Pro FG', 'new-balance-furon-v7-pro-fg', 4, 1, 4400000, null,
     'Giày đá bóng NB Furon với phần mũi giày ôm bàn chân tự nhiên, đế FG cung cấp độ bám đất ổn định.',
     'https://nb.scene7.com/is/image/NB/msf1fc75_nb_02_i?$pdpflexf2$&wid=440&hei=440',
     JSON.stringify(['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800']),
     JSON.stringify(['39','40','41','42','43','44','45']), JSON.stringify(['Đỏ/Đen','Xanh/Trắng']), 0, 1, 4.4, 43],

    ['Nike Streetgato IC', 'nike-streetgato-ic', 1, 3, 2200000, 1900000,
     'Giày futsal Nike Streetgato với đế gum cao su bám sàn tốt, thiết kế cổ thấp linh hoạt cho sân trong nhà.',
     'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/2e6c5d46-1eea-4cd4-ab81-64c50e2c5a2c/streetgato-indoor-court-soccer-shoes-g1h2zB.png',
     JSON.stringify(['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800']),
     JSON.stringify(['36','37','38','39','40','41','42','43','44']), JSON.stringify(['Đen/Trắng','Trắng/Xanh']), 0, 0, 4.5, 178],

    ['Adidas Samba Classic IC', 'adidas-samba-classic-ic', 2, 3, 2600000, null,
     'Biểu tượng giày futsal Adidas Samba với gần 70 năm lịch sử, đế gum và mũi da bền bỉ.',
     'https://assets.adidas.com/images/w_600,f_auto,q_auto/7ab8dafc5eda416c962eaf88015d6283_9366/Samba_Classic_Shoes_White_B75806_01_standard.jpg',
     JSON.stringify(['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800']),
     JSON.stringify(['36','37','38','39','40','41','42','43','44','45']), JSON.stringify(['Trắng/Đen','Đen/Trắng']), 1, 0, 4.7, 389],

    ['Puma Attacanto TF', 'puma-attacanto-tf', 3, 4, 1600000, 1350000,
     'Giày đá bóng sân cứng Puma Attacanto với đinh TF phân bố đều, phù hợp mặt sân bê tông và sân đất.',
     'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/107238/02/sv01/fnd/PNA/fmt/png/Attacanto-TF-Men%27s-Football-Boots',
     JSON.stringify(['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800']),
     JSON.stringify(['36','37','38','39','40','41','42','43','44']), JSON.stringify(['Đen/Vàng','Xanh/Trắng']), 0, 0, 4.2, 267],
  ];

  for (const p of products) {
    insertProduct.run(...p);
  }
}

// Routes
const productsRouter = require('./routes/products')(db);
const ordersRouter = require('./routes/orders')(db);
const contactsRouter = require('./routes/contacts')(db);

app.use('/api/products', productsRouter);
app.use('/api/categories', (req, res) => {
  const cats = db.prepare('SELECT * FROM categories').all();
  res.json(cats);
});
app.use('/api/brands', (req, res) => {
  const brands = db.prepare('SELECT * FROM brands').all();
  res.json(brands);
});
app.use('/api/orders', ordersRouter);
app.use('/api/contacts', contactsRouter);

const adminRouter = require('./routes/admin')(db);
app.use('/api/admin', adminRouter);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
