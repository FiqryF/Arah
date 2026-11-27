# Implementasi ARAH Phase 3.1 dan 3.2

## 1. Informasi Pekerjaan

ARAH, Adaptive Recovery & Achievement Hub untuk TECHCOMFEST 2027. Pengerjaan 27 November 2026 (Asia/Bangkok). Fase ini mencakup sistem desain publik dan landing page animatif. Batas utama dari pengguna adalah mempertahankan navigasi mobile di dalam aplikasi.

## 2. Ringkasan Eksekutif

Landing page baru berjalan di `/`. Halaman mengenalkan manfaat, delapan modul, alur penggunaan, prinsip privasi, dan demo kalender dengan data ilustratif. Tema dan bahasa memakai preferensi yang sama dengan aplikasi. Menu publik berada di atas landing page. Navigasi kapsul di area user dan admin memakai implementasi Phase 2, dengan animasi kapsul lama menyempit dan memudar.

## 3. Skills yang Digunakan

| Skill | Penerapan | Status |
|---|---|---|
| brainstorming | Menetapkan pemisahan route publik dan shell aplikasi serta arah editorial dari brief | Digunakan |
| frontend-design | Susunan foto utama, tipografi, ruang putih, dan panel demonstrasi | Digunakan |
| ponytail | Memakai React Router, CSS, dan IntersectionObserver yang tersedia | Digunakan |
| impeccable | Panduan motion, pemeriksaan visual, dan detektor desain | Digunakan |
| systematic-debugging | Menelusuri konflik port, nama aksesibel, posisi scroll tes, dan selector ganda | Digunakan |
| verification-before-completion | Build, tes, bukti browser, dan pemeriksaan perubahan | Digunakan |

## 4. Analisis Repository

AGENTS.md, laporan Phase 2, router, provider, stylesheet, dependensi frontend, dan skrip navigasi diperiksa. Route `/` sebelumnya menampilkan landing singkat. `/login`, `/register`, `/app`, dan `/admin` sudah tersedia. Kode shell, navigasi mobile, tema, bahasa, backend, model, dan migrasi berada di luar perubahan.

## 5. Keputusan Desain

Halaman memakai komposisi editorial dengan judul besar, foto lebar, ruang putih, dan permukaan hijau. Menu publik bergaya kaca mengikuti pola logo, masuk, dan tombol menu pada layar kecil. Navigasi aplikasi tetap berada di bawah layar sesuai koreksi pengguna. Tampilan demo memperlihatkan rencana satu hari dengan kalender tepat sebelum daftar tugas.

## 6. Design System

Token landing meliputi warna putih dan hijau, teks sekunder, permukaan, garis, glass, jarak, ukuran judul responsif, serta kurva motion. Tema gelap memakai latar `#071A10` dan aksen `#86C99A`. Plus Jakarta Sans variabel di-host lokal dengan fallback Segoe UI. Kelas `landing-wrap`, `landing-section`, `landing-glass` dan `landing-button` dipakai lintas bagian. Token dibatasi ke landing agar tidak mengubah navigasi yang sudah disetujui.

## 7. Implementasi Liquid Glass

Navbar, panel menu, catatan foto, kartu modul, kontrol dan preview menggunakan permukaan berbeda sesuai konteks. CSS menggabungkan transparansi, border, saturasi, blur dan sorotan tepi. Browser tanpa backdrop-filter mendapat permukaan berwarna yang tetap terbaca.

## 8. Implementasi Landing Page

Navbar menautkan Beranda, Fitur, Cara Kerja, Tentang, masuk dan pendaftaran. Hero menampilkan foto, slogan, CTA pendaftaran, serta tautan fitur. Pengantar dan empat manfaat mendahului delapan modul. Demo terdiri dari header, sapaan, kalender, tugas, check-in, mood/energi, rekomendasi cerdas, NOURISH dan progres. Tanggal demo mengubah contoh tugas dan mengumumkannya melalui live region. Bagian lanjutan memuat tiga langkah, pembeda, privasi, CTA akhir dan footer. Data demo diberi label ilustratif.

