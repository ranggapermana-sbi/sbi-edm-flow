# SBI EDM Approval

Portal tempat tim hotel SBI mengajukan EDM, memeriksa sendiri (self-inspection) terhadap EDM Template Guideline 2026, lalu mendapatkan approval dari tim Group Digital Marketing.

- **Hosting**: Vercel (halaman statis + 2 fungsi server di folder `api/`)
- **Database, login, dan penyimpanan screenshot**: Supabase
- **Visual check**: Claude API (opsional)

## Isi repo

| File | Fungsi |
|---|---|
| `index.html`, `app.js` | Tampilan portal: form submit, self-inspection, tickets, overview, guidelines |
| `api/config.js` | Memberi tahu browser alamat Supabase (hanya nilai yang memang aman untuk publik) |
| `api/visual-check.js` | Mengirim screenshot ke Claude. Hanya bisa dipanggil oleh user yang sudah login |
| `api/admin-users.js` | Aksi akun untuk super admin: password cadangan super admin, blokir/buka blokir |
| `api/cleanup.js` | Menghapus tiket dan screenshot yang berumur lebih dari 3 bulan + 1 hari (dijalankan cron harian) |
| `supabase/schema.sql` | Tabel, aturan keamanan, nomor tiket, dan storage screenshot |

## Setup pertama kali

