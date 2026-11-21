# Referensi Database ARAH — ERD Final Phase 1

Ditinjau secara visual pada 21 November 2026 dari empat gambar yang diberikan pengguna. Dokumen ini adalah pemetaan referensi, **bukan migrasi atau implementasi 22 tabel**. Hanya `users` diimplementasikan pada Phase 2.

## Sumber dan cara membaca

| Sumber | Salinan gambar | Tabel unik baru |
|---|---|---|
| ERD A — User, Auth, Role, Preferences | [Gambar 1](erd/01-user-auth-preferences.png) | 3 |
| ERD 2 — Tasks, Check-in, Recovery, Sleep & Energy | [Gambar 2](erd/02-tasks-wellbeing.png) | 6 |
| ERD 3 — NOURISH, Nutrition, Pantry & Pricing | [Gambar 3](erd/03-nourish-pantry-pricing.png) | 8 |
| ERD 4 — Recommendation, Feedback & Weekly Report | [Gambar 4](erd/04-recommendations-reports.png) | 5 |
| Total | `users`, `recipes`, dan `tasks` yang tampil ulang dihitung sekali | **22** |

Semua nama kolom dan tipe dasar pada gambar dapat dibaca. `PK` = ikon kunci/teks tebal; `FK` = ikon tautan dan garis relasi; `NN` = label not-null terlihat; `UQ` = ikon unique berbentuk sidik jari. Penafsiran ikon mengikuti pemakaian konsisten pada gambar (`users.email`, `recipes.slug`, `food_feedback.recommendation_item_id`); DDL/DBML tetap diperlukan untuk definisi constraint lengkap.

Kolom tanpa `NN` ditulis tanpa marker tersebut, **tidak otomatis dianggap not-null**. Secara tampilan kolom itu tidak ditandai wajib; apakah nullability tersebut disengaja atau penyederhanaan diagram tidak dapat dipastikan dari gambar saja. Primary key secara PostgreSQL selalu not-null walaupun label NN tidak ditampilkan. Panjang varchar, presisi/skala numeric, default, nilai enum/check, nama index/constraint, kebijakan cascade, dan constraint gabungan tidak ditampilkan. Tidak ada klaim bahwa constraint yang tidak terlihat telah diverifikasi. Gambar tidak menetapkan timezone preferensi default; `Asia/Jakarta` berasal dari instruksi finalisasi pengguna.

## A. User, auth, role dan preferences

### 1. users

| Kolom | Tipe pada ERD | Marker terlihat |
|---|---|---|
| id | uuid | PK |
| email | varchar | NN, UQ |
| password_hash | varchar | — |
| role | varchar | NN |
| display_name | varchar | — |
| onboarding_completed | boolean | — |
| created_at | timestamptz | — |
| updated_at | timestamptz | — |

Tidak memiliki FK keluar. Menjadi induk auth, preferences, task, wellbeing, pantry dan rekomendasi.

### 2. auth_identities

| Kolom | Tipe | Marker |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → users.id, NN |
| provider | varchar | NN |
| provider_subject | varchar | NN |
| created_at | timestamptz | — |

User dapat memiliki beberapa identity. Unique gabungan `(provider, provider_subject)` tidak terlihat dan **belum terverifikasi**; jangan mengklaim constraint tersebut berasal dari gambar.

### 3. user_preferences

| Kolom | Tipe | Marker |
|---|---|---|
| user_id | uuid | PK, FK → users.id |
| language | varchar | NN |
| theme | varchar | NN |
| timezone | varchar | — |
| target_sleep_minutes | int | — |
| meal_budget | numeric | — |
| created_at | timestamptz | — |
| updated_at | timestamptz | — |

Tidak ada kolom `id` terpisah. PK user_id membatasi maksimum satu baris preferensi per user, walaupun bentuk garis pada gambar tidak cukup untuk menentukan optionality secara lengkap. Tabel belum dibuat; default preferensi timezone pada aplikasi Phase 2 adalah `Asia/Jakarta`.

## B. Tasks, check-in, recovery, sleep dan energy

### 4. tasks

| Kolom | Tipe | Marker |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → users.id, NN |
| title | varchar | NN |
| description | text | — |
| status | varchar | NN |
| priority | varchar | NN |
| estimated_minutes | int | — |
| energy_cost | int | — |
| deadline_at | timestamptz | — |
| created_at | timestamptz | — |
| updated_at | timestamptz | — |

### 5. task_logs

| Kolom | Tipe | Marker |
|---|---|---|
| id | uuid | PK |
| task_id | uuid | FK → tasks.id, NN |
| event_type | varchar | NN |
| notes | text | — |
| created_at | timestamptz | — |

### 6. daily_checkins

| Kolom | Tipe | Marker |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → users.id, NN |
| checkin_date | date | NN |
| mood | int | — |
| stress | int | — |
| energy | int | — |
| available_minutes | int | — |
| notes | text | — |
| created_at | timestamptz | — |

### 7. recovery_logs

| Kolom | Tipe | Marker |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → users.id, NN |
| activity_type | varchar | — |
| duration_minutes | int | — |
| reflection | text | — |
| completed_at | timestamptz | — |

