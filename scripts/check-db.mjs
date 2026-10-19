import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

// Baca konfigurasi dari .env.local
const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const idx = trimmed.indexOf('=');
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
}

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

async function checkDatabase() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('========================================================');
    console.log('🔍 STATUS LIVE DATABASE FIREBASE FIRESTORE (next-js-iqra)');
    console.log('========================================================');

    const usersSnap = await getDocs(collection(db, 'users'));
    console.log(`👤 Total Pengguna Terdaftar Google: ${usersSnap.size} orang\n`);

    for (const userDoc of usersSnap.docs) {
      const u = userDoc.data();
      console.log(`--------------------------------------------------------`);
      console.log(`👤 Pengguna: ${u.name || 'Tanpa Nama'} (${u.email || 'Tanpa Email'})`);
      console.log(`   ID Pengguna: ${userDoc.id}`);
      if (u.lastActiveAt) {
        console.log(`   Terakhir Aktif: ${new Date(u.lastActiveAt).toLocaleString('id-ID')}`);
      }

      // Cek Subkoleksi Murid (students)
      const studentsSnap = await getDocs(collection(db, 'users', userDoc.id, 'students'));
      console.log(`\n   🎓 DAFTAR MURID DI FIREBASE (${studentsSnap.size} murid):`);
      if (studentsSnap.empty) {
        console.log(`      (Belum ada murid yang tersimpan di cloud)`);
      } else {
        let sIdx = 1;
        studentsSnap.forEach((sDoc) => {
          const s = sDoc.data();
          console.log(`      ${sIdx++}. ${s.name} ${s.notes ? `(${s.notes})` : ''} [ID: ${sDoc.id}]`);
        });
      }

      // Cek Subkoleksi Catatan (studyNotes)
      const notesSnap = await getDocs(collection(db, 'users', userDoc.id, 'studyNotes'));
      console.log(`\n   📝 DAFTAR CATATAN BELAJAR DI FIREBASE (${notesSnap.size} catatan):`);
      if (notesSnap.empty) {
        console.log(`      (Belum ada catatan yang tersimpan di cloud)`);
      } else {
        let nIdx = 1;
        notesSnap.forEach((nDoc) => {
          const n = nDoc.data();
          console.log(`      ${nIdx++}. [${n.category?.toUpperCase()}] ${n.title}`);
          console.log(`         Murid/Profil: ${n.studentName}`);
          console.log(`         Posisi Terakhir: ${n.lastPosition}`);
          if (n.notes) console.log(`         Catatan: ${n.notes}`);
          if (n.grade) console.log(`         Predikat: ${n.grade}`);
          console.log(`         Status: ${n.status === 'completed' ? 'Selesai' : 'Sedang Berjalan'}`);
        });
      }
    }

    console.log('========================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Gagal memeriksa database Firebase:', err.message);
    process.exit(1);
  }
}

checkDatabase();