## 9. Implementasi Animasi

CSS menangani pemunculan hero, clip reveal, fade, scale, stagger, progress, dan umpan balik hover atau tekan. IntersectionObserver memicu reveal saat konten masuk viewport. Isi sudah terlihat secara default apabila observer tidak tersedia. Preset floating tersedia di CSS, sedangkan lapisan foto memakai parallax berbasis scroll. Kontrol reduced motion mematikan animasi dan transisi nonesensial.

## 10. Implementasi Parallax

Foto hero memakai CSS scroll timeline dengan ruang crop tambahan. Kartu kaca foto bergerak lebih sedikit ke arah berlawanan. Ornamen CTA akhir memakai timeline terpisah. Kartu preview muncul bertahap sepanjang scroll biasa. Browser yang tidak mendukung timeline masih dapat menampilkan semua isi. Browser test mengamati perubahan transform foto tanpa perubahan tinggi dokumen.

## 11. File yang Dibuat atau Diubah

| Path | Perubahan |
|---|---|
| `frontend/src/app/router/routes.tsx` | Menghubungkan landing baru ke `/` |
| `frontend/src/features/landing/LandingPage.tsx` | Navbar, hero, bagian manfaat, demo, CTA, footer, observer |
| `frontend/src/features/landing/content.ts` | Konten lokal Indonesia dan Inggris |
| `frontend/src/features/landing/landing.css` | Token, komposisi, glass, motion, breakpoint |
| `frontend/src/features/landing/LandingPage.test.tsx` | Tes modul, CTA, jadwal, dan fallback foto |
| `frontend/public/images/landing/hero-720.webp` dan `hero-1600.webp` | Foto responsif lokal |
| `frontend/public/fonts/plus-jakarta-sans.woff2` dan `plus-jakarta-sans-OFL.txt` | Font lokal dan lisensi |
| `scripts/landing-smoke.cjs` | Pengujian Chromium dan pengambilan screenshot |
| `docs/assets/IMAGE_SOURCES.md` | Sumber dan lisensi foto/font |
| `docs/reports/evidence/phase-3-landing/` | Delapan screenshot dan satu rekaman |
| `docs/reports/PHASE_3_1_3_2_IMPLEMENTATION_REPORT.md` | Laporan konsolidasi fase ini |

## 12. Dependencies

Manifest aplikasi tidak berubah. React 19.3.1, React Router 7.18.6 dan Lucide 1.77.0 sudah tersedia. Playwright workspace digunakan untuk pengujian. Encoder Playwright FFmpeg v1013 dipasang di `.tools/browser-binaries` untuk rekaman. Backend, database, dan API tidak menerima perubahan.

## 13. Sumber Foto dan Lisensi

Foto Vitaly Gariev diverifikasi sebagai foto gratis berlisensi Unsplash pada halaman sumber. Versi WebP disimpan lokal dengan ukuran sekitar 45 KB dan 117 KB. Sumber, ketentuan atribusi dan lisensi font disimpan di [IMAGE_SOURCES.md](../assets/IMAGE_SOURCES.md).

## 14. Responsive Testing

**PASS.** Chromium memeriksa lebar 320, 360, 375, 390, 430, 768, 1024, 1280, 1440, dan 1920 px. Tidak terdeteksi overflow horizontal. Menu publik mobile dapat dibuka dan ditutup dan beralih ke nav desktop pada 960 px. Suite mobile aplikasi mencakup 320, 390, 768, 1440 px dan animasi transisi.

## 15. Theme & Language Testing

**PASS.** Dua skenario per lebar layar menggunakan terang/Indonesia dan gelap/Inggris. Tes terpisah mengganti tema dan bahasa lewat kontrol lalu memuat ulang untuk memeriksa persistensi. Total 20 kombinasi viewport, tema dan bahasa pada skrip utama.

## 16. Accessibility Review

