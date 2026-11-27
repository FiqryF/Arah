# Penyempurnaan Liquid Glass dan Kejelasan UI ARAH

## Informasi dan ringkasan

27 November 2026. Revisi visual dan penggunaan mobile. Status **COMPLETED**. Palet baru mengutamakan hijau kebiruan, biru mineral, dan krem lembut. Tema gelap menggunakan permukaan slate-teal dan garis kaca tipis. Warna modul dalam contoh tetap mempunyai identitas tanpa bidang ungu atau amber yang menyolok.

## Skills dan keputusan desain

| Skill | Penerapan |
|---|---|
| brainstorming | Mempertahankan pola kapsul dan menetapkan hierarki mobile, tujuan navigasi, serta cara mencoba produk |
| impeccable | Menggunakan referensi `colorize`, `animate`, dan `clarify` untuk warna, respons motion, dan kejelasan teks |
| ponytail | Menggunakan kembali komponen kapsul, Lucide, foto lokal, dan CSS |
| verification-before-completion | Memeriksa build, interaksi, regresi, integrasi, dan screenshot browser |

Header mobile menggunakan logo daun dan nama ARAH saja. Nav landing memakai ikon garis Lucide yang konsisten untuk Beranda, Modul, Demo, Pengaturan, serta Masuk. Pengaturan membawa pengguna ke kontrol tema dan bahasa. Kapsul area aplikasi mempertahankan rute dan perilaku animasi yang telah disetujui. Tombol utama hero sekarang menuju demo kalender dan tambahan teks hero menjelaskan manfaat ARAH. Tautan daftar tetap tersedia.

Pemilih modul mobile berubah menjadi satu jalur horizontal yang dapat digeser. Tombol panah, informasi posisi, dan petunjuk singkat membuat pilihan di luar area pandang dapat ditemukan. Satu panel aktif muncul di bawahnya. Panel berganti dengan fade, gerakan pendek, dan reveal dari bawah. Foto hero mendapat pembingkaian baru, crop mobile, lapisan lebih tipis, animasi masuk, dan fade menuju halaman. Kaca pada bar dan panel menggunakan lapisan transparan, refleksi tepi, dan shadow kecil. Reduce Motion menonaktifkan reveal, parallax, dan perpindahan nonesensial.

## Perubahan file

| File | Perubahan |
|---|---|
| `frontend/src/components/layout/AppShell.tsx` | Header merek minimal yang dipakai lagi di landing dan halaman publik |
| `frontend/src/app/router/routes.tsx` | Menerapkan header merek pada halaman login dan register |
| `frontend/src/features/landing/LandingPage.tsx` | Tujuan dan ikon dock, CTA demo, jalur pemilih modul serta tombol navigasi |
| `frontend/src/features/landing/content.ts` | Teks manfaat, instruksi modul dan label dalam dua bahasa |
| `frontend/src/features/landing/landing.css` | Palet, bingkai foto, glass, ruang dan animasi |
| `frontend/src/styles/index.css` | Warna modul lintas halaman dan gaya header minimal |
| `scripts/landing-smoke.cjs` | Memeriksa header, tombol modul berikutnya, navigasi dan demo |
| `docs/reports/evidence/ui-glass-clarity/` | Bukti tampilan browser |

## Dependencies, API, dan database

Tidak ada paket, aset foto, endpoint, schema, atau migrasi baru. Demo tetap memakai data ilustratif. Tombol fokus dan label aksesibel menggunakan elemen native. Status pilihan memakai `aria-pressed` atau `aria-current`.

## Verifikasi dan review

| Pemeriksaan | Status | Hasil |
|---|---|---|
| Build dan tes frontend | PASS | Build produksi dan 27 tes |
| Landing Chromium | PASS | 20 skenario di 10 lebar layar 320–1920 px |
| Alur mobile | PASS | Logo, pemilih modul, tombol berikutnya, Demo, Pengaturan dan Masuk |
| Regresi aplikasi | PASS | Delapan skenario kapsul, resize, interupsi dan reduced motion |
| Integrasi | PASS | API, PostgreSQL dan Swagger lokal |
| Visual | PASS | Tinjauan warna, modul, hero dan dock pada viewport mobile |
| Perangkat fisik dan WCAG penuh | NOT RUN | Verifikasi dilakukan di Chromium |

Pada inspeksi pertama foto mobile masih terlalu pudar sehingga lapisan diperingan. Bukti terbaru tersedia pada [hero dan nav](evidence/ui-glass-clarity/mobile-hero-dock.png) dan [pemilih modul](evidence/ui-glass-clarity/mobile-modules-dock.png).

## Definition of Done dan tindak lanjut

Header mobile minimal tersedia, tujuan nav dapat digunakan, contoh modul dapat dijelajahi dengan geser dan tombol, demo dapat ditemukan dari hero, dan tampilan foto serta glass sudah ditinjau. Pengujian terakhir dilakukan di Chromium. Pemeriksaan dengan sentuhan pada perangkat fisik dapat dilanjutkan sebelum rilis.
