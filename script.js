const destinasiList = [
  { nama: 'Jakarta', url: 'jakarta.jpg' },
  { nama: 'Bandung', url: 'bandung.jpg' },
  { nama: 'Yogyakarta', url: 'yogyakarta.jpg' },
  { nama: 'Bali', url: 'bali.jpg' },
  { nama: 'Surabaya', url: 'surabaya.jpg' },
  { nama: 'Semarang', url: 'semarang.jpg' },
  { nama: 'Kota Lain', url: 'lain.jpg' },
  { nama: 'Sewa Mobil Saja', url: 'sewamobil.jpg' },
];

const armadaList = [
  { label: 'Avanza', img: 'avanza.png', harga: { 'Jakarta': 500000, 'Bandung': 600000, 'Yogyakarta': 550000, 'Bali': 700000, 'Surabaya': 650000, 'Semarang': 600000, 'Kota Lain': 600000 } },
  { label: 'Innova', img: 'innova.png', harga: { 'Jakarta': 700000, 'Bandung': 800000, 'Yogyakarta': 750000, 'Bali': 900000, 'Surabaya': 850000, 'Semarang': 800000, 'Kota Lain': 800000 } },
  { label: 'Hiace', img: 'hiace.png', harga: { 'Jakarta': 1000000, 'Bandung': 1100000, 'Yogyakarta': 1050000, 'Bali': 1200000, 'Surabaya': 1150000, 'Semarang': 1100000, 'Kota Lain': 1100000 } },
  { label: 'Elf', img: 'elf.png', harga: { 'Jakarta': 900000, 'Bandung': 1000000, 'Yogyakarta': 950000, 'Bali': 1100000, 'Surabaya': 1050000, 'Semarang': 1000000, 'Kota Lain': 1000000 } },
  { label: 'Fortuner', img: 'fortuner.png', harga: { 'Jakarta': 1300000, 'Bandung': 1400000, 'Yogyakarta': 1350000, 'Bali': 1500000, 'Surabaya': 1450000, 'Semarang': 1400000, 'Kota Lain': 1400000 } },
  { label: 'Pajero', img: 'pajero.png', harga: { 'Jakarta': 1500000, 'Bandung': 1600000, 'Yogyakarta': 1550000, 'Bali': 1700000, 'Surabaya': 1650000, 'Semarang': 1600000, 'Kota Lain': 1600000 } },
];

const nomorWA = '6281235368643';

const destinasiSection = document.getElementById('destinations');
destinasiList.forEach((dest, idx) => {
  const card = document.createElement('div');
  card.className = 'card animate__animated animate__fadeInUp';
  card.innerHTML = `
    <span class="card-title">${dest.nama}</span>
    <img src="${dest.url}" alt="${dest.nama}" class="card-img"/>
  `;
  card.onclick = () => showModal(idx);
  destinasiSection.appendChild(card);
});

// MODAL Logic
const modal = document.getElementById('popup-modal');
const modalContent = document.getElementById('modal-inner');
const closeBtn = document.getElementById('modal-closeBtn');
closeBtn.onclick = () => closeModal();
window.onclick = function(event) {
  if (event.target === modal) closeModal();
};

function showModal(index) {
  const dest = destinasiList[index];
  modal.style.display = 'flex';
  let armadaCards = armadaList.map((armada, i) => `
    <div class="armada-card" onclick="window.selectArmada(${i})" id="armada-card-${i}">
      <img src="${armada.img}" alt="${armada.label}">
      <div class="armada-label">${armada.label} - Rp ${armada.harga[dest.nama]}</div>
    </div>
  `).join('');
  modalContent.innerHTML = `
    <img src="${dest.url}" alt="${dest.nama}" class="card-img" style="margin-bottom:0.9rem;"/>
    <div style="margin-bottom:0.8rem;font-weight:700;color:#3a86ff;">${dest.nama}</div>
    <div class="armada-scroll">${armadaCards}</div>
    <form class="selection-form" onsubmit="return false;">
      ${dest.nama==='Kota Lain' ? `
        <label>Masukkan Nama Kota: <input type="text" id="customKota" placeholder="Nama kota tujuan" required></label>
      `:''}
      <label>Pilih Tanggal: <input type="date" id="tanggalInput" required></label>
    </form>
    <button class="button-pesan animate__animated animate__pulse" id="pesanBtn" disabled>Pesan Sekarang</button>
    <button class="button-reset" onclick="closeModal()">Kembali Pilih Destinasi</button>
  `;
  window.selectedArmada = null;
  window.selectedDest = dest.nama;
  window.selectedDestIndex = index;

  // Setup clicks for armada cards
  armadaList.forEach((_, i) => {
    document.getElementById(`armada-card-${i}`).onclick = () => selectArmada(i);
  });

  document.getElementById('tanggalInput').oninput = checkReadyToPesan;
  if(dest.nama==='Kota Lain'){
    document.getElementById('customKota').oninput = checkReadyToPesan;
  }
  document.getElementById('pesanBtn').onclick = () => {
    const tanggal = document.getElementById('tanggalInput').value;
    let kota = window.selectedDest;
    if(window.selectedDest === 'Kota Lain') {
      kota = document.getElementById('customKota').value;
    }
    if(!window.selectedArmada) {
      showToast('Silakan pilih jenis armada terlebih dahulu.');
      return;
    }
    if(!tanggal) {
      showToast('Silakan pilih tanggal keberangkatan terlebih dahulu.');
      return;
    }
    if(window.selectedDest === 'Kota Lain' && !kota) {
      showToast('Silakan masukkan nama kota tujuan.');
      return;
    }
    kirimPesanWA(kota, window.selectedArmada, tanggal);
  };
}

