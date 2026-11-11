require('dotenv').config();

const express = require('express');
const path = require('path');
const barangRoutes = require('./routes/barang');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/barang', barangRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
});

const port = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Website berjalan di http://localhost:${port}`);
  });
}

module.exports = app;
