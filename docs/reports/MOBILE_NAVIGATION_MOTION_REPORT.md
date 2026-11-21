# Laporan Penyempurnaan Animasi Navigasi Mobile

## 1. Informasi Pekerjaan

ARAH, penyempurnaan UI fondasi Phase 2. Tanggal: 21 November 2026, waktu sesi Asia/Bangkok. Tujuan: perpindahan navigasi lebih halus dan bentuk kapsul aktif lebih tegas. Status: COMPLETED.

## 2. Ringkasan Eksekutif

Latar aktif per-tab diganti satu indikator kaca persisten menggunakan Web Animations API. Revisi terbaru mengikuti instruksi pengguna: kapsul lama menyempit dan memudar di tempatnya, berpindah saat tidak terlihat, kemudian kapsul baru membesar dan muncul di menu tujuan; tidak meluncur melintasi bar. Setelah memeriksa video referensi pengguna, susunan horizontal sebelumnya dikembalikan: hanya tab aktif menampilkan label di samping ikon. Yang disamakan adalah lebar kapsul aktif untuk setiap menu pada viewport yang sama, bukan lebar semua tab aktif/nonaktif. Kapsul aktif memakai lebar 132px pada 390px, menyesuaikan hingga 92px pada layar 320px; tinggi tombol 46px. Stroke, refleksi dan bayangan indikator tetap tegas. Tidak menambah dependency.

## 3. Skills yang Digunakan

| Skill | Tujuan | Penerapan | Status |
|---|---|---|---|
| brainstorming | Perubahan komponen terbatas | Memakai arah kapsul/liquid glass yang sudah disetujui dan feedback pengguna | Used |
| impeccable | Motion dan bentuk | Referensi animate, animasi transform, reduced motion, detector dan inspeksi visual | Used |
| ponytail | Implementasi sederhana | API animasi native dan ResizeObserver, tanpa library baru | Used |
| systematic-debugging | Diagnosis tes animasi | Melacak pemanggilan animasi dan membedakan perubahan URL dari commit React | Used |
| verification-before-completion | Bukti sebelum klaim | Build, tes, browser motion dan diff check | Used |

Skill sebelumnya sudah dibaca pada percakapan ini; referensi animate dibaca pada penyempurnaan ini.

## 4. Pekerjaan yang Dilakukan

- Memeriksa lima frame representatif dari video lokal `WhatsApp Video 2026-11-21 at 18.50.38.mp4` (durasi sekitar 6.8 detik), menggunakan decoding Chrome tanpa mengunggah video.
- Revisi animasi terbaru: indikator shrink-out/fade-out pada pusat posisi lama, relokasi dengan opacity 0, lalu grow-in/fade-in pada posisi tujuan. Total 340ms, easing ease-in-out. Ikon tetap memakai FLIP 260ms; label fade-in 160ms. Bentuk, ukuran dan material yang sudah disetujui dipertahankan.
- Indikator kaca memakai urutan menghilang lalu muncul selama 340ms. Lebar kapsul aktif konsisten antar-menu, tidak bergantung panjang label. Tab nonaktif berupa ikon ringkas dengan pembagian ruang setara. Label tab nonaktif disembunyikan secara visual, nama aksesibel tetap lengkap.
- FLIP transform 260ms menghaluskan pergeseran ikon saat posisi tab aktif berganti. Layout label di bawah ikon dari revisi sebelumnya dibatalkan sesuai koreksi pengguna.
- Pergantian yang diinterupsi menggunakan posisi visual indikator saat ini, bukan memulai ulang dari posisi tab lama.
- Posisi indikator diukur dari elemen aktif; ResizeObserver menyesuaikan ukuran layar. Geometri yang tidak berubah tidak memulai ulang animasi.
- Material kapsul aktif memakai border 1.5px, gradasi transparan lebih jelas, refleksi dan bayangan lebih kuat.
- Reduced motion memindahkan indikator langsung tanpa animasi spasial. Menu, routing dan sidebar tetap mengikuti implementasi yang ada.

## 5. File yang Dibuat atau Diubah

| File | Perubahan | Tujuan |
|---|---|---|
| frontend/src/components/layout/AppShell.tsx | Modified | Indikator persisten, pengukuran responsif dan FLIP ikon |
| frontend/src/styles/index.css | Modified | Kapsul lebih tegas dan gaya indikator bersama |
| scripts/mobile-nav-smoke.cjs | Modified | Tes kapsul aktif konsisten antar-menu, tab horizontal, hanya satu label terlihat, motion, interupsi dan resize |
| README.md | Modified | Menjelaskan susunan horizontal dan lebar kapsul aktif yang konstan |
| docs/reports/evidence/nav-*.png | Refreshed | Bukti visual terbaru; tambahan nav-motion-final.png |
| docs/reports/MOBILE_NAVIGATION_MOTION_REPORT.md | Created | Satu laporan pekerjaan ini |

Tidak mengubah staging, membuat commit atau push.

## 6. Dependencies

