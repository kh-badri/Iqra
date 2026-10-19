import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

// Baca .env.local
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

async function checkUsers() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const usersCol = collection(db, 'users');
    const snapshot = await getDocs(usersCol);

    console.log('====================================================');
    console.log(`📊 TOTAL PENGGUNA TERHUBUNG GOOGLE: ${snapshot.size} Orang`);
    console.log('====================================================');

    if (snapshot.empty) {
      console.log('Belum ada pengguna yang tercatat.');
    } else {
      let index = 1;
      snapshot.forEach((docSnap) => {
        const u = docSnap.data();
        console.log(`${index++}. ${u.name || 'Tanpa Nama'} (${u.email || 'Tanpa Email'})`);
        if (u.lastActiveAt) {
          console.log(`   Terakhir Aktif: ${new Date(u.lastActiveAt).toLocaleString('id-ID')}`);
        }
      });
    }
    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('Gagal mengambil data pengguna:', err.message);
    process.exit(1);
  }
}

checkUsers();
