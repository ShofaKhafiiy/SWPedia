# 🪐 SWPedia - Panduan Refactoring & Modularisasi JavaScript

Dokumentasi ini dibuat khusus sebagai bahan belajar untuk memahami bagaimana melakukan **Refactoring** (penataan ulang kode) dan **Modularisasi** pada aplikasi JavaScript Vanilla (tanpa framework) menggunakan standar industri yang modern (**ES Modules**).

Refactoring ini dilakukan **tanpa mengubah logika/fungsionalitas** asli aplikasi Anda sama sekali. Semua fitur pengambilan data dari API, manipulasi DOM, penanganan error, serta tampilan visual tetap berjalan persis seperti sebelumnya.

---

## 📂 Struktur Folder Baru yang Profesional

Sebelumnya, seluruh logika aplikasi menumpuk di dalam satu file tunggal, yaitu `app.js`. Struktur ini rentan terhadap masalah pemeliharaan (*maintainability*) seiring bertambahnya fitur aplikasi.

Berikut adalah struktur folder baru yang telah dirapikan:

```text
SWPedia/
├── index.html          # File HTML Utama (Menggunakan script type="module")
├── style.css           # Styling halaman
├── app.js              # Entry Point (Titik masuk utama aplikasi)
└── js/                 # Direktori modul JavaScript
    ├── services/
    │   └── SwapiService.js  # Mengurus komunikasi API (Network Request)
    ├── ui/
    │   └── UiManager.js     # Mengurus manipulasi DOM & Rendering UI
    └── SwapiApp.js          # Orchestrator (Pengatur alur kerja utama aplikasi)
```

---

## 🧠 Konsep Utama: Mengapa Melakukan Modularisasi?

Modularisasi adalah proses membagi kode program yang besar menjadi bagian-bagian kecil (modul) yang mandiri dan memiliki tanggung jawab yang spesifik. Pendekatan ini didasarkan pada salah satu prinsip desain perangkat lunak terbaik: **Single Responsibility Principle (SRP)**.

### Keuntungan Modularisasi:
1. **Separation of Concerns (Pemisahan Tanggung Jawab):** Kode yang mengurusi tampilan (UI) tidak bercampur dengan kode yang mengurusi pengambilan data (API).
2. **Reusability (Dapat Digunakan Kembali):** Modul seperti `SwapiService` dapat diimpor dan digunakan di bagian aplikasi lain tanpa menulis ulang kodenya.
3. **Easier Debugging (Kemudahan Pelacakan Bug):** Jika terjadi error pada pengambilan data, kita langsung tahu bahwa masalahnya ada di dalam `SwapiService.js`. Jika tampilan rusak, kita langsung memeriksa `UiManager.js`.
4. **Readability (Keterbacaan):** File yang lebih kecil jauh lebih mudah dibaca dan dipahami dibandingkan satu file raksasa dengan ratusan baris kode.

---

## 🛠️ Penjelasan Detail Setiap Modul

### 1. `js/services/SwapiService.js` (Layanan API)
Modul ini memegang tanggung jawab tunggal untuk melakukan komunikasi dengan Star Wars API (SWAPI). Modul ini sama sekali tidak mengetahui tentang HTML, tombol, select box, atau class CSS. Ia hanya mengambil data (*fetch*) dan mengembalikannya dalam bentuk objek JavaScript bersih.

*   **Metode:**
    *   `fetchAllCharacters()`: Mengambil daftar seluruh karakter dengan teknik paginasi loop `while`.
    *   `fetchDetailCharacter(urlCharacter)`: Mengambil detail informasi dari satu karakter tertentu berdasarkan URL-nya.
    *   `fetchMovieTitles(movieUrls)`: Mengambil judul film secara paralel menggunakan `Promise.all`.

---

### 2. `js/ui/UiManager.js` (Manajer Tampilan)
Modul ini bertanggung jawab penuh atas manipulasi DOM. Ia bertugas menampilkan loader, pesan awal, pesan kesalahan, mengisi opsi dropdown karakter, serta merender detail informasi karakter lengkap dengan gambar placeholder dan daftar penampilan filmnya.

