/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock,
  ShieldCheck,
  Users,
  Search,
  RefreshCw,
  AlertCircle,
  LogOut,
  Mail,
  Calendar,
  Sparkles,
  ArrowLeft,
  KeyRound,
  GraduationCap,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Database,
  MessageSquare,
  Star,
  Trash2,
  HeartHandshake,
} from 'lucide-react';
import Link from 'next/link';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { getFirebaseFirestore, isFirebaseReady } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';

const ADMIN_SECRET_CODE = '11223344';
const AUTH_SESSION_KEY = 'iqra_admin_unlocked';

export interface FirestoreStudent {
  id: string;
  name: string;
  notes?: string;
  createdAt: number;
}

export interface FirestoreNote {
  id: string;
  studentName: string;
  category: string;
  title: string;
  lastPosition: string;
  notes?: string;
  grade?: string;
  status: string;
  updatedAt: number;
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  lastActiveAt?: string;
  students: FirestoreStudent[];
  studyNotes: FirestoreNote[];
}

export interface UserFeedback {
  id: string;
  userId?: string;
  name: string;
  email: string;
  picture?: string;
  category: 'saran' | 'kritik' | 'koreksi' | 'lainnya';
  rating?: number;
  message: string;
  createdAt: string;
  timestamp: number;
}

