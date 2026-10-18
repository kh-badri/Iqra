import fs from 'node:fs';
import path from 'node:path';

const channelsData = {
  channels: [
    {
      id: 'uah',
      name: 'Adi Hidayat Official',
      ustadz: 'Ustadz Adi Hidayat, Lc., M.A.',
      handle: '@AdiHidayatOfficiaI',
      url: 'https://www.youtube.com/@AdiHidayatOfficiaI',
      description: 'Kajian tafsir, fiqih sunnah, dan pembinaan keislaman komprehensif.',
      avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'uas',
      name: 'Ustadz Abdul Somad Official',
      ustadz: 'Prof. Dr. H. Abdul Somad, Lc., D.E.S.A.',
      handle: '@UstadzAbdulSomadOfficial',
      url: 'https://www.youtube.com/@UstadzAbdulSomadOfficial',
      description: 'Kajian hadits, fiqih mazhab Syafi\'i, aqidah ahlussunnah wal jamaah, dan tanya jawab.',
      avatar: 'https://images.unsplash.com/photo-1584281722572-88172c72449a?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'uha',
      name: 'Hanan Attaki',
      ustadz: 'Ustadz Hanan Attaki, Lc.',
      handle: '@HananAttaki',
      url: 'https://www.youtube.com/@HananAttaki',
      description: 'Kajian tematik pemuda, tazkiyatun nafs, sirah, dan motivasi hijrah Qur\'ani.',
      avatar: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'buya_yahya',
      name: 'Buya Yahya Official',
      ustadz: 'Buya Yahya (Zainul Ma\'arif)',
      handle: '@buyayahyaofficial',
      url: 'https://www.youtube.com/@buyayahyaofficial',
      description: 'Kajian fiqih praktis sehari-hari, tasawuf akhlak, dan konsultasi syariah keluarga sakinah.',
      avatar: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'khalid_basalamah',
      name: 'Khalid Basalamah Official',
      ustadz: 'Dr. Khalid Basalamah, Lc., M.A.',
      handle: '@khalidbasalamah',
      url: 'https://www.youtube.com/@khalidbasalamah',
      description: 'Kajian sirah nabawiyah, kitab Riyadhus Shalihin, dosa-dosa besar, dan manhaj salaf.',
      avatar: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'syafiq_riza',
      name: 'Syafiq Riza Basalamah Official',
      ustadz: 'Dr. Syafiq Riza Basalamah, M.A.',
      handle: '@SyafiqRizaBasalamahOfficial',
      url: 'https://www.youtube.com/@SyafiqRizaBasalamahOfficial',
      description: 'Kajian akhlak keluarga, nasihat kehidupan, dan adab penuntut ilmu.',
      avatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&q=80'
    }
  ],
  categories: [
    'Semua',
    'Akidah & Akhlak',
    'Fiqih Ibadah',
    'Sirah Nabawiyah',
    'Tafsir Al-Qur\'an',
    'Tanya Jawab Syariah'
  ],
  videos: [
    // Ustadz Adi Hidayat (5 videos)
    {
      id: 'sX-kePnlgy4',
      channelId: 'uah',
      title: 'Perbaiki Shalatmu Maka Allah Akan Permudah Urusanmu',
      ustadz: 'Ustadz Adi Hidayat, Lc., M.A.',
      category: 'Fiqih Ibadah',
      duration: '45 Menit',
      publishedAt: 'Kajian Pilihan',
      summary: 'Penjelasan mendalam mengenai kunci memperbaiki shalat fardhu dan sunnah agar Allah memudahkan seluruh urusan kehidupan.',
      youtubeUrl: 'https://www.youtube.com/watch?v=sX-kePnlgy4',
      thumbnailUrl: 'https://i.ytimg.com/vi/sX-kePnlgy4/hqdefault.jpg'
    },
    {
      id: 'ucnFvcdAi00',
      channelId: 'uah',
      title: 'Kajian Subuh: Pembahasan Kitab Shahih Al-Bukhari',
      ustadz: 'Ustadz Adi Hidayat, Lc., M.A.',
      category: 'Tafsir Al-Qur\'an',
      duration: '52 Menit',
      publishedAt: 'Kajian Rutin Subuh',
      summary: 'Kajian rutin subuh membedah bab-bab keimanan dan ilmu dalam kitab Shahih Al-Bukhari secara komprehensif.',
      youtubeUrl: 'https://www.youtube.com/watch?v=ucnFvcdAi00',
      thumbnailUrl: 'https://i.ytimg.com/vi/ucnFvcdAi00/hqdefault.jpg'
    },
    {
      id: 'ohvK2wtDfFM',
      channelId: 'uah',
      title: 'Khutbah Jum\'at: 3 Syarat Menjadi Manusia Terbaik di Sisi Allah',
      ustadz: 'Ustadz Adi Hidayat, Lc., M.A.',
      category: 'Akidah & Akhlak',
      duration: '28 Menit',
      publishedAt: 'Khutbah Jum\'at',
      summary: 'Tiga kriteria utama seorang mukmin agar diakui sebagai umat terbaik yang menebarkan manfaat bagi sesama.',
      youtubeUrl: 'https://www.youtube.com/watch?v=ohvK2wtDfFM',
      thumbnailUrl: 'https://i.ytimg.com/vi/ohvK2wtDfFM/hqdefault.jpg'
    },
    {
      id: 'SbsS2s-vp30',
      channelId: 'uah',
      title: 'Kajian Dhuha: Tafsir Al-Munir Surat Al-Infithar',
      ustadz: 'Ustadz Adi Hidayat, Lc., M.A.',
      category: 'Tafsir Al-Qur\'an',
      duration: '48 Menit',
      publishedAt: 'Kajian Dhuha',
      summary: 'Tadabbur mendalam ayat-ayat hari kiamat dan hisab amal manusia dalam Surah Al-Infithar berdasarkan Tafsir Al-Munir.',
      youtubeUrl: 'https://www.youtube.com/watch?v=SbsS2s-vp30',
      thumbnailUrl: 'https://i.ytimg.com/vi/SbsS2s-vp30/hqdefault.jpg'
    },
    {
      id: 'y7ljUdyrfsc',
      channelId: 'uah',
      title: 'Al-Qur\'an dan Sunnah Sebagai Pedoman Kehidupan Umat',
      ustadz: 'Ustadz Adi Hidayat, Lc., M.A.',
      category: 'Akidah & Akhlak',
      duration: '34 Menit',
      publishedAt: 'Kajian Tematik',
      summary: 'Pentingnya kembali kepada bimbingan wahyu Al-Qur\'an dan hadits shahih di tengah arus disinformasi zaman modern.',
      youtubeUrl: 'https://www.youtube.com/watch?v=y7ljUdyrfsc',
      thumbnailUrl: 'https://i.ytimg.com/vi/y7ljUdyrfsc/hqdefault.jpg'
    },

    // Prof. Dr. Abdul Somad (5 videos)
    {
      id: 'y7hA-40huSM',
      channelId: 'uas',
      title: 'Silaturahmi Bukan Sekadar Berkunjung, Inilah Adab yang Harus Dijaga',
      ustadz: 'Prof. Dr. H. Abdul Somad, Lc., D.E.S.A.',
      category: 'Akidah & Akhlak',
      duration: '38 Menit',
      publishedAt: 'Kajian Pilihan',
      summary: 'Penjelasan adab silaturahmi, menjaga kerukunan sanak keluarga, dan menjauhi prasangka dalam pergaulan Islami.',
      youtubeUrl: 'https://www.youtube.com/watch?v=y7hA-40huSM',
      thumbnailUrl: 'https://i.ytimg.com/vi/y7hA-40huSM/hqdefault.jpg'
    },
    {
      id: 'CZ2aF8N0g5U',
      channelId: 'uas',
      title: 'Kupas Tuntas Tanya Jawab Fiqih & Hukum Muamalah Islam',
      ustadz: 'Prof. Dr. H. Abdul Somad, Lc., D.E.S.A.',
      category: 'Tanya Jawab Syariah',
      duration: '48 Menit',
      publishedAt: 'Kajian Pilihan',
      summary: 'Jawaban tuntas dari pertanyaan jamaah seputar fiqih ibadah, muamalah modern, zakat, dan aqidah ahlussunnah.',
      youtubeUrl: 'https://www.youtube.com/watch?v=CZ2aF8N0g5U',
      thumbnailUrl: 'https://i.ytimg.com/vi/CZ2aF8N0g5U/hqdefault.jpg'
    },
    {
      id: 'xhXhZLaef9I',
      channelId: 'uas',
      title: 'Shalat Khusyuk di Tengah Kesibukan Dunia dan Pekerjaan',
      ustadz: 'Prof. Dr. H. Abdul Somad, Lc., D.E.S.A.',
      category: 'Fiqih Ibadah',
      duration: '42 Menit',
      publishedAt: 'Tabligh Akbar',
      summary: 'Tips dan kiat menghadirkan hati saat takbiratul ihram hingga salam di sela-sela padatnya rutinitas harian.',
      youtubeUrl: 'https://www.youtube.com/watch?v=xhXhZLaef9I',
      thumbnailUrl: 'https://i.ytimg.com/vi/xhXhZLaef9I/hqdefault.jpg'
    },
    {
      id: 'vxyVaW1qz-o',
      channelId: 'uas',
      title: 'Perkuat Ukhuwah, Jaga Ibadah, dan Tebarkan Salam Perdamaian',
      ustadz: 'Prof. Dr. H. Abdul Somad, Lc., D.E.S.A.',
      category: 'Akidah & Akhlak',
      duration: '50 Menit',
      publishedAt: 'Tabligh Akbar',
      summary: 'Menjalin persaudaraan antar sesama muslim, menghindari fitnah perpecahan, dan menegakkan shalat berjamaah.',
      youtubeUrl: 'https://www.youtube.com/watch?v=vxyVaW1qz-o',
      thumbnailUrl: 'https://i.ytimg.com/vi/vxyVaW1qz-o/hqdefault.jpg'
    },
    {
      id: 'pqt6DUTVFbs',
      channelId: 'uas',
      title: 'Kajian Kitab Riyadhus Shalihin: Keutamaan Istiqamah Beramal',
      ustadz: 'Prof. Dr. H. Abdul Somad, Lc., D.E.S.A.',
      category: 'Akidah & Akhlak',
      duration: '46 Menit',
      publishedAt: 'Kajian Kitab',
      summary: 'Kajian hadits-hadits shahih Imam An-Nawawi tentang keutamaan konsisten dalam berbuat kebajikan sekecil apapun.',
      youtubeUrl: 'https://www.youtube.com/watch?v=pqt6DUTVFbs',
      thumbnailUrl: 'https://i.ytimg.com/vi/pqt6DUTVFbs/hqdefault.jpg'
    },

    // Ustadz Hanan Attaki (5 videos)
    {
      id: '3Fb2ENY1M50',
      channelId: 'uha',
      title: 'Allah Nggak Pernah Ninggalin Kamu: Menata Hati dan Prasangka Baik',
      ustadz: 'Ustadz Hanan Attaki, Lc.',
      category: 'Akidah & Akhlak',
      duration: '32 Menit',
      publishedAt: 'Kajian Pilihan',
      summary: 'Pesan menyentuh hati bagi yang sedang merasa sendirian, lelah dengan ujian hidup, dan ingin kembali mendekat kepada Allah.',
      youtubeUrl: 'https://www.youtube.com/watch?v=3Fb2ENY1M50',
      thumbnailUrl: 'https://i.ytimg.com/vi/3Fb2ENY1M50/hqdefault.jpg'
    },
    {
      id: '7uTAEN5-3uU',
      channelId: 'uha',
      title: 'Tafsir Surah Al-Baqarah 1-16 & Murottal Menenangkan Hati',
      ustadz: 'Ustadz Hanan Attaki, Lc.',
      category: 'Tafsir Al-Qur\'an',
      duration: '40 Menit',
      publishedAt: 'Chill Bareng Qur\'an',
      summary: 'Tadabbur ayat-ayat pembuka Al-Baqarah tentang sifat orang bertaqwa dipadukan dengan lantunan murottal yang menyejukkan.',
      youtubeUrl: 'https://www.youtube.com/watch?v=7uTAEN5-3uU',
      thumbnailUrl: 'https://i.ytimg.com/vi/7uTAEN5-3uU/hqdefault.jpg'
    },
    {
      id: 'KBX725Igx5o',
      channelId: 'uha',
      title: 'Aku Udah Ikhlas, Tapi Kenapa Masih Menangis?',
      ustadz: 'Ustadz Hanan Attaki, Lc.',
      category: 'Akidah & Akhlak',
      duration: '29 Menit',
      publishedAt: 'Sharing Night',
      summary: 'Memahami proses batin saat menerima takdir yang tidak sesuai harapan, dan mengapa air mata bukanlah tanda ketidakikhlasan.',
      youtubeUrl: 'https://www.youtube.com/watch?v=KBX725Igx5o',
      thumbnailUrl: 'https://i.ytimg.com/vi/KBX725Igx5o/hqdefault.jpg'
    },
    {
      id: 'tUtDTt0jg2c',
      channelId: 'uha',
      title: 'Cara Memahami Diri dan Mengatasi Overthinking dalam Islam',
      ustadz: 'Ustadz Hanan Attaki, Lc.',
      category: 'Akidah & Akhlak',
      duration: '35 Menit',
      publishedAt: 'Kajian Pemuda',
      summary: 'Menghadapi kecemasan masa depan, rasa rendah diri, dan mengalihkan pikiran negatif menjadi doa dan ikhtiar tawakal.',
      youtubeUrl: 'https://www.youtube.com/watch?v=tUtDTt0jg2c',
      thumbnailUrl: 'https://i.ytimg.com/vi/tUtDTt0jg2c/hqdefault.jpg'
    },
    {
      id: 'jb0MSlM9u_M',
      channelId: 'uha',
      title: 'Cara Mengatasi Masalah Hidup dan Musibah Terberat',
      ustadz: 'Ustadz Hanan Attaki, Lc.',
      category: 'Akidah & Akhlak',
      duration: '37 Menit',
      publishedAt: 'Sharing Night',
      summary: 'Bimbingan Nabi ﷺ saat ditimpa kesulitan besar, sabar tanpa batas, dan keyakinan akan janji kemudahan sesudah kesulitan.',
      youtubeUrl: 'https://www.youtube.com/watch?v=jb0MSlM9u_M',
      thumbnailUrl: 'https://i.ytimg.com/vi/jb0MSlM9u_M/hqdefault.jpg'
    },

    // Buya Yahya (5 videos)
    {
      id: 'ufZ_txh3Res',
      channelId: 'buya_yahya',
      title: 'Pembagian Harta Keluarga yang Benar dan Adil dalam Islam',
      ustadz: 'Buya Yahya (Zainul Ma\'arif)',
      category: 'Fiqih Ibadah',
      duration: '42 Menit',
      publishedAt: 'Kajian Fiqih',
      summary: 'Panduan hukum waris dan hibah dalam keluarga agar tidak terjadi sengketa persaudaraan dan sesuai syariat Islam.',
      youtubeUrl: 'https://www.youtube.com/watch?v=ufZ_txh3Res',
      thumbnailUrl: 'https://i.ytimg.com/vi/ufZ_txh3Res/hqdefault.jpg'
    },
    {
      id: 'hAfduaRGyoc',
      channelId: 'buya_yahya',
      title: 'Cara Cepat Terlepas dari Kubang Kemaksiatan dan Dosa',
      ustadz: 'Buya Yahya (Zainul Ma\'arif)',
      category: 'Akidah & Akhlak',
      duration: '36 Menit',
      publishedAt: 'Kajian Pilihan',
      summary: 'Nasihat penuh kelembutan mengenai langkah taubat nasuha, meninggalkan lingkaran maksiat, dan konsisten dalam ketaatan.',
      youtubeUrl: 'https://www.youtube.com/watch?v=hAfduaRGyoc',
      thumbnailUrl: 'https://i.ytimg.com/vi/hAfduaRGyoc/hqdefault.jpg'
    },
    {
      id: 'feYEVgPkres',
      channelId: 'buya_yahya',
      title: 'Riya: Senjata Pamungkas Setan dalam Merusak Pahala Amal',
      ustadz: 'Buya Yahya (Zainul Ma\'arif)',
      category: 'Akidah & Akhlak',
      duration: '45 Menit',
      publishedAt: 'Kajian Tasawuf',
      summary: 'Mendeteksi penyakit hati riya, sum\'ah, dan bangga diri dalam beribadah serta kiat menjaga keikhlasan semata karena Allah.',
      youtubeUrl: 'https://www.youtube.com/watch?v=feYEVgPkres',
      thumbnailUrl: 'https://i.ytimg.com/vi/feYEVgPkres/hqdefault.jpg'
    },
    {
      id: 'XPI7e1k_GR4',
      channelId: 'buya_yahya',
      title: 'Keberkahan Hidup Anak yang Berbakti Kepada Orang Tua',
      ustadz: 'Buya Yahya (Zainul Ma\'arif)',
      category: 'Akidah & Akhlak',
      duration: '39 Menit',
      publishedAt: 'Kajian Keluarga',
      summary: 'Kedudukan mulia orang tua dalam syariat Islam, adab memperlakukan orang tua yang sepuh, dan cara mendoakan mereka.',
      youtubeUrl: 'https://www.youtube.com/watch?v=XPI7e1k_GR4',
      thumbnailUrl: 'https://i.ytimg.com/vi/XPI7e1k_GR4/hqdefault.jpg'
    },
    {
      id: 'yrCF_11mWjA',
      channelId: 'buya_yahya',
      title: 'Konsultasi Syariah: Menata Hati dan Mengatasi Ujian Rumah Tangga',
      ustadz: 'Buya Yahya (Zainul Ma\'arif)',
      category: 'Tanya Jawab Syariah',
      duration: '33 Menit',
      publishedAt: 'Konsultasi Keluarga',
      summary: 'Jawaban konsultasi syariat seputar hak-kewajiban suami istri, komunikasi yang menyejukkan, dan menjaga keutuhan keluarga.',
      youtubeUrl: 'https://www.youtube.com/watch?v=yrCF_11mWjA',
      thumbnailUrl: 'https://i.ytimg.com/vi/yrCF_11mWjA/hqdefault.jpg'
    },

    // Dr. Khalid Basalamah (5 videos)
    {
      id: 's-fYnaGIpBM',
      channelId: 'khalid_basalamah',
      title: 'Kajian Tematik: Memegang Teguh Amanah & Profesionalisme',
      ustadz: 'Dr. Khalid Basalamah, Lc., M.A.',
      category: 'Akidah & Akhlak',
      duration: '55 Menit',
      publishedAt: 'Kajian Tematik',
      summary: 'Kewajiban menjaga amanah dalam pekerjaan, kepemimpinan, dan muamalah sehari-hari berdasarkan dalil shahih.',
      youtubeUrl: 'https://www.youtube.com/watch?v=s-fYnaGIpBM',
      thumbnailUrl: 'https://i.ytimg.com/vi/s-fYnaGIpBM/hqdefault.jpg'
    },
    {
      id: 'VxzLYG08flk',
      channelId: 'khalid_basalamah',
      title: 'Kiat Mengatasi Masalah Rumah Tangga Sesuai Sunnah Nabi ﷺ',
      ustadz: 'Dr. Khalid Basalamah, Lc., M.A.',
      category: 'Sirah Nabawiyah',
      duration: '47 Menit',
      publishedAt: 'Kajian Rumah Tangga',
      summary: 'Solusi syar\'i mengatasi friksi antara suami dan istri dengan meneladani kehidupan rumah tangga Nabi Muhammad ﷺ.',
      youtubeUrl: 'https://www.youtube.com/watch?v=VxzLYG08flk',
      thumbnailUrl: 'https://i.ytimg.com/vi/VxzLYG08flk/hqdefault.jpg'
    },
    {
      id: '6uVTEiUnP1c',
      channelId: 'khalid_basalamah',
      title: 'Berharap Doa Dikabulkan Melalui Tiga Tahapan Mustajab',
      ustadz: 'Dr. Khalid Basalamah, Lc., M.A.',
      category: 'Akidah & Akhlak',
      duration: '34 Menit',
      publishedAt: 'Kajian Doa',
      summary: 'Syarat dan adab terkabulnya doa, waktu-waktu mustajab, serta penghalang doa yang sering tidak disadari seorang mukmin.',
      youtubeUrl: 'https://www.youtube.com/watch?v=6uVTEiUnP1c',
      thumbnailUrl: 'https://i.ytimg.com/vi/6uVTEiUnP1c/hqdefault.jpg'
    },
    {
      id: 'Ag4opFjrlu8',
      channelId: 'khalid_basalamah',
      title: 'Kitab Syamail: Karakteristik dan Kepribadian Nabi Muhammad ﷺ',
      ustadz: 'Dr. Khalid Basalamah, Lc., M.A.',
      category: 'Sirah Nabawiyah',
      duration: '58 Menit',
      publishedAt: 'Kajian Sirah',
      summary: 'Mengenal keindahan fisik, keagungan akhlak, dan kepribadian mulia Rasulullah ﷺ dari kitab Asy-Syamail Al-Muhammadiyyah.',
      youtubeUrl: 'https://www.youtube.com/watch?v=Ag4opFjrlu8',
      thumbnailUrl: 'https://i.ytimg.com/vi/Ag4opFjrlu8/hqdefault.jpg'
    },
    {
      id: 'gW2svU7qgcU',
      channelId: 'khalid_basalamah',
      title: 'Cara Agar Menjadi Pribadi yang Pandai Bersyukur Kepada Allah',
      ustadz: 'Dr. Khalid Basalamah, Lc., M.A.',
      category: 'Akidah & Akhlak',
      duration: '31 Menit',
      publishedAt: 'Kajian Tematik',
      summary: 'Tingkatan syukur dengan lisan, hati, dan perbuatan, serta bagaimana rasa syukur melipatgandakan kenikmatan hidup.',
      youtubeUrl: 'https://www.youtube.com/watch?v=gW2svU7qgcU',
      thumbnailUrl: 'https://i.ytimg.com/vi/gW2svU7qgcU/hqdefault.jpg'
    },

    // Dr. Syafiq Riza Basalamah (5 videos)
    {
      id: '3Nw_zJe5BJk',
      channelId: 'syafiq_riza',
      title: 'Bekerja Dengan Amanah Menjemput Rezeki Halal Penuh Berkah',
      ustadz: 'Dr. Syafiq Riza Basalamah, M.A.',
      category: 'Akidah & Akhlak',
      duration: '44 Menit',
      publishedAt: 'Kajian Pilihan',
      summary: 'Menata niat dalam mencari nafkah agar setiap lelah bernilai ibadah dan mendatangkan keberkahan bagi keluarga.',
      youtubeUrl: 'https://www.youtube.com/watch?v=3Nw_zJe5BJk',
      thumbnailUrl: 'https://i.ytimg.com/vi/3Nw_zJe5BJk/hqdefault.jpg'
    },
    {
      id: 'we5jaVHekxk',
      channelId: 'syafiq_riza',
      title: 'Aku Taat Tapi Susah, Mereka Maksiat Kok Kaya? (Memahami Istidraj)',
      ustadz: 'Dr. Syafiq Riza Basalamah, M.A.',
      category: 'Akidah & Akhlak',
      duration: '39 Menit',
      publishedAt: 'Kajian Pilihan',
      summary: 'Penjelasan konsep istidraj dan hakikat ujian dunia agar hati seorang mukmin tidak tertipu oleh gemerlap harta semu.',
      youtubeUrl: 'https://www.youtube.com/watch?v=we5jaVHekxk',
      thumbnailUrl: 'https://i.ytimg.com/vi/we5jaVHekxk/hqdefault.jpg'
    },
    {
      id: 'RShXjoF7Eok',
      channelId: 'syafiq_riza',
      title: 'Tanggung Jawab Suami Membahagiakan dan Memuliakan Istri di Rumah',
      ustadz: 'Dr. Syafiq Riza Basalamah, M.A.',
      category: 'Akidah & Akhlak',
      duration: '36 Menit',
      publishedAt: 'Kajian Keluarga',
      summary: 'Nasihat berharga untuk para suami tentang memperlakukan istri dengan makruf, sabar, dan penuh kehangatan cinta.',
      youtubeUrl: 'https://www.youtube.com/watch?v=RShXjoF7Eok',
      thumbnailUrl: 'https://i.ytimg.com/vi/RShXjoF7Eok/hqdefault.jpg'
    },
    {
      id: 'zI0FrsITNQo',
      channelId: 'syafiq_riza',
      title: 'Fiqih Ibadah Wanita: Keutamaan Shalat Terbaik Bagi Muslimah',
      ustadz: 'Dr. Syafiq Riza Basalamah, M.A.',
      category: 'Fiqih Ibadah',
      duration: '30 Menit',
      publishedAt: 'Fiqih Muslimah',
      summary: 'Pembahasan dalil shahih mengenai keutamaan shalat bagi muslimah, menjaga aurat, dan kekhusyukan ibadah di rumah.',
      youtubeUrl: 'https://www.youtube.com/watch?v=zI0FrsITNQo',
      thumbnailUrl: 'https://i.ytimg.com/vi/zI0FrsITNQo/hqdefault.jpg'
    },
    {
      id: '18lb0sz2xxw',
      channelId: 'syafiq_riza',
      title: 'Jangan Menyerah: Menghadapi Ujian Takdir dengan Ridha dan Tawakal',
      ustadz: 'Dr. Syafiq Riza Basalamah, M.A.',
      category: 'Akidah & Akhlak',
      duration: '41 Menit',
      publishedAt: 'Motivasi Iman',
      summary: 'Membangun keteguhan hati di masa-masa sulit, yakin bahwa takdir Allah selalu menyimpan hikmah terbaik bagi orang beriman.',
      youtubeUrl: 'https://www.youtube.com/watch?v=18lb0sz2xxw',
      thumbnailUrl: 'https://i.ytimg.com/vi/18lb0sz2xxw/hqdefault.jpg'
    }
  ]
};

const publicPath = path.join(process.cwd(), 'public', 'data', 'channels.json');
fs.writeFileSync(publicPath, JSON.stringify(channelsData, null, 2), 'utf-8');
console.log(`Generated 30 videos to ${publicPath}`);

const outDir = path.join(process.cwd(), 'out', 'data');
if (fs.existsSync(outDir)) {
  const outPath = path.join(outDir, 'channels.json');
  fs.writeFileSync(outPath, JSON.stringify(channelsData, null, 2), 'utf-8');
  console.log(`Generated 30 videos to ${outPath}`);
}
