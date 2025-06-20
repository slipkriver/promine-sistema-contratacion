const express = require('express');
const { db, init } = require('./db');

init();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Basic CRUD for aspirantes
app.get('/aspirantes', (req, res) => {
  db.all('SELECT * FROM aspirantes', [], (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.post('/aspirantes', (req, res) => {
  const data = req.body;
  const cols = Object.keys(data).join(',');
  const placeholders = Object.keys(data).map(() => '?').join(',');
  const values = Object.values(data);
  db.run(`INSERT INTO aspirantes (${cols}) VALUES (${placeholders})`, values, function(err){
    if (err) return res.status(500).json({error: err.message});
    res.json({id: this.lastID});
  });
});

app.get('/aspirantes/:id', (req, res) => {
  db.get('SELECT * FROM aspirantes WHERE id=?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({error: err.message});
    if (!row) return res.status(404).json({error: 'Not found'});
    res.json(row);
  });
});

app.put('/aspirantes/:id', (req, res) => {
  const data = req.body;
  const assignments = Object.keys(data).map(k => `${k}=?`).join(',');
  const values = Object.values(data);
  values.push(req.params.id);
  db.run(`UPDATE aspirantes SET ${assignments} WHERE id=?`, values, function(err){
    if (err) return res.status(500).json({error: err.message});
    res.json({changes: this.changes});
  });
});

app.delete('/aspirantes/:id', (req, res) => {
  db.run('DELETE FROM aspirantes WHERE id=?', [req.params.id], function(err){
    if (err) return res.status(500).json({error: err.message});
    res.json({changes: this.changes});
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
