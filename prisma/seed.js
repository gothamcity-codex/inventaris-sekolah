require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const total = await prisma.barang.count();
  if (total > 0) {
    console.log('Database sudah berisi barang. Seed dilewati.');
    return;
  }

  await prisma.barang.createMany({
    data: [
      { nama: 'Proyektor', kategori: 'Elektronik', jumlah: 2, ruangan: 'Kelas 8A', kondisi: 'Baik' },
      { nama: 'Kursi Siswa', kategori: 'Perabot', jumlah: 30, ruangan: 'Kelas 7B', kondisi: 'Baik' },
      { nama: 'Printer', kategori: 'Elektronik', jumlah: 1, ruangan: 'Tata Usaha', kondisi: 'Rusak Ringan' }
    ]
  });
  console.log('3 barang contoh berhasil ditambahkan.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
