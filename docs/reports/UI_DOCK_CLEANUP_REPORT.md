# Perapian navigasi dan modul mobile ARAH

27 November 2026 · **COMPLETED**

## Ringkasan dan kriteria selesai

- Navigasi bawah landing memiliki empat tombol berukuran sama, dengan posisi ikon dan label yang tetap saat pengguna berpindah bagian. Sorotan mengikuti pilihan atau tautan langsung dan tetap stabil saat pengguna menggulir halaman.
- Delapan modul menggunakan kisi 4 × 2 pada tampilan mobile. Semua tombol muat tanpa gulir horizontal. Satu panel detail tampil pada satu waktu dengan tinggi area yang konsisten.
- Bagian demo, tautan menuju demo, dan contoh UI di dalam kartu modul telah dihapus. Tombol utama di hero mengarah ke halaman daftar.
- Gaya liquid glass, tema terang dan gelap, bahasa Indonesia dan Inggris, serta navigasi di dalam aplikasi tercakup dalam pengecekan regresi.

## Implementasi dan kualitas

Pendekatan desain memakai `brainstorming` dan `impeccable` untuk membatasi perubahan ke interaksi yang dilaporkan. `systematic-debugging` membantu menelusuri perubahan lebar tab aktif dan pergantian pilihan saat scroll. `ponytail` diterapkan dengan memakai ulang komponen kapsul. `verification-before-completion` digunakan untuk memeriksa hasil build dan pengujian sebelum penutupan.

| Berkas | Perubahan |
| --- | --- |
| `frontend/src/features/landing/LandingPage.tsx` | Pilihan aktif navigasi bawah mengikuti hash URL. Kontrol pemilih modul dan tautan hero disederhanakan. Demo dan contoh kartu dihapus. |
| `frontend/src/features/landing/content.ts` | Teks demo dan data contoh dihapus. Petunjuk memilih modul diperpendek pada kedua bahasa. |
| `frontend/src/features/landing/landing.css` | Slot navigasi bawah dibuat setara. Kisi modul dan panel detail dirapikan. Dukungan reduced motion dipakai pada transisi. |
| `frontend/src/features/landing/LandingPage.test.tsx` dan `scripts/landing-smoke.cjs` | Regresi tombol daftar, penghapusan demo, ukuran navigasi, dan interaksi modul diperiksa. |

Perubahan berada di frontend dan tidak memerlukan dependensi baru, migrasi basis data, konfigurasi rahasia, atau perubahan API. Perbaikan menargetkan dua sumber pergeseran tampilan, yaitu perubahan ukuran tab aktif dan pemilih modul yang dapat bergulir. Pengujian akhir selesai tanpa error.

## Bukti pengujian

| Pemeriksaan | Status | Hasil |
| --- | --- | --- |
| `npm run build` | PASS | TypeScript dan build produksi Vite selesai. |
| `npm test` | PASS | 27 tes lulus. |
| `node scripts/landing-smoke.cjs` | PASS | 20 skenario Chromium pada lebar 320–1920 px mencakup tema dan bahasa, ukuran tombol, tinggi panel, penghapusan demo, tujuan CTA, dan reduced motion. |
| Chrome, viewport sentuh 390 px dengan animasi aktif | PASS | Koordinat dan ukuran keempat tombol tetap pada setiap frame selama 700 ms saat pengguna membuka Modul, lalu tetap setelah scroll. |
| `node scripts/mobile-nav-smoke.cjs` | PASS | Delapan skenario navigasi aplikasi mencakup perpindahan kapsul, interupsi animasi, resize, fokus, dan reduced motion. |
| Safari iOS dan perangkat fisik | NOT RUN | Verifikasi browser dilakukan di Chrome lokal. |
| Backend, PostgreSQL, dan Alembic | NOT RUN | Perubahan terbatas pada frontend landing. |

[Tampilan akhir modul dan navigasi bawah](evidence/ui-dock-cleanup/mobile-modules-dock.png)

Tidak ada pekerjaan implementasi yang tersisa untuk lingkup ini. Pengujian di Safari iOS dapat dilakukan pada putaran QA lintas perangkat.