Tidak ada perubahan dependency. Memakai React hooks, Web Animations API, DOMMatrixReadOnly dan ResizeObserver yang tersedia di browser target Chrome. Jika animate tidak tersedia, posisi akhir tetap diterapkan langsung. Perangkat lama belum diuji secara menyeluruh.

## 7. Database Changes

Tidak ada perubahan database, data atau migrasi.

## 8. API Changes

Tidak ada perubahan endpoint/kontrak API.

## 9. Testing & Verification

| Pengujian | Metode | Status | Hasil |
|---|---|---|---|
| Build/typecheck | Dari frontend: npm run build | PASS | TypeScript/Vite berhasil |
| Frontend | Dari frontend: npm test | PASS | 25 tes lulus |
| Navigasi browser | node scripts/mobile-nav-smoke.cjs | PASS | Delapan skenario responsif/tema/bahasa, target 44px dan fokus |
| Motion nyata | Skenario tambahan dengan reducedMotion=no-preference | PASS | Animasi native 340ms ada; pada 110ms lebar dan opacity menurun, pusat kapsul tetap di posisi lama; dua keyframe relokasi memiliki opacity 0 |
| Interupsi/resize | Berpindah lagi sebelum animasi selesai, kemudian resize 390→320px | PASS | Indikator selaras dengan posisi dan lebar tab tujuan |
| Lebar kapsul aktif konsisten | Pengukuran DOM saat Tasks→PULIH→Settings | PASS | Lebar aktif identik meskipun panjang label berbeda; tinggi 46px, tab horizontal dan hanya satu label terlihat |
| Reduced motion | Delapan skenario statis dengan preferensi reduce | PASS | State aktif tetap jelas; transisi CSS dinonaktifkan |
| Detector desain | detect.mjs --json pada AppShell dan CSS, run penyempurnaan awal | PASS | Run awal menghasilkan array kosong; tidak dijalankan ulang setelah revisi video, tidak mengklaim hasil scan terbaru |
| Visual | Membuka screenshot terang/gelap terbaru | PASS | Stroke/refleksi kapsul aktif lebih jelas |
| Whitespace | git diff --check | PASS | Tidak ada error whitespace |
| Backend suite | Tidak diulang untuk tugas UI | NOT RUN | Backend dan skema tidak berubah |
| Performa perangkat fisik | Pengukuran FPS iOS/Android | NOT RUN | Bukti motion dari Chrome headless, bukan jaminan FPS semua perangkat |

## 10. Errors & Fixes

Tes motion awal gagal melihat animasi saat sembilan skenario berjalan bersama. Trace membuktikan URL telah berubah tetapi React belum selalu meng-commit tab aktif ketika state dibaca. Tes diperbaiki agar menunggu aria-current pada tujuan. Sampling animasi dibekukan pada waktu yang diketahui sehingga tidak bergantung pada beban mesin. Run akhir lulus. Guard geometri juga mencegah callback ResizeObserver memulai ulang animasi yang sama.

Permintaan ukuran sama sempat ditafsirkan sebagai seluruh tombol berlebar sama dengan label di bawah ikon. Pengguna menolak hasil itu dan memberikan video. Setelah inspeksi video, susunan horizontal dipulihkan dan hanya ukuran kapsul aktif antar-menu dibuat konstan. Build, 25 tes dan sembilan skenario browser (delapan layout plus satu motion) dijalankan ulang dan lulus.

## 11. Security & Quality Review

Tidak menggunakan secret atau mengubah otorisasi. Indikator dekoratif aria-hidden dan pointer-events none; link tetap memiliki nama aksesibel lengkap dan aria-current. Animasi memakai transform scaleX/translateX dan opacity, bukan transisi width/top/left per frame. Perubahan width diterapkan sekali sebagai layout akhir; shrink/grow divisualisasikan melalui scaleX. Relokasi terjadi hanya saat opacity nol. Ikon memakai FLIP 260ms. Observer dilepas saat effect dibersihkan. Preferensi reduced motion tetap dihormati.

## 12. Unfinished Work

Pengujian performa dan visual pada perangkat fisik serta browser selain Chrome belum dilakukan. Tidak mengklaim FPS tertentu.

## 13. Definition of Done

Kapsul lama menyempit/menghilang sebelum kapsul tujuan muncul, lebar kapsul aktif sama antar-menu pada viewport yang sama, hanya label aktif di samping ikon, bentuk kaca tegas, interupsi/resize/reduced motion diperiksa, build dan 25 tes frontend lulus, laporan tersedia. Label lengkap tetap tersedia melalui nama aksesibel dan title; label visual panjang dapat menggunakan ellipsis pada layar sempit.

## 14. Final Conclusion

**COMPLETED.** Perbaikan diterapkan dan motion diverifikasi pada browser. Batas verifikasi perangkat fisik tetap dicatat.

## 15. Next Steps

Tinjau perpindahan di viewport mobile pada frontend lokal; periksa feel animasi pada perangkat pengguna sebelum rilis. Tidak ada commit atau push dilakukan.