### 1. Supabase: buat project
1. Buat project baru di [supabase.com](https://supabase.com), dengan region **Southeast Asia (Singapore)**.
2. Buka **Project Settings → API** (di versi baru: **Data API / API Keys**), lalu catat dua nilai berikut:
   - **Project URL**, misalnya `https://abcd1234.supabase.co`
   - **anon / publishable key**
   Jangan pernah memakai atau membagikan **service_role / secret key**.

### 2. Supabase: jalankan SQL
1. Buka **SQL Editor → New query**.
2. Paste seluruh isi `supabase/schema.sql`, lalu klik **Run**.
3. Daftarkan reviewer (tim Group Digital Marketing) dengan query berikut:
   ```sql
   insert into public.reviewers (email) values
     ('nama1@swiss-belhotel.com'),
     ('nama2@swiss-belhotel.com')
   on conflict do nothing;
   ```
   Semua email yang ada di tabel ini bisa melihat semua tiket dan memberi keputusan. Email lain otomatis dianggap tim hotel.

### 3. Login: Google (SSO) khusus @swiss-belhotel.com
Semua orang login dengan akun Google @swiss-belhotel.com. Super admin masih bisa memakai password sebagai cadangan kalau Google bermasalah.

**A. Google Cloud Console** (pakai akun @swiss-belhotel.com, di https://console.cloud.google.com):
1. Buat project, misalnya `SBI EDM Portal`.
2. **Google Auth Platform → Branding**: isi nama aplikasi `SBI EDM Approval` dan support email.
3. **Audience**: pilih **Internal**, supaya hanya akun Google Workspace Swiss-Belhotel yang bisa masuk. (Kalau pilihan Internal tidak ada, project belum berada di organisasi swiss-belhotel.com; minta bantuan IT.)
4. **Clients → Create client → Web application**:
   - Authorized JavaScript origins: `https://sbi-edm-approval.vercel.app`
   - Authorized redirect URIs: `https://<project-ref>.supabase.co/auth/v1/callback` (persisnya tertulis di halaman provider Google di Supabase, sebagai *Callback URL*)
5. Salin **Client ID** dan **Client secret**.

**B. Supabase**:
1. **Authentication → Sign In / Providers → Google**: aktifkan, tempel Client ID dan Client secret, lalu Save.
2. **Authentication → URL Configuration**: Site URL `https://sbi-edm-approval.vercel.app`, dan Redirect URLs berisi `https://sbi-edm-approval.vercel.app/**`.

**Yang dijaga database** (lihat `session_ok()` di schema.sql):
- Akun baru di luar @swiss-belhotel.com ditolak saat pertama login.
- Semua tabel dan screenshot hanya bisa dibaca/diubah dari sesi Google @swiss-belhotel.com, atau sesi password milik super admin. Sesi password lama milik hotel/reviewer tidak bisa melihat apa pun.
- Hotel access dan reviewer hanya bisa diisi email @swiss-belhotel.com.

Orang baru cukup login sekali dengan Google, lalu muncul di Access → *Signed in, waiting for access*; tinggal dihubungkan ke hotelnya.

### 4. Vercel: deploy
1. Di [vercel.com](https://vercel.com), pilih **Add New → Project**, lalu import repo `sbi-edm-flow`.
2. Framework preset: **Other**. Build command dan output directory dibiarkan kosong.
3. Isi **Environment Variables**:

   | Nama | Isi | Wajib |
   |---|---|---|
   | `SUPABASE_URL` | Project URL dari langkah 1 | Ya |
   | `SUPABASE_ANON_KEY` | anon / publishable key dari langkah 1 | Ya |
   | `ANTHROPIC_API_KEY` | API key dari console.anthropic.com | Untuk visual check |
   | `ANTHROPIC_MODEL` | Model Claude yang dipakai (default `claude-sonnet-5-5`) | Tidak |

4. Klik **Deploy**. Setelah selesai, salin URL-nya ke Site URL dan Redirect URLs di Supabase (langkah 3.2).

Kalau `ANTHROPIC_API_KEY` belum diisi, portal tetap berjalan dan bagian visual check tampil sebagai "not set up". Setelah key ditambahkan, lakukan **Redeploy** supaya perubahannya berlaku.

### 5. Uji alurnya
1. Login dengan email hotel uji, lalu submit satu EDM.
2. Login dengan email reviewer, buka tiket tersebut (status otomatis berubah menjadi *In review*), lalu klik **Send back for revision**.
3. Login lagi sebagai hotel. Status tiket sekarang *Needs revision*. Klik **Revise and resubmit**: hanya screenshot dan HTML yang bisa diubah.
4. Login sebagai reviewer, klik **Approve**, lalu **Mark as scheduled**.

## Hapus otomatis data lama
Setiap hari pukul 02.00 WIB, Vercel menjalankan `api/cleanup.js`. Tiket yang dibuat lebih dari **3 bulan + 1 hari** lalu dihapus, termasuk review dan semua screenshot-nya, supaya database dan storage Supabase (paket gratis) tidak penuh.

Butuh dua Environment Variable tambahan di Vercel:

| Nama | Isi |
|---|---|
| `SUPABASE_SECRET_KEY` | **Secret key** dari Supabase → Project Settings → API Keys. Hanya dipakai di server, tidak pernah dikirim ke browser. |
| `CRON_SECRET` | Teks acak minimal 16 karakter. Vercel memakainya supaya hanya cron yang bisa menjalankan pembersihan. |

Setelah diisi, lakukan **Redeploy**. Hasil setiap pembersihan bisa dilihat di Vercel → project → **Logs** (filter `/api/cleanup`).

## Report EDM (halaman Reports)

- 14 hari setelah tanggal kirim (Start sending at) sebuah tiket berstatus **Scheduled**, muncul tag **Report due** di Tickets, tombol **Fill in the report** di tiket, dan angka merah di menu Reports untuk akun hotel.
- Hotel mengisi 3 angka dari report Whizzmailer: **Sent**, **Read**, **Unique clicks**. Portal menghitung **Read rate = Read ÷ Sent** dan **Click rate = Unique clicks ÷ Sent**. Read dan unique clicks tidak boleh lebih dari sent.
- Angka bisa dikoreksi selama tiketnya masih ada. Semua PIC hotel yang sama dan reviewer bisa mengisi/mengoreksi.
- Halaman Reports: daftar report yang belum diisi, total (rate dihitung dari jumlah total, bukan rata-rata per EDM), tabel per hotel, tabel per EDM, filter bulan kirim & hotel, dan Download Excel (.xlsx: sheet Summary, By hotel, By EDM, plus Missing reports kalau ada).
- Report disimpan di tabel `edm_reports` dengan salinan hotel, campaign dan tanggal kirim, jadi **tidak ikut terhapus** oleh pembersihan otomatis 3 bulan. Ukurannya sangat kecil. Super admin yang menghapus tiket juga menghapus report-nya.
- Aturan (hanya tiket Scheduled, minimal 14 hari setelah kirim, angka valid, hanya hotelnya sendiri) dijaga oleh fungsi database `submit_report`.

## Akses hotel (halaman Access)
Reviewer mengatur email mana yang boleh submit untuk hotel mana di menu **Access** (`/access`, hanya terlihat oleh reviewer).
- Satu email bisa dihubungkan ke satu hotel, atau beberapa hotel untuk PIC cluster.
- Email yang terhubung ke sebuah hotel bisa melihat dan merevisi **semua tiket hotel itu**, siapa pun pembuatnya, dan hanya bisa submit untuk hotel yang terhubung.
- Orang yang sudah login tetapi belum terhubung ke hotel muncul di bagian *Signed in, waiting for access*.

Di halaman yang sama ada bagian **Reviewers**:
- **Super admin** bisa menambah atau menghapus reviewer, mengubah role (Reviewer / Super admin), dan memberi akses hotel.
- **Reviewer** bisa melihat daftar reviewer dan memberi akses hotel, tetapi tidak bisa mengubah daftar reviewer.
- Minimal harus selalu ada satu super admin; database menolak perubahan yang menghapus super admin terakhir.
- Bagian **Accounts** (khusus super admin): semua akun yang pernah login, cara login (Google), login terakhir, dan tombol **Block/Unblock**. Akun dibuat otomatis saat orang login pertama kali dengan Google. **Reset password** hanya untuk password cadangan super admin; password tidak pernah bisa dilihat siapa pun.
- Super admin juga bisa **menghapus tiket** dari detail tiket (bagian *Super admin* → *Delete ticket*). Review dan semua screenshot tiket itu ikut terhapus, dan tidak bisa dibatalkan.

## Aturan yang dijaga oleh database
- Hotel hanya bisa melihat tiket dan screenshot hotel yang terhubung dengan emailnya. Reviewer bisa melihat semuanya.
- Hotel hanya bisa mengubah tiket saat statusnya draft, atau setelah dikembalikan untuk revisi.
- Hanya reviewer yang bisa menulis keputusan (In review, Approved, Needs revision, Scheduled).
- Nomor tiket (`EDM-<KODE HOTEL>-<YYMM>-<NN>`) diberikan oleh database dan tidak bisa diubah.
- Batas 2 EDM per hotel per bulan dihitung dari semua tiket hotel itu, tanpa membuka isi tiket orang lain.
- Screenshot tidak pernah ditimpa, jadi versi lama tetap bisa dibandingkan.

## Mengubah daftar hotel, brand color, atau checklist
Semua data referensi ada di bagian atas `app.js`:
- `BRANDS`: nama brand dan warna tombol
- `HOTEL_ROWS`: satu baris per hotel, dengan format `KODE|Nama hotel|brand`
- `MANUAL`: item checklist manual

Edit langsung di GitHub, lalu commit. Vercel akan deploy ulang otomatis.

## Biaya
- Supabase dan Vercel: tier gratis cukup untuk skala ini.
- Claude API: dihitung per visual check. Satu kali pengecekan mengirim hingga 8 potongan screenshot.