*   **Metode:**
    *   `showLoading(message)`: Menampilkan spinner animasi loading.
    *   `showInitialMessage()`: Menampilkan instruksi awal untuk memilih karakter.
    *   `showError(message)`: Menampilkan pesan kesalahan berwarna merah jika Force terganggu.
    *   `populateCharacterSelect(characters)`: Memasukkan daftar karakter ke dalam elemen `<select>` secara urut abjad (*alphabetical*).
    *   `displayCharacterDetails(character, filmTitles)`: Menyusun layout Grid Tailwind untuk menampilkan potret karakter, statistik fisik, dan daftar film terkait.

---

### 3. `js/SwapiApp.js` (Pengatur Aplikasi)
Modul ini bertindak sebagai **Orchestrator** atau penghubung. Modul ini mengimpor `SwapiService` dan `UiManager` lalu mengatur bagaimana keduanya berinteraksi.

*   **Cara Kerja:**
    1.  Membuat instansiasi `new SwapiService()` dan `new UiManager()`.
    2.  `init()`: Meminta data karakter dari service, kemudian mengirimkannya ke UI manager untuk dimasukkan ke dropdown, serta memasang event listener "change" pada dropdown.
    3.  `handleCharacterSelect(event)`: Mengambil ID karakter yang dipilih, meminta UI manager menampilkan status loading, melakukan fetch detail karakter dan film lewat service secara asinkron, kemudian meminta UI manager merender hasilnya.

---

### 4. `app.js` (Entry Point Utama)
File di direktori root ini bertindak sebagai gerbang masuk pertama aplikasi saat dimuat oleh browser. Isinya dibuat seminimal mungkin, hanya mengimpor `SwapiApp` dan menginisialisasinya setelah dokumen HTML sepenuhnya selesai dimuat (`DOMContentLoaded`).

```javascript
import SwapiApp from "./js/SwapiApp.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = new SwapiApp();
  app.init();
});
```

---

## 🚀 Cara Menjalankan Aplikasi di Lokal

Karena sekarang kita menggunakan **ES Modules** (`import` / `export`), browser menerapkan kebijakan keamanan yang ketat (**CORS**). Jika Anda membuka `index.html` langsung dengan cara klik ganda (*double-click* atau protokol `file://`), browser akan memblokir impor modul dan menampilkan error di konsol.

Untuk menjalankannya, Anda **wajib menggunakan local web server**. Berikut beberapa metode yang sangat mudah:

### Pilihan 1: Menggunakan VS Code Extension (Sangat Direkomendasikan)
1. Buka folder proyek ini di **Visual Studio Code**.
2. Instal ekstensi bernama **Live Server** oleh Ritwick Dey.
3. Klik kanan pada file `index.html` dan pilih **"Open with Live Server"**.
4. Aplikasi akan otomatis terbuka di browser Anda dengan alamat `http://127.0.0.1:5500/`.

### Pilihan 2: Menggunakan Node.js (via Terminal)
Jika Anda memiliki Node.js terinstal, jalankan perintah berikut di terminal pada direktori proyek Anda:
```bash
# Menjalankan server instan tanpa instalasi permanen
npx serve .
```
Lalu buka alamat localhost yang diberikan (biasanya `http://localhost:3000` atau `http://localhost:5000`) pada browser Anda.

---

## 🎓 Ringkasan Sintaks ES Modules untuk Belajar

Berikut adalah contekan cepat sintaks ES Modules yang digunakan pada proyek ini:

1.  **Ekspor Class (Default Export):**
    ```javascript
    // Di dalam file js/services/SwapiService.js
    export default class SwapiService { ... }
    ```
2.  **Impor Class:**
    ```javascript
    // Di dalam file js/SwapiApp.js
    import SwapiService from "./services/SwapiService.js";
    ```
    *Catatan Penting: Pada JavaScript vanilla di browser, Anda wajib menuliskan ekstensi file secara lengkap (misalnya `.js` di akhir path).*
3.  **Deklarasi Modul pada HTML:**
    ```html
    <!-- Di dalam file index.html -->
    <script type="module" src="app.js"></script>
    ```
    Atribut `type="module"` memberi tahu browser bahwa script ini berhak menggunakan fitur `import` dan `export` serta secara otomatis berjalan dalam mode aman (*strict mode*) dan bersifat *deferred* (selesai dimuat setelah HTML selesai diparsing).

---

Selamat mempelajari struktur kode baru Anda yang jauh lebih bersih, rapi, profesional, dan siap dikembangkan ke skala yang lebih besar! Semoga kekuatan Force selalu menyertai Anda! 🌌✨