### 8. sleep_logs

| Kolom | Tipe | Marker |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → users.id, NN |
| sleep_start | timestamptz | NN |
| sleep_end | timestamptz | NN |
| sleep_quality | int | — |
| notes | text | — |
| created_at | timestamptz | — |

### 9. energy_budgets

| Kolom | Tipe | Marker |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → users.id, NN |
| budget_date | date | NN |
| capacity_points | int | — |
| planned_points | int | — |
| created_at | timestamptz | — |

Tidak terlihat constraint gabungan user/tanggal pada daily_checkins atau energy_budgets; rentang mood/stress/energy, status/priority, menit positif dan urutan sleep_end > sleep_start juga tidak ditampilkan. Semua ini perlu keputusan eksplisit pada fase modul terkait.

## C. NOURISH, nutrition, pantry dan pricing

### 10. recipes

| Kolom | Tipe | Marker |
|---|---|---|
| id | uuid | PK |
| slug | varchar | UQ |
| name_id | varchar | NN |
| name_en | varchar | — |
| description | text | — |
| servings | int | NN |
| prep_minutes | int | — |
| cook_minutes | int | — |
| instructions | text | — |
| source_url | varchar | — |
| created_at | timestamptz | — |

`name_id` bertipe varchar, bukan UUID/FK; jangan menafsirkannya sebagai kolom relasi. Slug tidak memiliki label NN pada gambar.

### 11. ingredients

| Kolom | Tipe | Marker |
|---|---|---|
| id | uuid | PK |
| canonical_name | varchar | NN |
| category | varchar | — |
| base_unit | varchar | — |
| created_at | timestamptz | — |

### 12. recipe_ingredients

| Kolom | Tipe | Marker |
|---|---|---|
| id | uuid | PK |
| recipe_id | uuid | FK → recipes.id, NN |
| ingredient_id | uuid | FK → ingredients.id, NN |
| quantity | numeric | — |
| unit | varchar | — |
| grams_equivalent | numeric | — |

Tabel penghubung memiliki PK id sendiri, bukan PK gabungan pada gambar.

### 13. ingredient_nutrients

| Kolom | Tipe | Marker |
|---|---|---|
| id | uuid | PK |
| ingredient_id | uuid | FK → ingredients.id, NN |
| nutrient_code | varchar | NN |
| amount_per_100g | numeric | — |
| unit | varchar | — |
| source | varchar | — |

Tidak terlihat tabel nutrients terpisah maupun FK dari nutrient_code ke tabel lain.

### 14. ingredient_aliases

| Kolom | Tipe | Marker |
|---|---|---|
| id | uuid | PK |
| ingredient_id | uuid | FK → ingredients.id, NN |
| alias_name | varchar | NN |
| source_name | varchar | — |

### 15. price_sources

| Kolom | Tipe | Marker |
|---|---|---|
| id | uuid | PK |
| source_name | varchar | NN |
| source_url | varchar | — |

### 16. ingredient_prices

| Kolom | Tipe | Marker |
|---|---|---|
| id | uuid | PK |
| ingredient_id | uuid | FK → ingredients.id, NN |
| source_id | uuid | FK → price_sources.id, NN |
| province_code | varchar | — |
| price_amount | numeric | — |
| price_unit | varchar | — |
| observed_on | date | — |

Tidak terlihat FK untuk province_code. Mata uang, presisi angka dan satuan tidak didefinisikan oleh gambar.

### 17. pantry_items

| Kolom | Tipe | Marker |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → users.id, NN |
| ingredient_id | uuid | FK → ingredients.id, NN |
| quantity | numeric | — |
| unit | varchar | — |
| expires_on | date | — |
| created_at | timestamptz | — |

## D. Recommendation, feedback dan weekly report

### 18. recommendation_batches

| Kolom | Tipe | Marker |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → users.id, NN |
| recommendation_type | varchar | NN |
| context_snapshot | jsonb | — |
| created_at | timestamptz | — |

### 19. recommendation_items

| Kolom | Tipe | Marker |
|---|---|---|
| id | uuid | PK |
| batch_id | uuid | FK → recommendation_batches.id, NN |
| recipe_id | uuid | FK → recipes.id |
| task_id | uuid | FK → tasks.id |
| ranking_score | numeric | — |
| explanation_factors | jsonb | — |

Gambar tidak menetapkan apakah recipe_id dan task_id harus tepat satu terisi, keduanya boleh terisi, atau keduanya boleh kosong. Jangan menambahkan constraint XOR tanpa keputusan eksplisit.

### 20. food_feedback

| Kolom | Tipe | Marker |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → users.id, NN |
| recommendation_item_id | uuid | FK → recommendation_items.id, NN, UQ |
| choice | varchar | NN |
| feedback_notes | text | — |
| created_at | timestamptz | — |

Ikon unique terlihat pada recommendation_item_id. Ini mengarah ke maksimum satu feedback per recommendation item, bukan otomatis unique gabungan `(user_id, recommendation_item_id)`. Garis relasi bergaya crowfoot tidak menggantikan bukti ikon unique; semantik akhir perlu dikonfirmasi pada DBML sebelum implementasi. Kepemilikan user terhadap batch/item tidak otomatis dijamin hanya oleh dua FK tersebut.

