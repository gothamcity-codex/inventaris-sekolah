const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();


function dataValid(data) {
  return data &&
    typeof data.nama === 'string' && data.nama.trim() !== '' && data.nama.length <= 100 &&
    typeof data.kategori === 'string' && data.kategori.trim() !== '' &&
    Number.isInteger(data.jumlah) && data.jumlah >= 0 &&
    typeof data.ruangan === 'string' && data.ruangan.trim() !== '' && data.ruangan.length <= 100 &&
    typeof data.kondisi === 'string' && data.kondisi.trim() !== '';
}

function rapikanData(data) {
  return {
    nama: data.nama.trim(),
    kategori: data.kategori.trim(),
    jumlah: data.jumlah,
    ruangan: data.ruangan.trim(),
    kondisi: data.kondisi.trim()
  };
}

router.get('/', async (req, res) => {
  const daftarBarang = await prisma.barang.findMany({ orderBy: { id: 'asc' } });
  res.json(daftarBarang);
});

router.post('/', async (req, res) => {
  if (!dataValid(req.body)) {
    return res.status(400).json({ message: 'Data barang belum lengkap atau tidak sesuai.' });
  }

  const barangBaru = await prisma.barang.create({ data: rapikanData(req.body) });
  res.status(201).json(barangBaru);
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'ID barang tidak valid.' });
  }

  const barang = await prisma.barang.findUnique({ where: { id } });
  if (!barang) {
    return res.status(404).json({ message: 'Barang tidak ditemukan.' });
  }
  if (!dataValid(req.body)) {
    return res.status(400).json({ message: 'Data barang belum lengkap atau tidak sesuai.' });
  }

  const hasil = await prisma.barang.update({
    where: { id },
    data: rapikanData(req.body)
  });
  res.json(hasil);
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'ID barang tidak valid.' });
  }

  const barang = await prisma.barang.findUnique({ where: { id } });
  if (!barang) {
    return res.status(404).json({ message: 'Barang tidak ditemukan.' });
  }

  await prisma.barang.delete({ where: { id } });
  res.json({ message: 'Barang berhasil dihapus.' });
});

module.exports = router;
