# Penyempurnaan Landing dan Navigasi Mobile ARAH

## Informasi dan ringkasan

27 November 2026. Status **COMPLETED** untuk penyempurnaan antarmuka. Gradasi warna pada panel, tombol, banner dashboard, dan bar manfaat diganti dengan permukaan warna solid. Foto hero menyatu dengan palet halaman melalui satu transisi lembut di tepi bawah. Refleksi, blur dan border transparan tetap digunakan pada elemen liquid glass.

## Skills dan keputusan desain

| Skill | Penerapan |
|---|---|
| brainstorming | Menerjemahkan referensi pengguna menjadi perubahan terbatas pada hero, modul dan navigasi mobile |
| impeccable | Mengikuti panduan warna, motion dan pemeriksaan visual pada mobile dan desktop |
| ponytail | Menggunakan ulang komponen kapsul dengan animasi yang sudah ada serta kontrol React/CSS ringan |
| verification-before-completion | Memeriksa build, pengujian frontend, regresi browser dan bukti visual |

Di mobile, delapan pilihan modul disusun sebagai kisi ikon 4×2 dengan satu panel detail aktif. Nama lengkap tetap tersedia bagi teknologi asistif. Desktop tetap memperlihatkan delapan panel. Dock publik menghubungkan Beranda, Fitur, Cara Kerja, Tentang dan Pengaturan. Opsi pengaturan mengarah ke kontrol tema dan bahasa di footer. Header publik disembunyikan di layar mobile. Kontrol tema dan bahasa di area aplikasi berada di bawah konten pada mobile. Kapsul aplikasi dan admin mempertahankan tab, ukuran dan animasi shrink/fade.

## Perubahan file

| File | Perubahan |
|---|---|
| `frontend/src/components/layout/AppShell.tsx` | Berbagi komponen kapsul dengan landing, mempertahankan perilaku route aplikasi |
| `frontend/src/features/landing/LandingPage.tsx` | Dock publik, pemilih modul, sinkronisasi hash modul dan preferensi di footer |
| `frontend/src/features/landing/content.ts` | Nama pendek modul untuk dua bahasa |
| `frontend/src/features/landing/landing.css` | Permukaan solid, transisi hero, tata letak mobile, panel aktif dan liquid glass |
| `frontend/src/styles/index.css` | Menyederhanakan warna banner dashboard dan memindahkan kontrol dari atas layar mobile |
| `scripts/landing-smoke.cjs` | Memeriksa dock, keyboard, pilihan modul, dan visibilitas satu panel pada mobile |
| `docs/reports/evidence/ui-mobile-refinement/` | Screenshot tampilan dan interaksi |

## Dependensi, database, dan API

Tidak ada dependensi baru, perubahan API, schema atau migrasi. Pemilih modul dan demo bekerja di state UI, tanpa merekam data pribadi. Kontrol aktif menggunakan `aria-current` atau `aria-pressed`. Pemakaian reduced motion tetap dihormati.

## Pengujian dan review

| Pengujian | Status | Hasil |
|---|---|---|
| Build dan tes frontend | PASS | `npm run build`, 27 tes lulus |
| Landing Chromium | PASS | 20 skenario pada 10 ukuran 320–1920 px, dua tema dan bahasa |
| Navigasi publik | PASS | Dock tampil pada mobile, tautan fitur dapat dipakai lewat keyboard, pengaturan membuka bagian kontrol, dan header mobile tersembunyi |
| Pemilih modul | PASS | Delapan tombol, satu panel mobile, delapan panel desktop, serta demo PULIH berfungsi |
| Regresi kapsul aplikasi | PASS | Delapan skenario layout serta animasi, interupsi, dan resize |
| Integrasi lokal | PASS | API, PostgreSQL dan Swagger terhubung |
| Review visual | PASS | Hero, fade ke warna halaman, dan pemilih modul ditinjau dalam screenshot |
| Audit WCAG penuh dan perangkat fisik | NOT RUN | Bukti berasal dari Chromium dengan viewport terukur |

Tidak ada kegagalan regresi pada pengujian akhir. Verifikasi visual tersedia pada [hero dan dock](evidence/ui-mobile-refinement/mobile-dock-hero.png) serta [pemilih modul dengan dock](evidence/ui-mobile-refinement/mobile-dock-features.png). Pengujian sentuhan pada perangkat fisik masih dapat dilakukan sebelum rilis.

## Definition of Done

Sambungan foto ke halaman memudar secara halus. Mobile mempunyai navigasi bawah dan pilihan modul yang ringkas. Tema liquid glass dan animasi yang disetujui tetap terlihat. Build, pengujian navigasi, dan bukti visual tersedia.