### 21. decision_logs

| Kolom | Tipe | Marker |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → users.id, NN |
| action_type | varchar | NN |
| response | varchar | — |
| context_snapshot | jsonb | — |
| created_at | timestamptz | — |

### 22. weekly_reports

| Kolom | Tipe | Marker |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → users.id, NN |
| week_start | date | NN |
| metrics | jsonb | — |
| summary | text | — |
| generated_at | timestamptz | — |

Tidak terlihat unique gabungan `(user_id, week_start)` atau struktur schema JSONB.

## Perbandingan users: ERD, model, migrasi dan database

Model: `backend/app/models/user.py`. Migrasi terpasang: `backend/alembic/versions/0001_users.py`.

| Kolom / aturan | Gambar 1 | Implementasi Phase 2 | Keputusan finalisasi |
|---|---|---|---|
| id | uuid PK | UUID PK, generator uuid4 pada ORM | Sesuai tipe/PK. Generator tidak ditampilkan ERD; insert SQL tetap perlu id |
| email | varchar NN UQ | varchar(320), NN UQ | Sesuai tipe/marker; panjang 320 merupakan batas implementasi, tidak terverifikasi dari gambar |
| password_hash | varchar tanpa NN | varchar(255), nullable | Sesuai tipe/tampilan opsional; panjang tidak ditentukan gambar |
| role | varchar NN | varchar(16), NN, default user, CHECK user/admin | Sesuai tipe/NN. Default/check berasal aturan dua role Phase 2, bukan bukti gambar |
| display_name | varchar tanpa NN | varchar(100), nullable | Sesuai tipe/tampilan opsional; panjang tidak ditentukan gambar |
| onboarding_completed | boolean tanpa NN | boolean NN, default false | Tipe cocok; NN/default lebih ketat daripada informasi yang ditampilkan gambar |
| created_at | timestamptz tanpa NN | timestamptz NN, default now() | Tipe cocok; NN/default merupakan invariant audit Phase 2 tambahan |
| updated_at | timestamptz tanpa NN | timestamptz NN, default now(), trigger update | Tipe cocok; NN/default/trigger merupakan invariant audit Phase 2 tambahan |
| FK keluar | Tidak ada | Tidak ada | Sesuai |

**Keputusan:** mempertahankan kolom, constraint dan data yang sudah berjalan. Tidak ada nama/tipe dasar/PK/UQ/FK yang perlu diubah. Tidak melepas NN pada onboarding/timestamp, menghapus check role, atau mengubah ukuran varchar hanya berdasarkan informasi yang tidak dinyatakan lengkap pada gambar. Perbedaan tersebut dicatat sebagai keputusan implementasi, **bukan klaim kesamaan DDL persis**. Jika DBML nantinya menegaskan bahwa null harus diterima atau panjang berbeda wajib digunakan, lakukan perubahan melalui migrasi baru.

Tidak diperlukan migrasi skema baru pada finalisasi ini. `0001_users` dipertahankan byte-for-byte, termasuk docstring historis bahwa ERD belum diberikan pada saat migrasi awal dibuat. SHA-256: `2A8F29B0004A0E6C3723187DF2A454F62B7F61E731D274853A7B3CE5867E3976`.

## Kebijakan waktu

- Default preferensi pengguna **Asia/Jakarta**, berasal instruksi finalisasi. Provider frontend dan settings backend menyimpan nilai default yang sama. Belum ada tabel user_preferences atau UI pengaturan timezone.
- PostgreSQL `timestamptz` merepresentasikan instant secara UTC; tidak menyimpan nama zona asal. Semua koneksi SQLAlchemy aplikasi dan Alembic secara eksplisit meminta session UTC. Default database lokal `arah` dan `arah_test` juga disetel UTC, tanpa mengubah timezone sistem operasi.
- Konversi tampilan menggunakan zona pengguna. Contoh: `2026-11-21T18:30:00Z` menjadi 22 November 2026 pukul 01:30 di Jakarta.
- Kolom `date` seperti checkin_date/budget_date/week_start adalah tanggal kalender, bukan instant UTC. Perhitungan tanggal tersebut harus mengikuti zona pengguna ketika modul dibuat; jangan mengonversi date sebagai timestamp secara otomatis.

## Hal yang belum dapat ditetapkan dari gambar

Panjang varchar, presisi numeric, default, enum/check/rentang nilai, nullability tanpa NN yang mungkin disederhanakan, composite unique, indeks performa, cascade FK, optionality relasi, dan aturan retensi/private data belum terdefinisi lengkap. Pemetaan ini tidak menggantikan source DBML untuk detail tersebut. Tidak ada bagian teks yang perlu ditebak atau tabel ke-23 yang diasumsikan.

Sebelum fase berikutnya: tetapkan constraint gabungan, range, ownership dan kebijakan penghapusan berdasarkan kebutuhan modul; konfirmasi konflik garis/unique pada food_feedback serta maksimum satu preferensi per user; tetap buat tabel secara bertahap melalui migrasi baru.