**PASS** untuk keyboard Enter dan Escape pada menu, nama aksesibel, indikator tanggal terpilih, judul, link CTA, fallback foto, dan preferensi reduced motion pada Chromium. Kontrol menu dan CTA memenuhi tinggi 44 px. Sel kalender mengutamakan tinggi 44 px dan dapat lebih sempit pada layar terkecil agar tujuh hari tetap terlihat. Audit WCAG penuh dan perangkat fisik **NOT RUN**.

## 17. Performance Review

**PASS** untuk pengujian perubahan transform parallax tanpa perubahan tinggi dokumen. Sampel Chromium headless pada localhost, viewport 1440×900, mencatat LCP sekitar 368 ms dan CLS 0,0018 pada satu run. Itu pengukuran lokal tanpa throttling CPU atau jaringan. INP, performa ponsel fisik, dan data lapangan **NOT RUN**. Bundle build sekitar 111 KB gzip JavaScript dan 7,2 KB gzip CSS. Foto hero eager dengan prioritas tinggi dan dua ukuran responsif.

## 18. Screenshot & Visual Evidence

Bukti berada di `docs/reports/evidence/phase-3-landing/`. Full page `390-light.png`, `390-dark.png`, `1440-light.png`, `1440-dark.png`. Potongan `hero-390.png`, `hero-1440.png`, `features.png`, dan `dashboard-preview.png`. Rekaman 5,72 detik berukuran 430×860 telah diputar di Chromium. `landing-demo.webm` menampilkan hero, scroll parallax, menu, tema, reveal, dan interaksi kalender. Pemeriksaan visual meninjau hierarki hero, keterbacaan tema gelap, susunan kartu serta posisi kalender terhadap tugas.

## 19. Error dan Perbaikan

Port 5173 sudah dipakai Vite workspace. Proses yang tersedia dipakai untuk pengujian. Nama tombol tanggal diperjelas dengan label eksplisit. Tes reveal scroll ke heading target dan tes preferensi memilih kontrol navbar desktop secara spesifik. Pemeriksaan visual menemukan celah tak perlu di grid desktop dan sticky navbar yang menutupi potongan screenshot. Distribusi grid diperbaiki dan sticky navbar disembunyikan khusus selama pengambilan gambar potongan. Detektor menandai popularitas Plus Jakarta Sans. Font dipertahankan karena merupakan pilihan eksplisit dalam brief.

## 20. Pekerjaan yang Belum Selesai

Validasi WCAG formal, pengukuran INP, uji perangkat fisik serta lintas browser belum dilakukan. Autentikasi dan fitur bisnis modul tetap berada di fase terpisah.

## 21. Definition of Done

| Kelompok pemeriksaan | Status | Bukti |
|---|---|---|
| AGENTS, Phase 2, skills | PASS | Inspeksi dan penerapan tercatat |
| Token, font, glass, motion | PASS | CSS landing dan aset font lokal |
| Route, lisensi, hero, delapan modul, demo kalender langsung di atas tugas | PASS | Tes, dokumentasi lisensi, screenshot |
| Navbar publik dan preservasi nav mobile aplikasi | PASS | Tes landing dan suite navigasi lama |
| Parallax, reveal, stagger, reduced motion | PASS | Pemeriksaan transform dan reveal nyata di Chromium |
| Responsif, tema, bahasa, CTA dan keyboard | PASS | Matriks 20 skenario dan tes navigasi |
| Build produksi dan suite frontend | PASS | 27 tes lulus |
| Performa lokal dan review visual | PASS | Sampel LCP/CLS, screenshot, rekaman |
| Audit WCAG lengkap dan INP | NOT RUN | Validasi lebih luas di luar bukti sesi ini |
| Backend dan migrasi | NOT RUN | Sumber backend/schema tidak berubah |

## 22. Kesimpulan

**COMPLETED.** Sistem desain publik dan landing page Phase 3.1/3.2 tersedia. Navigasi mobile aplikasi dipertahankan dan lolos pengujian regresi. Bukti pengujian bersifat lokal dan cakupan yang belum diuji dicatat di atas.

## 23. Rekomendasi Berikutnya

Sebelum rilis, tinjau landing pada perangkat fisik dan ukur INP dalam kondisi jaringan dan CPU yang representatif.
