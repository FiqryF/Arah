# Laporan Perombakan UI ARAH

## Informasi dan hasil

Perombakan tampilan ARAH dikerjakan pada 27 November 2026. Lingkup mencakup landing page, dashboard, shell user dan admin, halaman modul, masuk, pendaftaran, serta fallback route. Status **COMPLETED** untuk revisi visual. Autentikasi dan modul bisnis mengikuti status pengembangan yang ditampilkan di antarmuka.

## Skills dan keputusan desain

| Skill | Penerapan |
|---|---|
| brainstorming | Menetapkan lingkup seluruh UI yang tersedia dan kontrak preservasi nav mobile |
| frontend-design | Merancang hero fotografis, editorial serif, komposisi panel dengan contoh produk, dan palet ARAH |
| impeccable | Memuat konteks dan craft floor, menjalankan detektor desain, dan membandingkan tangkapan lintas ukuran |
| ponytail | Memakai komponen, preferensi, dan teknologi motion yang sudah tersedia |
| verification-before-completion | Memeriksa build, tes, Chrome, integrasi lokal, dan bukti visual |

Foto penuh di belakang judul terpusat mengambil arah komposisi dari referensi hero. Fitur menggunakan panel tak simetris dengan ilustrasi produk berupa kalender kecil, check-in, foto REST, dan indikator progres. Seluruh nama, rute, dan konten menggunakan identitas ARAH. Untuk dashboard dipilih banner yang lebih tenang dan daftar modul yang mengutamakan teks. Newsreader digunakan pada judul dan Plus Jakarta Sans pada antarmuka. Detektor memberi peringatan preferensi tipografi untuk Plus Jakarta Sans. Font dipertahankan untuk memenuhi brief Phase 3.1.

## Perubahan file

| File | Perubahan |
|---|---|
| `frontend/src/features/landing/LandingPage.tsx` | Hero foto penuh, tautan manfaat ke modul, dan contoh visual pada delapan panel |
| `frontend/src/features/landing/content.ts` | Teks alternatif foto dalam dua bahasa |
| `frontend/src/features/landing/landing.css` | Tata letak hero, lapisan kontras, panel fitur, dan parallax |
| `frontend/src/features/landing/LandingPage.test.tsx` | Menyesuaikan tes fallback foto dengan aset baru |
| `frontend/src/features/dashboard/Dashboard.tsx` | Banner editorial dan daftar modul dengan deskripsi terjemahan |
| `frontend/src/components/layout/AppShell.tsx` | Identitas pada header mobile dan sidebar. Komponen `MobileNavigation` dipertahankan |
| `frontend/src/app/router/routes.tsx` | Halaman placeholder dan tautan kembali sesuai area |
| `frontend/src/locales/messages.ts` | Judul daftar modul ID dan EN |
| `frontend/src/styles/index.css` | Tipografi, warna, tema, shell dan halaman pendukung |
| `frontend/public/images/landing/forest-lake-*.webp`, `pangalengan.webp` | Foto lokal dengan variasi ukuran |
| `frontend/public/fonts/newsreader-*.woff2`, `newsreader-OFL.txt` | Tipografi editorial lokal dan dokumen lisensi |
| `scripts/landing-smoke.cjs` | Lokasi bukti dapat dipilih untuk memisahkan screenshot revisi |
| `docs/assets/IMAGE_SOURCES.md` | Kredit fotografer, sumber, dan lisensi |
| `docs/reports/evidence/ui-redesign/` | Screenshot redesign dan regresi tampilan |
| `docs/reports/UI_REDESIGN_IMPLEMENTATION_REPORT.md` | Laporan konsolidasi pekerjaan |

Pemilihan foto diverifikasi dari halaman Unsplash. Hero memakai foto Laughing Zhu dan panel REST memakai foto Pangalengan oleh Muhammad Ruqi Yaddin. Versi hero mobile sekitar 90 KB dan versi lebar sekitar 300 KB. Newsreader dan Plus Jakarta Sans di-host lokal. Lihat [sumber dan lisensi](../assets/IMAGE_SOURCES.md).

## Dependencies, database, dan API

Tidak ada package, schema, migrasi, endpoint, atau pengaturan autentikasi yang berubah. Kalender demo menggunakan data ilustratif. Status koneksi dashboard tetap berasal dari API lokal dan PostgreSQL.

## Verifikasi dan review

| Pemeriksaan | Status | Hasil |
|---|---|---|
| TypeScript dan build | PASS | `npm run build` berhasil |
| Suite frontend | PASS | 27 tes lulus |
| Landing Chromium | PASS | 20 skenario pada 10 lebar 320–1920 px, terang/Indonesia dan gelap/Inggris |
| Perilaku landing | PASS | Menu keyboard, kalender, CTA, persistensi tema/bahasa, reveal, parallax dan reduced motion |
| Regresi nav mobile | PASS | Delapan skenario layout serta shrink/fade, interupsi dan resize |
| Integrasi | PASS | API hidup, PostgreSQL terhubung dan Swagger dapat diakses |
| Halaman publik dan admin | PASS | Login, pendaftaran, harga pangan admin, serta landing mobile/desktop dirender tanpa overflow |
| Review visual | PASS | Hero mobile/desktop, panel fitur, dan dashboard diperiksa dari screenshot |
| `git diff --check` | PASS | Diff lolos pemeriksaan whitespace |
| WCAG formal, INP dan perangkat fisik | NOT RUN | Verifikasi sesi ini menggunakan Chromium dan pengujian aksesibilitas dasar |

Satu sampel Chromium lokal mengukur LCP 328 ms dan CLS 0,0074 pada 1440×900. Sampel tanpa throttling dan tidak mewakili ponsel fisik atau pengguna produksi. Bundle build sekitar 111,6 KB JavaScript dan 8,1 KB CSS setelah gzip. Foto utama memakai `srcset` dan prioritas tinggi. Foto pendukung visual REST dimuat secara lazy.

## Bukti visual

- [Landing desktop](evidence/ui-redesign/landing-desktop.png) dan [landing mobile](evidence/ui-redesign/landing-mobile.png)
- [Landing gelap desktop](evidence/ui-redesign/1440-dark.png) dan [landing gelap mobile](evidence/ui-redesign/390-dark.png)
- [Delapan panel fitur](evidence/ui-redesign/features.png) dan [preview kalender](evidence/ui-redesign/dashboard-preview.png)
- [Dashboard desktop](evidence/ui-redesign/app-desktop.png) dan [dashboard mobile](evidence/ui-redesign/app-mobile.png)
- [Login mobile](evidence/ui-redesign/login-mobile.png), [pendaftaran desktop](evidence/ui-redesign/register-desktop.png), dan [admin mobile](evidence/ui-redesign/admin-mobile.png)

## Kendala, batas, dan tindak lanjut

Ikon dan kapsul mobile dicek setelah perubahan font global karena perubahan metrik bisa menggeser ukuran label aktif. Tidak ada kegagalan regresi pada suite. Detektor desain melaporkan Plus Jakarta Sans sebagai font populer, sementara headline baru memakai Newsreader. Audit WCAG, INP, dan perangkat fisik belum dilakukan. Tahap berikutnya sebelum rilis adalah menilai performa dan aksesibilitas pada perangkat target.

## Definition of Done

Hero mengikuti arah foto alam dan tipografi editorial, panel produk menggunakan contoh ARAH, halaman pendukung menggunakan palet baru, dua tema dan bahasa dapat dipakai, navigasi bawah lolos regresi, build lulus, sumber foto terdokumentasi, dan bukti visual tersedia.
