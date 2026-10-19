import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

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

console.log('Menginisialisasi Firebase dengan Project ID:', firebaseConfig.projectId);

try {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log('1. Mengirim dan menyimpan data dummy ke Firestore collection "_test_connection"...');
  
  const testDocRef = doc(db, '_test_connection', 'status_uji_koneksi');
  const payload = {
    appName: "Iqra App",
    status: "TERKONEKSI",
    message: "Alhamdulillah, koneksi database Firestore berhasil!",
    waktuPengujian: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
    testedBy: "Antigravity AI Assistant",
  };

  await setDoc(testDocRef, payload);
  console.log('✅ BERHASIL MENYIMPAN! Dokumen berhasil ditulis ke database Firebase Firestore.');

  console.log('2. Membaca kembali dokumen dari Firestore untuk membuktikan data tersimpan...');
  const snapshot = await getDoc(testDocRef);

  if (snapshot.exists()) {
    console.log('✅ BERHASIL MEMBACA DATA! Isi dokumen yang tersimpan:');
    console.log(JSON.stringify(snapshot.data(), null, 2));
    console.log('\n🎉 KESIMPULAN: Firebase Firestore Anda 100% AKTIF, TERKONEKSI, dan BERFUNGSI!');
  } else {
    console.log('❌ Dokumen tidak terbaca.');
  }

  process.exit(0);
} catch (error) {
  console.error('❌ Gagal menguji Firebase:', error.message);
  if (error.code) {
    console.error('Kode Error:', error.code);
  }
  process.exit(1);
}
