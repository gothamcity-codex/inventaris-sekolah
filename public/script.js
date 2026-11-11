const form = document.getElementById('form-barang');
const tabel = document.getElementById('data-barang');
const pesan = document.getElementById('pesan');
const tombolBatal = document.getElementById('batal');

let idEdit = null;

function beriPesan(teks, berhasil = true) {
  pesan.textContent = teks;
  pesan.className = berhasil ? 'berhasil' : 'gagal';
}

function batalEdit() {
  idEdit = null;
  form.reset();
  document.getElementById('judul-form').textContent = 'Tambah Barang';
  document.getElementById('simpan').textContent = 'Simpan Barang';
  tombolBatal.hidden = true;
}

function mulaiEdit(barang) {
  idEdit = barang.id;
  document.getElementById('nama').value = barang.nama;
  document.getElementById('kategori').value = barang.kategori;
  document.getElementById('jumlah').value = barang.jumlah;
  document.getElementById('ruangan').value = barang.ruangan;
  document.getElementById('kondisi').value = barang.kondisi;
  document.getElementById('judul-form').textContent = 'Edit Barang';
  document.getElementById('simpan').textContent = 'Simpan Perubahan';
  tombolBatal.hidden = false;
  beriPesan('');
  document.getElementById('nama').focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function tampilkanBarang(daftar) {
  tabel.replaceChildren();
  document.getElementById('jumlah-data').textContent = `${daftar.length} jenis barang`;

  if (daftar.length === 0) {
    const baris = document.createElement('tr');
    const kolom = document.createElement('td');
    kolom.colSpan = 7;
    kolom.className = 'kosong';
    kolom.textContent = 'Belum ada barang.';
    baris.appendChild(kolom);
    tabel.appendChild(baris);
    return;
  }

  daftar.forEach((barang, nomor) => {
    const baris = document.createElement('tr');
    const isi = [nomor + 1, barang.nama, barang.kategori, barang.jumlah, barang.ruangan, barang.kondisi];

    isi.forEach((teks) => {
      const kolom = document.createElement('td');
      kolom.textContent = teks;
      baris.appendChild(kolom);
    });

    const kolomAksi = document.createElement('td');
    const edit = document.createElement('button');
    edit.textContent = 'Edit';
    edit.className = 'btn-tabel';
    edit.addEventListener('click', () => mulaiEdit(barang));

    const hapus = document.createElement('button');
    hapus.textContent = 'Hapus';
    hapus.className = 'btn-tabel btn-hapus';
    hapus.addEventListener('click', () => hapusBarang(barang));

    kolomAksi.append(edit, hapus);
    baris.appendChild(kolomAksi);
    tabel.appendChild(baris);
  });
}

async function ambilBarang() {
  try {
    const response = await fetch('/api/barang');
    if (!response.ok) throw new Error('Gagal mengambil daftar barang.');
    const data = await response.json();
    tampilkanBarang(data);
  } catch (error) {
    beriPesan(error.message, false);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const data = {
    nama: document.getElementById('nama').value.trim(),
    kategori: document.getElementById('kategori').value,
    jumlah: Number(document.getElementById('jumlah').value),
    ruangan: document.getElementById('ruangan').value.trim(),
    kondisi: document.getElementById('kondisi').value
  };

  const sedangEdit = idEdit !== null;
  const alamat = sedangEdit ? `/api/barang/${idEdit}` : '/api/barang';
  const method = sedangEdit ? 'PUT' : 'POST';

  try {
    const response = await fetch(alamat, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const hasil = await response.json();
    if (!response.ok) throw new Error(hasil.message || 'Gagal menyimpan barang.');

    batalEdit();
    await ambilBarang();
    beriPesan(sedangEdit ? 'Data barang berhasil diubah.' : 'Barang berhasil ditambahkan.');
  } catch (error) {
    beriPesan(error.message, false);
  }
});

async function hapusBarang(barang) {
  if (!confirm(`Hapus ${barang.nama} dari daftar?`)) return;

  try {
    const response = await fetch(`/api/barang/${barang.id}`, { method: 'DELETE' });
    const hasil = await response.json();
    if (!response.ok) throw new Error(hasil.message || 'Gagal menghapus barang.');

    if (idEdit === barang.id) batalEdit();
    await ambilBarang();
    beriPesan('Barang berhasil dihapus.');
  } catch (error) {
    beriPesan(error.message, false);
  }
}

tombolBatal.addEventListener('click', () => {
  batalEdit();
  beriPesan('');
});

ambilBarang();
