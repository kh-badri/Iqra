# Iqra - Production Build for cPanel

Branch ini (`cpanel`) dikhususkan untuk deployment hosting cPanel / Apache.
Semua file di branch ini adalah hasil kompilasi statis (Static Export) yang siap saji dan langsung dapat dijalankan di `public_html`.

## Cara Pasang di cPanel:

### Opsi 1: Lewat cPanel Terminal / SSH
```bash
# 1. Masuk ke direktori public_html atau subdomain
cd ~/public_html/iqra.kbtech.id

# 2. Sinkronkan dengan branch cpanel
git fetch origin cpanel
git reset --hard origin/cpanel
```

### Opsi 2: Lewat Menu "Git™ Version Control" di cPanel
1. Masuk ke cPanel -> Buka menu **Git™ Version Control**.
2. Klik **Manage** -> **Pull or Deploy** -> **Update from Remote**.

## ⏰ Pengaturan Cron Job Adzan Otomatis di cPanel (* * * * *):
Agar notifikasi adzan otomatis masuk ke HP pengguna meski aplikasi/browser ditutup total:
1. Masuk ke cPanel Anda -> Buka menu **Cron Jobs** (Tugas Cron).
2. Pada bagian **Common Settings**, pilih **Once Per Minute (* * * * *)**.
3. Pada kolom **Command**, masukkan perintah:
```bash
/usr/local/bin/php /home/kbtechid/public_html/iqra.kbtech.id/api/cron-adhan.php >/dev/null 2>&1
```
*(Atau bila menggunakan URL)*:
```bash
curl -s https://iqra.kbtech.id/api/cron-adhan.php >/dev/null 2>&1
```
4. Klik **Add New Cron Job**.
Selesai! Server cPanel sekarang akan mengecek jadwal sholat setiap menit dan mengirim sinyal Web Push ke HP pengguna tepat saat adzan tiba.
