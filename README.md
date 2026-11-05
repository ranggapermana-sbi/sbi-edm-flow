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

### 3. Supabase: login dengan magic link
1. Buka **Authentication → Sign In / Providers → Email**, lalu pastikan **Email** aktif. Opsi "Confirm email" boleh tetap aktif.
2. Buka **Authentication → URL Configuration**:
   - **Site URL**: isi dengan URL Vercel, misalnya `https://sbi-edm-flow.vercel.app`
   - **Redirect URLs**: tambahkan URL yang sama
3. **Penting: atur SMTP sendiri.** Layanan email bawaan Supabase hanya untuk uji coba. Kuotanya sangat kecil, dan (sesuai dokumentasi Supabase saat ini) hanya mengirim ke email anggota tim project. Supaya link login sampai ke email hotel, buka **Authentication → Emails → SMTP Settings** dan isi dengan SMTP perusahaan atau layanan seperti Resend, SendGrid, atau Brevo.
4. Opsional: ubah template **Magic Link** di **Authentication → Emails** supaya isinya menyebut "SBI EDM Approval".

> Siapa yang boleh login? Secara default, siapa pun yang punya link portal bisa login dengan email apa saja. Mereka hanya akan melihat tiketnya sendiri, tetapi bisa ikut submit. Kalau ingin membatasi, matikan **Allow new users to sign up** di Authentication settings, lalu undang email hotel lewat **Authentication → Users → Invite user**.

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

## Akses hotel (halaman Access)
Reviewer mengatur email mana yang boleh submit untuk hotel mana di menu **Access** (`/access`, hanya terlihat oleh reviewer).
- Satu email bisa dihubungkan ke satu hotel, atau beberapa hotel untuk PIC cluster.
- Email yang terhubung ke sebuah hotel bisa melihat dan merevisi **semua tiket hotel itu**, siapa pun pembuatnya, dan hanya bisa submit untuk hotel yang terhubung.
- Orang yang sudah login tetapi belum terhubung ke hotel muncul di bagian *Signed in, waiting for access*.

Di halaman yang sama ada bagian **Reviewers**:
- **Super admin** bisa menambah atau menghapus reviewer, mengubah role (Reviewer / Super admin), dan memberi akses hotel.
- **Reviewer** bisa melihat daftar reviewer dan memberi akses hotel, tetapi tidak bisa mengubah daftar reviewer.
- Minimal harus selalu ada satu super admin; database menolak perubahan yang menghapus super admin terakhir.

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
