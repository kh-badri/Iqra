import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { getFirebaseFirestore, isFirebaseReady } from '@/lib/firebase';
import {
  db,
  type BookmarkItem,
  type LastReadItem,
  type StudyNote,
  type StudentProfile,
} from '@/lib/db';
import { useAuthStore } from '@/features/auth/authStore';

// Mengubah refId menjadi ID dokumen yang aman untuk Firestore (misal 'ayah-1-1')
function getSafeDocId(refId: string): string {
  return encodeURIComponent(refId).replace(/%/g, '_');
}

/**
 * Sinkronisasi dua arah (Two-way Sync) antara IndexedDB lokal dan Firebase Firestore
 */
export async function syncAllUserData(userId: string): Promise<{
  success: boolean;
  syncedBookmarks: number;
  message?: string;
}> {
  if (!userId || userId === 'guest') {
    return { success: false, syncedBookmarks: 0, message: 'User belum login' };
  }

  const firestore = getFirebaseFirestore();
  if (!firestore) {
    return {
      success: false,
      syncedBookmarks: 0,
      message: 'Firebase belum dikonfigurasi',
    };
  }

  try {
    // 0. Catat data user di koleksi 'users' agar pemilik aplikasi bisa memantau jumlah & daftar pengguna
    try {
      const userDocRef = doc(firestore, 'users', userId);
      const userState = useAuthStore.getState().user;
      await setDoc(
        userDocRef,
        {
          googleId: userId,
          name: userState.name || 'Pengguna Google',
          email: userState.email || '',
          picture: userState.picture || '',
          lastActiveAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (userErr) {
      console.warn('Gagal mencatat info pengguna ke Firestore:', userErr);
    }

    const bookmarksCol = collection(firestore, `users/${userId}/bookmarks`);

    // 1. Ambil data bookmark dari Cloud Firestore
    const remoteSnapshot = await getDocs(bookmarksCol);
    const remoteBookmarks: Record<string, any> = {};
    remoteSnapshot.forEach((docSnap) => {
      remoteBookmarks[docSnap.id] = docSnap.data();
    });

    // 2. Ambil data bookmark dari IndexedDB lokal
    const localBookmarks = await db.bookmarks.toArray();
    const localMap = new Map<string, BookmarkItem>();
    for (const b of localBookmarks) {
      localMap.set(getSafeDocId(b.refId), b);
    }

    let syncedCount = 0;

    // A. Sinkronisasi Cloud -> Lokal: Jika di Cloud ada tapi di lokal belum ada
    for (const [docId, remoteData] of Object.entries(remoteBookmarks)) {
      if (!localMap.has(docId)) {
        await db.bookmarks.add({
          type: remoteData.type,
          refId: remoteData.refId,
          title: remoteData.title,
          subtitle: remoteData.subtitle,
          extraData: remoteData.extraData,
          createdAt: remoteData.createdAt || Date.now(),
        });
        syncedCount++;
      }
    }

    // B. Sinkronisasi Lokal -> Cloud: Jika di lokal ada tapi di Cloud belum ada
    for (const [docId, localItem] of Array.from(localMap.entries())) {
      if (!remoteBookmarks[docId]) {
        await setDoc(doc(firestore, `users/${userId}/bookmarks`, docId), {
          type: localItem.type,
          refId: localItem.refId,
          title: localItem.title,
          subtitle: localItem.subtitle || '',
          extraData: localItem.extraData || null,
          createdAt: localItem.createdAt || Date.now(),
          updatedAt: Date.now(),
        });
        syncedCount++;
      }
    }

    // 3. Sinkronisasi Riwayat Baca Terakhir (Last Read)
    try {
      const lastReadDocRef = doc(firestore, `users/${userId}/profile`, 'lastRead');
      const lastReadSnap = await getDoc(lastReadDocRef);
      const localLastRead = await db.lastRead.orderBy('timestamp').reverse().first();

      if (lastReadSnap.exists()) {
        const remoteLastRead = lastReadSnap.data() as LastReadItem;
        if (!localLastRead || remoteLastRead.timestamp > localLastRead.timestamp) {
          // Cloud lebih baru, perbarui lokal
          await db.lastRead.clear();
          await db.lastRead.add({
            surahNumber: remoteLastRead.surahNumber,
            surahName: remoteLastRead.surahName,
            ayahNumber: remoteLastRead.ayahNumber,
            timestamp: remoteLastRead.timestamp,
          });
        } else if (localLastRead && localLastRead.timestamp > remoteLastRead.timestamp) {
          // Lokal lebih baru, perbarui Cloud
          await setDoc(lastReadDocRef, {
            surahNumber: localLastRead.surahNumber,
            surahName: localLastRead.surahName,
            ayahNumber: localLastRead.ayahNumber,
            timestamp: localLastRead.timestamp,
          });
        }
      } else if (localLastRead) {
        // Belum ada di Cloud, unggah dari lokal
        await setDoc(lastReadDocRef, {
          surahNumber: localLastRead.surahNumber,
          surahName: localLastRead.surahName,
          ayahNumber: localLastRead.ayahNumber,
          timestamp: localLastRead.timestamp,
        });
      }
    } catch (lastReadErr) {
      console.warn('Gagal sinkronisasi lastRead:', lastReadErr);
    }

    // 4. Sinkronisasi Catatan Belajar (studyNotes)
    try {
      const notesCol = collection(firestore, `users/${userId}/studyNotes`);
      const remoteNotesSnap = await getDocs(notesCol);
      const remoteNotes: Record<string, StudyNote> = {};
      remoteNotesSnap.forEach((docSnap) => {
        remoteNotes[docSnap.id] = docSnap.data() as StudyNote;
      });

      const localNotes = await db.studyNotes.toArray();
      const localNotesMap = new Map<string, StudyNote>();
      for (const n of localNotes) {
        const key = n.uid || `note_${n.id}`;
        localNotesMap.set(key, n);
      }

      // Cloud -> Lokal
      for (const [docId, remoteNote] of Object.entries(remoteNotes)) {
        const local = localNotesMap.get(docId);
        if (!local) {
          await db.studyNotes.add({
            uid: docId,
            studentName: remoteNote.studentName || 'Diri Sendiri',
            category: remoteNote.category || 'quran',
            title: remoteNote.title || 'Materi Belajar',
            lastPosition: remoteNote.lastPosition || '-',
            resumeUrl: remoteNote.resumeUrl || '',
            notes: remoteNote.notes || '',
            grade: remoteNote.grade || '',
            status: remoteNote.status || 'ongoing',
            createdAt: remoteNote.createdAt || Date.now(),
            updatedAt: remoteNote.updatedAt || Date.now(),
          });
          syncedCount++;
        } else if (remoteNote.updatedAt && remoteNote.updatedAt > (local.updatedAt || 0)) {
          await db.studyNotes.update(local.id!, {
            studentName: remoteNote.studentName,
            category: remoteNote.category,
            title: remoteNote.title,
            lastPosition: remoteNote.lastPosition,
            resumeUrl: remoteNote.resumeUrl,
            notes: remoteNote.notes,
            grade: remoteNote.grade,
            status: remoteNote.status,
            updatedAt: remoteNote.updatedAt,
          });
        }
      }

      // Lokal -> Cloud
      for (const [docId, localNote] of Array.from(localNotesMap.entries())) {
        if (!remoteNotes[docId]) {
          await setDoc(doc(firestore, `users/${userId}/studyNotes`, docId), {
            uid: docId,
            studentName: localNote.studentName,
            category: localNote.category,
            title: localNote.title,
            lastPosition: localNote.lastPosition,
            resumeUrl: localNote.resumeUrl || '',
            notes: localNote.notes || '',
            grade: localNote.grade || '',
            status: localNote.status,
            createdAt: localNote.createdAt || Date.now(),
            updatedAt: localNote.updatedAt || Date.now(),
          });
          syncedCount++;
        }
      }
    } catch (notesErr) {
      console.warn('Gagal sinkronisasi studyNotes:', notesErr);
    }

    // 5. Sinkronisasi Data Profil Murid (students)
    try {
      const studentsCol = collection(firestore, `users/${userId}/students`);
      const remoteStudentsSnap = await getDocs(studentsCol);
      const remoteStudents: Record<string, StudentProfile> = {};
      remoteStudentsSnap.forEach((docSnap) => {
        remoteStudents[docSnap.id] = docSnap.data() as StudentProfile;
      });

      const localStudents = await db.students.toArray();
      const localStudentsMap = new Map<string, StudentProfile>();
      for (const s of localStudents) {
        const key = s.uid || `student_${s.id}`;
        localStudentsMap.set(key, s);
      }

      // Cloud -> Lokal
      for (const [docId, remoteStudent] of Object.entries(remoteStudents)) {
        if (!localStudentsMap.has(docId)) {
          const exists = await db.students.where('name').equalsIgnoreCase(remoteStudent.name).first();
          if (!exists) {
            await db.students.add({
              uid: docId,
              name: remoteStudent.name,
              notes: remoteStudent.notes || '',
              createdAt: remoteStudent.createdAt || Date.now(),
              updatedAt: remoteStudent.updatedAt || Date.now(),
            });
            syncedCount++;
          }
        }
      }

      // Lokal -> Cloud
      for (const [docId, localStudent] of Array.from(localStudentsMap.entries())) {
        if (!remoteStudents[docId]) {
          await setDoc(doc(firestore, `users/${userId}/students`, docId), {
            uid: docId,
            name: localStudent.name,
            notes: localStudent.notes || '',
            createdAt: localStudent.createdAt || Date.now(),
            updatedAt: localStudent.updatedAt || Date.now(),
          });
          syncedCount++;
        }
      }
    } catch (studentsErr) {
      console.warn('Gagal sinkronisasi students:', studentsErr);
    }

    console.log(`[Firebase Sync] Sukses sinkronisasi data user ${userId} (${syncedCount} item)`);
    return { success: true, syncedBookmarks: syncedCount };
  } catch (err: any) {
    console.warn('[Firebase Sync] Gagal menyinkronkan:', err);
    return { success: false, syncedBookmarks: 0, message: err?.message };
  }
}

/**
 * Unggah atau perbarui satu bookmark ke Cloud
 */
export async function syncUploadBookmark(userId: string, bookmark: BookmarkItem) {
  if (!userId || userId === 'guest') return;
  const firestore = getFirebaseFirestore();
  if (!firestore) return;

  try {
    const docId = getSafeDocId(bookmark.refId);
    await setDoc(doc(firestore, `users/${userId}/bookmarks`, docId), {
      type: bookmark.type,
      refId: bookmark.refId,
      title: bookmark.title,
      subtitle: bookmark.subtitle || '',
      extraData: bookmark.extraData || null,
      createdAt: bookmark.createdAt || Date.now(),
      updatedAt: Date.now(),
    });
  } catch (err) {
    console.warn('Gagal mengunggah bookmark ke Cloud:', err);
  }
}

/**
 * Hapus satu bookmark dari Cloud
 */
export async function syncDeleteBookmark(userId: string, refId: string) {
  if (!userId || userId === 'guest') return;
  const firestore = getFirebaseFirestore();
  if (!firestore) return;

  try {
    const docId = getSafeDocId(refId);
    await deleteDoc(doc(firestore, `users/${userId}/bookmarks`, docId));
  } catch (err) {
    console.warn('Gagal menghapus bookmark dari Cloud:', err);
  }
}

/**
 * Unggah riwayat baca terakhir ke Cloud
 */
export async function syncUploadLastRead(userId: string, item: LastReadItem) {
  if (!userId || userId === 'guest') return;
  const firestore = getFirebaseFirestore();
  if (!firestore) return;

  try {
    const lastReadDocRef = doc(firestore, `users/${userId}/profile`, 'lastRead');
    await setDoc(lastReadDocRef, {
      surahNumber: item.surahNumber,
      surahName: item.surahName,
      ayahNumber: item.ayahNumber,
      timestamp: item.timestamp || Date.now(),
    });
  } catch (err) {
    console.warn('Gagal mengunggah lastRead ke Cloud:', err);
  }
}

/**
 * Unggah atau perbarui catatan belajar ke Cloud
 */
export async function syncUploadStudyNote(userId: string, note: StudyNote) {
  if (!userId || userId === 'guest') return;
  const firestore = getFirebaseFirestore();
  if (!firestore) return;

  try {
    const docId = note.uid || (note.id ? `note_${note.id}` : `note_${Date.now()}`);
    await setDoc(doc(firestore, `users/${userId}/studyNotes`, docId), {
      uid: docId,
      studentName: note.studentName,
      category: note.category,
      title: note.title,
      lastPosition: note.lastPosition,
      resumeUrl: note.resumeUrl || '',
      notes: note.notes || '',
      grade: note.grade || '',
      status: note.status,
      createdAt: note.createdAt || Date.now(),
      updatedAt: note.updatedAt || Date.now(),
    });
  } catch (err) {
    console.warn('Gagal mengunggah studyNote ke Cloud:', err);
  }
}

/**
 * Hapus catatan belajar dari Cloud
 */
export async function syncDeleteStudyNote(userId: string, docId: string) {
  if (!userId || userId === 'guest') return;
  const firestore = getFirebaseFirestore();
  if (!firestore) return;

  try {
    await deleteDoc(doc(firestore, `users/${userId}/studyNotes`, docId));
  } catch (err) {
    console.warn('Gagal menghapus studyNote dari Cloud:', err);
  }
}

/**
 * Unggah atau perbarui data murid ke Cloud
 */
export async function syncUploadStudent(userId: string, student: StudentProfile) {
  if (!userId || userId === 'guest') return;
  const firestore = getFirebaseFirestore();
  if (!firestore) return;

  try {
    const docId = student.uid || (student.id ? `student_${student.id}` : `student_${Date.now()}`);
    await setDoc(doc(firestore, `users/${userId}/students`, docId), {
      uid: docId,
      name: student.name,
      notes: student.notes || '',
      createdAt: student.createdAt || Date.now(),
      updatedAt: student.updatedAt || Date.now(),
    });
  } catch (err) {
    console.warn('Gagal mengunggah student ke Cloud:', err);
  }
}

/**
 * Hapus data murid dari Cloud
 */
export async function syncDeleteStudent(userId: string, docId: string) {
  if (!userId || userId === 'guest') return;
  const firestore = getFirebaseFirestore();
  if (!firestore) return;

  try {
    await deleteDoc(doc(firestore, `users/${userId}/students`, docId));
  } catch (err) {
    console.warn('Gagal menghapus student dari Cloud:', err);
  }
}

let isDexieSyncInitialized = false;

/**
 * Listener otomatis: Memasang hook ke Dexie agar penambahan & penghapusan
 * bookmark, catatan belajar, dan data murid lokal otomatis tersinkron ke Firebase jika pengguna terhubung Google
 */
export function initializeDexieCloudSync() {
  if (typeof window === 'undefined') return;
  if (isDexieSyncInitialized) return;
  isDexieSyncInitialized = true;

  // Pasang hook pada penambahan bookmark (non-blocking)
  db.bookmarks.hook('creating', function (_primKey, obj) {
    this.onsuccess = function () {
      setTimeout(() => {
        const state = useAuthStore.getState();
        if (!state.user.isGuest && state.user.id && isFirebaseReady()) {
          syncUploadBookmark(state.user.id, obj as BookmarkItem);
        }
      }, 0);
    };
  });

  // Pasang hook pada penghapusan bookmark (non-blocking)
  db.bookmarks.hook('deleting', function (primKey, _obj, trans) {
    this.onsuccess = function () {
      setTimeout(() => {
        const state = useAuthStore.getState();
        if (!state.user.isGuest && state.user.id && isFirebaseReady()) {
          trans.table('bookmarks').get(primKey).then((item) => {
            if (item?.refId) {
              syncDeleteBookmark(state.user.id, item.refId);
            }
          }).catch(() => {});
        }
      }, 0);
    };
  });

  // Pasang hook pada riwayat baca terakhir (non-blocking)
  db.lastRead.hook('creating', function (_primKey, obj) {
    this.onsuccess = function () {
      setTimeout(() => {
        const state = useAuthStore.getState();
        if (!state.user.isGuest && state.user.id && isFirebaseReady()) {
          syncUploadLastRead(state.user.id, obj as LastReadItem);
        }
      }, 0);
    };
  });

  // Pasang hook pada penambahan / update / delete studyNotes (non-blocking)
  db.studyNotes.hook('creating', function (_primKey, obj) {
    this.onsuccess = function (actualKey) {
      setTimeout(() => {
        const state = useAuthStore.getState();
        if (!state.user.isGuest && state.user.id && isFirebaseReady()) {
          const item = { ...obj, id: actualKey as number };
          syncUploadStudyNote(state.user.id, item as StudyNote);
        }
      }, 0);
    };
  });

  db.studyNotes.hook('updating', function (modifications, _primKey, obj) {
    this.onsuccess = function () {
      setTimeout(() => {
        const state = useAuthStore.getState();
        if (!state.user.isGuest && state.user.id && isFirebaseReady()) {
          const merged = { ...obj, ...modifications } as StudyNote;
          syncUploadStudyNote(state.user.id, merged);
        }
      }, 0);
    };
  });

  db.studyNotes.hook('deleting', function (primKey, _obj, trans) {
    this.onsuccess = function () {
      setTimeout(() => {
        const state = useAuthStore.getState();
        if (!state.user.isGuest && state.user.id && isFirebaseReady()) {
          trans.table('studyNotes').get(primKey).then((item) => {
            if (item) {
              const docId = item.uid || `note_${primKey}`;
              syncDeleteStudyNote(state.user.id, docId);
            }
          }).catch(() => {});
        }
      }, 0);
    };
  });

  // Pasang hook pada penambahan / delete students (non-blocking)
  db.students.hook('creating', function (_primKey, obj) {
    this.onsuccess = function (actualKey) {
      setTimeout(() => {
        const state = useAuthStore.getState();
        if (!state.user.isGuest && state.user.id && isFirebaseReady()) {
          const item = { ...obj, id: actualKey as number };
          syncUploadStudent(state.user.id, item as StudentProfile);
        }
      }, 0);
    };
  });

  db.students.hook('deleting', function (primKey, _obj, trans) {
    this.onsuccess = function () {
      setTimeout(() => {
        const state = useAuthStore.getState();
        if (!state.user.isGuest && state.user.id && isFirebaseReady()) {
          trans.table('students').get(primKey).then((item) => {
            if (item) {
              const docId = item.uid || `student_${primKey}`;
              syncDeleteStudent(state.user.id, docId);
            }
          }).catch(() => {});
        }
      }, 0);
    };
  });

  // Listener event login/logout
  window.addEventListener('iqraUserChanged', ((e: CustomEvent) => {
    const newUser = e.detail;
    if (newUser && !newUser.isGuest && newUser.id && isFirebaseReady()) {
      syncAllUserData(newUser.id);
    }
  }) as EventListener);

  // Jika saat inisialisasi user sudah terhubung, jalankan sync awal (di background)
  setTimeout(() => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser.isGuest && currentUser.id && isFirebaseReady()) {
      syncAllUserData(currentUser.id);
    }
  }, 100);
}