export default function AdminUsersPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'users' | 'students' | 'notes' | 'feedbacks'>('users');
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);
  const [isDeletingFeedback, setIsDeletingFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastFetched, setLastFetched] = useState<string | null>(null);
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});

  // Periksa apakah sesi admin sudah aktif sebelumnya di tab ini
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = sessionStorage.getItem(AUTH_SESSION_KEY);
      if (savedAuth === 'true') {
        setIsUnlocked(true);
      }
    }
  }, []);

  // Ambil data pengguna beserta subkoleksi students dan studyNotes dari Firestore
  const fetchUsers = async () => {
    const firestore = getFirebaseFirestore();
    if (!firestore) return;

    try {
      setIsLoading(true);
      const usersCol = collection(firestore, 'users');
      const snap = await getDocs(usersCol);

      const list: RegisteredUser[] = [];

      for (const docSnap of snap.docs) {
        const data = docSnap.data();

        // 1. Ambil Subkoleksi Murid (students)
        const studentsList: FirestoreStudent[] = [];
        try {
          const studentsSnap = await getDocs(collection(firestore, 'users', docSnap.id, 'students'));
          studentsSnap.forEach((sDoc) => {
            const sData = sDoc.data();
            studentsList.push({
              id: sDoc.id,
              name: sData.name || 'Tanpa Nama',
              notes: sData.notes || '',
              createdAt: sData.createdAt || Date.now(),
            });
          });
        } catch (err) {
          console.warn('Gagal memuat subkoleksi students:', err);
        }

        // 2. Ambil Subkoleksi Catatan (studyNotes)
        const notesList: FirestoreNote[] = [];
        try {
          const notesSnap = await getDocs(collection(firestore, 'users', docSnap.id, 'studyNotes'));
          notesSnap.forEach((nDoc) => {
            const nData = nDoc.data();
            notesList.push({
              id: nDoc.id,
              studentName: nData.studentName || 'Diri Sendiri',
              category: nData.category || 'quran',
              title: nData.title || '',
              lastPosition: nData.lastPosition || '-',
              notes: nData.notes || '',
              grade: nData.grade || '',
              status: nData.status || 'ongoing',
              updatedAt: nData.updatedAt || Date.now(),
            });
          });
        } catch (err) {
          console.warn('Gagal memuat subkoleksi studyNotes:', err);
        }

        list.push({
          id: docSnap.id,
          name: data.name || 'Pengguna Google',
          email: data.email || 'Tanpa Email',
          picture: data.picture || '',
          lastActiveAt: data.lastActiveAt || '',
          students: studentsList,
          studyNotes: notesList,
        });
      }

      // Urutkan berdasarkan waktu terakhir aktif (terbaru di atas)
      list.sort((a, b) => {
        const timeA = a.lastActiveAt ? new Date(a.lastActiveAt).getTime() : 0;
        const timeB = b.lastActiveAt ? new Date(b.lastActiveAt).getTime() : 0;
        return timeB - timeA;
      });

      setUsers(list);
      setLastFetched(new Date().toLocaleTimeString('id-ID'));
    } catch (err) {
      console.error('Gagal mengambil data dari Firestore:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Ambil data kritik & saran dari server cPanel API dan Firestore
  const fetchFeedbacks = async () => {
    const list: UserFeedback[] = [];

    // 1. Ambil dari API cPanel (/api/feedback.php)
    try {
      const res = await fetch(`/api/feedback.php?pin=${ADMIN_SECRET_CODE}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.success && Array.isArray(json.feedbacks)) {
          list.push(...json.feedbacks);
        }
      }
    } catch (err) {
      console.warn('Gagal memuat feedback dari cPanel API:', err);
    }

    // 2. Ambil dari Firestore ('feedbacks')
    try {
      const firestore = getFirebaseFirestore();
      if (firestore) {
        const snap = await getDocs(collection(firestore, 'feedbacks'));
        snap.forEach((dDoc) => {
          const d = dDoc.data();
          list.push({
            id: dDoc.id,
            userId: d.userId || '',
            name: d.name || 'Pengguna Iqra',
            email: d.email || '',
            picture: d.picture || '',
            category: d.category || 'saran',
            rating: d.rating || 5,
            message: d.message || '',
            createdAt: d.createdAt || new Date().toISOString(),
            timestamp: d.timestamp || Date.now(),
          });
        });
      }
    } catch (err) {
      console.warn('Gagal memuat feedback dari Firestore:', err);
    }

    // Deduplikasi berdasarkan ID
    const seen = new Set<string>();
    const deduplicated = list.filter((item) => {
      const key = item.id || `${item.email}_${item.message.slice(0, 30)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Urutkan paling baru di paling atas
    deduplicated.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    setFeedbacks(deduplicated);
  };

  const refreshAllData = async () => {
    setIsLoading(true);
    await Promise.all([fetchUsers(), fetchFeedbacks()]);
    setIsLoading(false);
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus masukan/kritik ini?')) {
      return;
    }
    setIsDeletingFeedback(id);

    // 1. Hapus dari cPanel API
    try {
      await fetch(`/api/feedback.php?pin=${ADMIN_SECRET_CODE}&id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Gagal hapus feedback dari cPanel API:', err);
    }

    // 2. Hapus dari Firestore jika tersimpan di sana
    try {
      const firestore = getFirebaseFirestore();
      if (firestore) {
        await deleteDoc(doc(firestore, 'feedbacks', id));
      }
    } catch (err) {
      // Abaikan jika bukan firestore doc
    }

    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    setIsDeletingFeedback(null);
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchUsers();
      fetchFeedbacks();
    }
  }, [isUnlocked]);

  // Handler Verifikasi PIN Kode Akses
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_SECRET_CODE) {
      setIsUnlocked(true);
      setPinError(null);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
      }
    } else {
      setPinError('Kode akses salah. Silakan periksa kembali kode Anda.');
      setPinInput('');
    }
  };

  // Handler Kunci / Keluar dari Admin
  const handleLockAdmin = () => {
    setIsUnlocked(false);
    setPinInput('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    }
  };

  const toggleExpand = (userId: string) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Aggregated totals
  const totalStudents = users.reduce((acc, u) => acc + (u.students?.length || 0), 0);
  const totalNotes = users.reduce((acc, u) => acc + (u.studyNotes?.length || 0), 0);

  // Flat lists for tabs
  const allStudentsFlat = users.flatMap((u) =>
    (u.students || []).map((s) => ({ ...s, userOwner: u.name, userEmail: u.email }))
  );
  const allNotesFlat = users.flatMap((u) =>
    (u.studyNotes || []).map((n) => ({ ...n, userOwner: u.name, userEmail: u.email }))
  );

  // Filter daftar pengguna berdasarkan input pencarian
  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q)
    );
  });

  const filteredStudents = allStudentsFlat.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.notes && s.notes.toLowerCase().includes(q)) ||
      s.userOwner.toLowerCase().includes(q)
    );
  });

  const filteredNotes = allNotesFlat.filter((n) => {
    const q = searchTerm.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.studentName.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q) ||
      (n.notes && n.notes.toLowerCase().includes(q)) ||
      n.userOwner.toLowerCase().includes(q)
    );
  });

  const filteredFeedbacks = feedbacks.filter((f) => {
    const q = searchTerm.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.email.toLowerCase().includes(q) ||
      f.message.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
    );
  });

  // ── TAMPILAN 1: LAYAR TERKUNCI (MASUKKAN KODE) ──
  if (!isUnlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-surface border border-border rounded-sheet shadow-elevated p-6 sm:p-8 animate-scale-up text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-pastel-green text-primary-text flex items-center justify-center mx-auto shadow-subtle border border-primary/20">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl font-black text-text-primary tracking-tight">
              Akses Panel Database Cloud
            </h1>
            <p className="text-xs text-text-secondary">
              Halaman verifikasi data Firebase Firestore (next-js-iqra). Masukkan kode akses pemilik aplikasi.
            </p>
          </div>

          <form onSubmit={handleVerifyPin} className="space-y-4">
            <div className="space-y-1 text-left">
              <label
                htmlFor="pin"
                className="text-xs font-bold text-text-secondary tracking-wide uppercase"
              >
                Kode Rahasia (PIN)
              </label>
              <input
                id="pin"
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Masukkan 8 digit kode..."
                className="w-full px-4 py-3 text-center tracking-widest text-lg font-mono rounded-input bg-surface-alt border border-border focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                autoFocus
                required
              />
            </div>

            {pinError && (
              <div className="flex items-center gap-2 p-3 text-xs text-danger bg-danger/10 border border-danger/20 rounded-card text-left font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full font-bold">
              <Lock className="w-4 h-4 mr-2" />
              <span>Buka Panel Database</span>
            </Button>
          </form>

          <div className="pt-2 border-t border-border">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda Iqra</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── TAMPILAN 2: DASHBOARD ADMIN TERVERIFIKASI ──
  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in-up pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-primary-gradient text-on-primary flex items-center justify-center shadow-subtle shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-pill bg-pastel-green text-primary-text mb-1">
              <Sparkles className="w-3 h-3 text-primary" />
              <span>Database Verifikasi Cloud Firebase</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
              Pusat Data Cloud Firebase
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAllData}
            disabled={isLoading}
            className="flex-1 sm:flex-none text-xs font-semibold h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Segarkan Data</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLockAdmin}
            className="text-xs text-danger hover:bg-danger/10 hover:text-danger h-9"
            title="Kunci Dashboard"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            <span>Kunci Panel</span>
          </Button>
        </div>
      </div>

      {/* 5 Summary Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Total Pengguna Terdaftar */}
        <div className="p-4 sm:p-5 bg-surface border border-border rounded-card shadow-subtle flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-text-secondary">Akun Google</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-1">
              {users.length} <span className="text-xs font-semibold text-text-muted">Orang</span>
            </h2>
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Tersimpan di Cloud</span>
          </div>
        </div>

        {/* Card 2: Murid di Firebase */}
        <div className="p-4 sm:p-5 bg-surface border border-border rounded-card shadow-subtle flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-text-secondary">Murid di Firebase</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mt-1">
              {totalStudents} <span className="text-xs font-semibold text-text-muted">Murid</span>
            </h2>
          </div>
          <div className="text-[11px] text-text-muted font-medium mt-2">
            Koleksi `students`
          </div>
        </div>

        {/* Card 3: Catatan di Firebase */}
        <div className="p-4 sm:p-5 bg-surface border border-border rounded-card shadow-subtle flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-text-secondary">Catatan Belajar di Cloud</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
              {totalNotes} <span className="text-xs font-semibold text-text-muted">Catatan</span>
            </h2>
          </div>
          <div className="text-[11px] text-text-muted font-medium mt-2">
            Koleksi `studyNotes`
          </div>
        </div>

        {/* Card 4: Kritik & Saran */}
        <div
          onClick={() => setActiveTab('feedbacks')}
          className={`p-4 sm:p-5 bg-surface border rounded-card shadow-subtle flex flex-col justify-between cursor-pointer transition-all hover:border-primary/50 ${
            activeTab === 'feedbacks'
              ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
              : 'border-border'
          }`}
        >
          <div>
            <p className="text-xs font-semibold text-text-secondary">Kritik & Saran</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-text mt-1">
              {feedbacks.length} <span className="text-xs font-semibold text-text-muted">Pesan</span>
            </h2>
          </div>
          <div className="text-[11px] text-primary font-bold mt-2 flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span>Google Login</span>
          </div>
        </div>

        {/* Card 5: Status Koneksi */}
        <div className="p-4 sm:p-5 bg-surface border border-border rounded-card shadow-subtle flex flex-col justify-between col-span-2 sm:col-span-1">
          <div>
            <p className="text-xs font-semibold text-text-secondary">Koneksi Database</p>
            <h2 className="text-sm sm:text-base font-extrabold text-text-primary mt-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Firebase Online</span>
            </h2>
          </div>
          <p className="text-[10px] text-text-muted mt-2 truncate">
            {lastFetched ? `Diperbarui: ${lastFetched}` : 'Real-time'}
          </p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-border pb-2 select-none overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-button text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-primary-gradient text-on-primary shadow-subtle'
              : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-alt'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Pengguna Google ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 rounded-button text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'students'
              ? 'bg-primary-gradient text-on-primary shadow-subtle'
              : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-alt'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Data Murid di Cloud ({totalStudents})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 rounded-button text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'notes'
              ? 'bg-primary-gradient text-on-primary shadow-subtle'
              : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-alt'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Data Catatan di Cloud ({totalNotes})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('feedbacks')}
          className={`px-4 py-2 rounded-button text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'feedbacks'
              ? 'bg-primary-gradient text-on-primary shadow-subtle'
              : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-alt'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Kritik & Saran ({feedbacks.length})</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-surface border border-border rounded-sheet shadow-subtle overflow-hidden">
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-alt/40">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama, email, murid, catatan, kritik & saran..."
              className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-input bg-surface border border-border focus:outline-none focus:ring-1 focus:ring-primary text-text-primary"
            />
          </div>

          <span className="text-xs text-text-secondary font-medium">
            {activeTab === 'users' && `Menampilkan ${filteredUsers.length} pengguna`}
            {activeTab === 'students' && `Menampilkan ${filteredStudents.length} murid di Firebase`}
            {activeTab === 'notes' && `Menampilkan ${filteredNotes.length} catatan di Firebase`}
            {activeTab === 'feedbacks' && `Menampilkan ${filteredFeedbacks.length} masukan / kritik`}
          </span>
        </div>

        {isLoading && users.length === 0 ? (
          <div className="p-12 text-center text-text-muted text-xs flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            <span>Memuat data langsung dari server Firebase Firestore...</span>
          </div>
        ) : null}

        {/* ── TAB 1: PENGGUNA GOOGLE & DETAIL DATA MEREKA ── */}
        {!isLoading && activeTab === 'users' && (
          <div className="divide-y divide-border">
            {filteredUsers.length === 0 ? (
              <div className="p-10 text-center text-xs text-text-muted">
                Tidak ada pengguna yang sesuai pencarian.
              </div>
            ) : (
              filteredUsers.map((u, idx) => {
                const isExpanded = !!expandedUsers[u.id];
                return (
                  <div key={u.id} className="p-4 sm:p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="text-xs font-bold text-text-muted w-6 text-center shrink-0">
                          #{idx + 1}
                        </span>

                        {u.picture ? (
                          <img
                            src={u.picture}
                            alt={u.name}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded-full object-cover border-2 border-primary/40 shadow-subtle shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-primary-gradient text-on-primary font-extrabold text-base flex items-center justify-center shrink-0 shadow-subtle">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-extrabold text-text-primary truncate">
                              {u.name}
                            </h3>
                            <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-pill bg-pastel-green text-primary-text shrink-0">
                              Google
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-0.5 truncate">
                            <Mail className="w-3.5 h-3.5 text-text-muted shrink-0" />
                            <span className="truncate">{u.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Badges & Expand Button */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold px-2 py-1 rounded-button bg-surface-alt border border-border text-text-secondary">
                            🎓 {u.students?.length || 0} Murid
                          </span>
                          <span className="text-[11px] font-bold px-2 py-1 rounded-button bg-surface-alt border border-border text-text-secondary">
                            📝 {u.studyNotes?.length || 0} Catatan
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleExpand(u.id)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary px-2.5 py-1 rounded-button bg-primary-soft hover:bg-primary/20 transition-colors"
                        >
                          <span>{isExpanded ? 'Tutup Detail' : 'Buka Data Cloud'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Section: Detail Murid & Catatan User di Firebase */}
                    {isExpanded && (
                      <div className="p-4 rounded-card bg-surface-alt/70 border border-border space-y-4 animate-fade-in text-xs">
                        {/* Murid Section */}
                        <div className="space-y-2">
                          <div className="font-extrabold text-text-primary uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-primary" />
                            <span>Data Murid di Subkoleksi Firebase ({u.students?.length || 0})</span>
                          </div>

                          {u.students?.length === 0 ? (
                            <div className="text-text-muted text-[11px] p-2 bg-surface rounded border border-border">
                              Belum ada murid yang tersimpan di Cloud Firebase untuk akun ini.
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {u.students.map((st) => (
                                <div
                                  key={st.id}
                                  className="p-2.5 rounded bg-surface border border-border flex items-center justify-between"
                                >
                                  <div>
                                    <div className="font-bold text-text-primary">{st.name}</div>
                                    {st.notes && (
                                      <div className="text-[11px] text-text-muted">{st.notes}</div>
                                    )}
                                  </div>
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                                    Tersimpan
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Catatan Section */}
                        <div className="space-y-2 pt-2 border-t border-border">
                          <div className="font-extrabold text-text-primary uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                            <span>Data Catatan Belajar di Subkoleksi Firebase ({u.studyNotes?.length || 0})</span>
                          </div>

                          {u.studyNotes?.length === 0 ? (
                            <div className="text-text-muted text-[11px] p-2 bg-surface rounded border border-border">
                              Belum ada catatan yang tersimpan di Cloud Firebase untuk akun ini.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {u.studyNotes.map((nt) => (
                                <div
                                  key={nt.id}
                                  className="p-2.5 rounded bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                                >
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-surface-alt uppercase text-primary">
                                        {nt.category}
                                      </span>
                                      <span className="font-bold text-text-primary">{nt.title}</span>
                                    </div>
                                    <div className="text-[11px] text-text-muted">
                                      Untuk: <strong>{nt.studentName}</strong> · Posisi: <strong>{nt.lastPosition}</strong>
                                      {nt.grade && ` · Predikat: ${nt.grade}`}
                                    </div>
                                    {nt.notes && (
                                      <div className="text-[11px] italic text-text-secondary">
                                        &ldquo;{nt.notes}&rdquo;
                                      </div>
                                    )}
                                  </div>

                                  <div className="shrink-0 flex items-center gap-2">
                                    <span
                                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                        nt.status === 'completed'
                                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                      }`}
                                    >
                                      {nt.status === 'completed' ? 'Selesai' : 'Sedang Belajar'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── TAB 2: SEMUA DATA MURID DI CLOUD ── */}
        {!isLoading && activeTab === 'students' && (
          <div className="divide-y divide-border">
            {filteredStudents.length === 0 ? (
              <div className="p-10 text-center text-xs text-text-muted">
                Belum ada murid yang tersimpan di Firebase Firestore.
              </div>
            ) : (
              filteredStudents.map((st, i) => (
                <div
                  key={st.id || i}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-alt/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pastel-green text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-text-primary">{st.name}</div>
                      <div className="text-xs text-text-muted">
                        {st.notes ? st.notes : 'Tanpa keterangan'} · Akun: <strong>{st.userOwner}</strong> ({st.userEmail})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-pill bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Aktif di Firebase</span>
                    </span>
                    <span className="font-mono text-[10px] text-text-muted">ID: {st.id}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── TAB 3: SEMUA DATA CATATAN DI CLOUD ── */}
        {!isLoading && activeTab === 'notes' && (
          <div className="divide-y divide-border">
            {filteredNotes.length === 0 ? (
              <div className="p-10 text-center text-xs text-text-muted">
                Belum ada catatan belajar yang tersimpan di Firebase Firestore.
              </div>
            ) : (
              filteredNotes.map((nt, i) => (
                <div
                  key={nt.id || i}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-alt/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-button bg-primary-soft text-primary uppercase">
                        {nt.category}
                      </span>
                      <h4 className="text-sm font-extrabold text-text-primary">{nt.title}</h4>
                    </div>

                    <div className="text-xs text-text-secondary">
                      Profil: <strong>{nt.studentName}</strong> · Posisi Terakhir: <strong>{nt.lastPosition}</strong>
                      {nt.grade && ` · Nilai: ${nt.grade}`}
                    </div>

                    {nt.notes && (
                      <div className="text-xs italic text-text-muted">
                        Evaluasi: &ldquo;{nt.notes}&rdquo;
                      </div>
                    )}

                    <div className="text-[11px] text-text-muted pt-0.5">
                      Pemilik: <strong>{nt.userOwner}</strong> ({nt.userEmail})
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[11px] px-2.5 py-1 rounded-pill font-bold ${
                        nt.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {nt.status === 'completed' ? 'Selesai' : 'Sedang Belajar'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Firebase</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── TAB 4: KRITIK & SARAN PENGGUNA ── */}
        {!isLoading && activeTab === 'feedbacks' && (
          <div className="divide-y divide-border">
            {filteredFeedbacks.length === 0 ? (
              <div className="p-12 text-center text-xs text-text-muted space-y-2">
                <MessageSquare className="w-8 h-8 text-text-muted/40 mx-auto" />
                <p>Belum ada kritik atau saran yang masuk dari pengguna.</p>
              </div>
            ) : (
              filteredFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-surface-alt/50 transition-colors"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* User Avatar */}
                    {fb.picture ? (
                      <img
                        src={fb.picture}
                        alt={fb.name}
                        className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-pastel-green text-primary font-bold text-sm flex items-center justify-center shrink-0 border border-primary/20">
                        {fb.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    {/* Feedback content */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-extrabold text-text-primary">
                          {fb.name}
                        </span>
                        <span className="text-xs text-text-muted">({fb.email})</span>

                        {/* Category Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-button uppercase tracking-wide ${
                            fb.category === 'saran'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : fb.category === 'kritik'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : fb.category === 'koreksi'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-primary-soft text-primary'
                          }`}
                        >
                          {fb.category}
                        </span>

                        {/* Star Rating if present */}
                        {fb.rating && (
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= (fb.rating || 5)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-border'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Message body */}
                      <div className="p-3 bg-surface-alt/70 border border-border/80 rounded-card text-xs text-text-primary whitespace-pre-wrap leading-relaxed">
                        {fb.message}
                      </div>

                      {/* Timestamp & ID info */}
                      <div className="flex items-center gap-3 text-[11px] text-text-muted pt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(fb.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="font-mono text-[10px] text-text-muted/70">
                          ID: {fb.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFeedback(fb.id)}
                      disabled={isDeletingFeedback === fb.id}
                      className="text-xs text-danger hover:bg-danger/10 hover:text-danger h-8 px-2.5"
                      title="Hapus kritik/saran ini"
                    >
                      <Trash2
                        className={`w-3.5 h-3.5 mr-1 ${
                          isDeletingFeedback === fb.id ? 'animate-spin' : ''
                        }`}
                      />
                      <span>Hapus</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