function selectArmada(idx){
  window.selectedArmada = armadaList[idx].label;
  armadaList.forEach((_,i)=>{
    document.getElementById(`armada-card-${i}`).classList.toggle('selected', i===idx);
  });
  checkReadyToPesan();
}

function checkReadyToPesan() {
  const tanggal = document.getElementById('tanggalInput').value;
  const btn = document.getElementById('pesanBtn');
  let kota = window.selectedDest;
  if(window.selectedDest==='Kota Lain'){
    kota = document.getElementById('customKota').value;
  }
  btn.disabled = !(window.selectedArmada && tanggal && kota);
}

function kirimPesanWA(dest, armada, tanggal){
  const armadaIndex = armadaList.findIndex(a => a.label === armada);
  const harga = armadaList[armadaIndex].harga[dest];
  const pesan = `Hallo JERLY TRAVEL, saya ingin memesan mohon konfirmasi ketersediaannya :\nDestinasi: ${dest}\nMobil: ${armada} - Rp ${harga}\nTanggal: ${tanggal}`;
  const url = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;
  window.open(url, "_blank");
}

function showToast(msg) {
  const toast = document.getElementById('toast-notif');
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function closeModal(){
  modal.style.display = 'none';
  window.selectedArmada = null;
  window.selectedDest = null;
  window.selectedDestIndex = null;
}
function selectArmada(idx) {
  window.selectedArmada = armadaList[idx].label;
  
  armadaList.forEach((_, i) => {
    const card = document.getElementById(`armada-card-${i}`);
    card.classList.toggle('selected', i === idx);
    
    // Mengubah konten dan warna saat dipilih
    if (i === idx) {
      card.innerHTML = `
        <img src="${armadaList[idx].img}" alt="${armadaList[idx].label}">
        <div class="armada-label" style="color: #ffffff; background-color: #3a86ff; padding: 0.5rem; border-radius: 5px;">
          ${armadaList[idx].label} - Rp ${armadaList[idx].harga[window.selectedDest]}
        </div>
      `;
    } else {
      card.innerHTML = `
        <img src="${armadaList[i].img}" alt="${armadaList[i].label}">
        <div class="armada-label">${armadaList[i].label} - Rp ${armadaList[i].harga[window.selectedDest]}</div>
      `;
    }
  });
  
  checkReadyToPesan();
}
let armadaCards = armadaList.map((armada, i) => `
  <div class="armada-card" onclick="window.selectArmada(${i})" id="armada-card-${i}">
    <div class="armada-label">${armada.label} - Rp ${armada.harga[dest.nama]}</div>
    <img src="${armada.img}" alt="${armada.label}" class="armada-img"/>
  </div>
`).join('');
if (i === idx) {
  card.innerHTML = `
    <div class="armada-label" style="color: #ffffff; background-color: #3a86ff; padding: 0.5rem; border-radius: 5px;">
      ${armadaList[idx].label} - Rp ${armadaList[idx].harga[window.selectedDest]}
    </div>
    <img src="${armadaList[idx].img}" alt="${armadaList[idx].label}" class="armada-img"/>
  `;
} else {
  card.innerHTML = `
    <div class="armada-label">${armadaList[i].label} - Rp ${armadaList[i].harga[window.selectedDest]}</div>
    <img src="${armadaList[i].img}" alt="${armadaList[i].label}" class="armada-img"/>
  `;
}