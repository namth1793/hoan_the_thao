const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  router.post('/', (req, res) => {
    const { customer_name, customer_phone, customer_email, customer_address, items, total, note } = req.body;
    if (!customer_name || !customer_phone || !customer_address || !items || !total)
      return res.status(400).json({ error: 'Thiếu thông tin đơn hàng' });

    const order_code = 'SP' + Date.now().toString().slice(-8);
    const stmt = db.prepare(`INSERT INTO orders (order_code, customer_name, customer_phone, customer_email, customer_address, items, total, note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    const result = stmt.run(order_code, customer_name, customer_phone, customer_email, customer_address,
      JSON.stringify(items), total, note);
    res.json({ success: true, order_code, id: result.lastInsertRowid });
  });

  router.get('/', (req, res) => {
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    res.json(orders.map(o => ({ ...o, items: JSON.parse(o.items) })));
  });

  return router;
};
