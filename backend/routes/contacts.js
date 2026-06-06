const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  router.post('/', (req, res) => {
    const { name, phone, email, message } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'Thiếu thông tin' });
    db.prepare('INSERT INTO contacts (name, phone, email, message) VALUES (?, ?, ?, ?)').run(name, phone, email, message);
    res.json({ success: true });
  });

  router.get('/', (req, res) => {
    res.json(db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all());
  });

  return router;
};
