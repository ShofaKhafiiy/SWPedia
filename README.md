# 🪐 SWPedia - Star Wars Character Explorer

**SWPedia** adalah aplikasi web ringan yang memungkinkan Anda menjelajahi karakter-karakter dari alam semesta *Star Wars* secara interaktif. Cukup pilih karakter dari daftar, dan semua informasi detailnya — dari tinggi badan hingga film tempat ia tampil — akan muncul dalam sekejap.

Dibangun dengan **JavaScript Vanilla (ES Modules)**, ditenagai oleh **SWAPI (Star Wars API)**, dan ditata dengan **Tailwind CSS**.

## ✨ Fitur

- **Pencarian Karakter Interaktif** — Pilih karakter dari dropdown yang telah diurutkan berdasarkan abjad.
- **Informasi Detail Lengkap** — Lihat data fisik (tinggi, berat, warna rambut, dll.) serta daftar film tempat karakter tersebut tampil.
- **Loading & Error Handling** — Tampilan loading yang halus serta penanganan error apabila koneksi bermasalah.
- **Responsive Design** — Tampilan yang optimal di perangkat seluler maupun desktop berkat Tailwind CSS.
- **Modular Codebase** — Kode terorganisir rapi dengan standar ES Modules modern.

## 🚀 Cara Menjalankan

Karena aplikasi menggunakan **ES Modules (`import/export`)**, Anda harus menjalankannya melalui local web server:

```bash
npx serve .
```

Atau gunakan ekstensi **Live Server** di VS Code, lalu klik kanan `index.html` → **Open with Live Server**.

## 🛠️ Tech Stack

| Teknologi | Kegunaan |
|-----------|----------|
| JavaScript (ES Modules) | Logika aplikasi & modularisasi kode |
| [SWAPI](https://swapi.tech/) | REST API sumber data Star Wars |
| [Tailwind CSS](https://tailwindcss.com/) | Styling utility-first via CDN |

## 📖 Dokumentasi

Untuk mempelajari proses refactoring dan modularisasi kode secara mendalam, lihat file [`doc.md`](./doc.md).

---

> *"May the Force be with you."* 🚀✨
