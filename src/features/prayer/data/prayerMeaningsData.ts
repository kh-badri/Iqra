export interface PrayerStepMeaning {
  id: string;
  stepNumber: number;
  category: 'rukun' | 'sunnah';
  title: string;
  arabicName: string;
  movementName: string;
  movementDescription: string;
  arabic: string;
  transliteration: string;
  translation: string;
  spiritualMeaning: string;
  tadabbur: string;
  hadithSource: string;
  referenceBook: string;
}

export const PRAYER_MEANINGS_DATA: PrayerStepMeaning[] = [
  {
    id: 'niat-qiyam',
    stepNumber: 1,
    category: 'rukun',
    title: 'Niat & Berdiri Tegak (Qiyam)',
    arabicName: 'النِّيَّةُ وَالْقِيَامُ',
    movementName: 'Berdiri Menghadap Kiblat dengan Khusyuk',
    movementDescription:
      'Berdiri tegak menghadap kiblat bagi yang mampu, meluruskan pandangan ke tempat sujud, dan meniatkan sholat di dalam hati secara ikhlas lillahi ta\'ala.',
    arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    transliteration: "Innamal a'maalu bin-niyyaati, wa innamaa likullim-ri'in maa nawaa.",
    translation:
      'Sesungguhnya setiap amal perbuatan tergantung pada niatnya, dan sesungguhnya setiap orang akan mendapatkan sesuai dengan apa yang ia niatkan.',
    spiritualMeaning:
      'Berdiri tegak melambangkan kesiapan seorang hamba yang hina untuk menghadap Raja Semesta Alam. Niat di dalam hati adalah pemutus keterikatan dengan hiruk-pikuk dunia dan penyerahan jiwa secara total hanya kepada Allah.',
    tadabbur:
      'Bayangkan saat Anda berdiri, Anda sedang menghadap Dzat Yang Menggenggam nyawa Anda, meletakkan dunia di bawah telapak kaki, dan bersiap untuk berdialog secara sakral dengan Sang Pencipta.',
    hadithSource: 'HR. Bukhari no. 1 & Muslim no. 1907 (dari Umar bin Al-Khattab radhiyallahu anhu)',
    referenceBook: 'Al-Fiqh Al-Manhaji \'ala Madzhab Al-Imam Asy-Syafi\'i & Panduan Sholat Kemenag RI',
  },
  {
    id: 'takbiratul-ihram',
    stepNumber: 2,
    category: 'rukun',
    title: 'Takbiratul Ihram',
    arabicName: 'تَكْبِيرَةُ الْإِحْرَامِ',
    movementName: 'Mengangkat Kedua Tangan Sejajar Pundak / Telinga',
    movementDescription:
      'Mengangkat kedua tangan sejajar dengan pundak atau ujung telinga dengan telapak tangan menghadap kiblat dan jari-jari terbuka wajar, seraya mengikrarkan keagungan Allah.',
    arabic: 'اللهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah Maha Besar.',
    spiritualMeaning:
      'Disebut "Ihram" karena ucapan ini mengharamkan segala hal yang sebelumnya halal di luar sholat (seperti bicara, makan, minum, dan menoleh). Mengangkat kedua tangan bermakna melepaskan dan melempar seluruh kesibukan dunia ke belakang punggung.',
    tadabbur:
      'Saat melafadzkan "Allahu Akbar", resapilah bahwa tidak ada masalah, pekerjaan, jabatan, atau kekhawatiran yang lebih besar daripada Allah. Segala sesuatu selain Allah adalah kecil dan fana.',
    hadithSource: 'HR. Bukhari no. 735 & Muslim no. 390 (dari Abdullah bin Umar radhiyallahu anhuma)',
    referenceBook: 'Sifat Shalat Nabi ﷺ (Asy-Syaikh Al-Albani) & Asrar Ash-Salah (Ibnul Qayyim)',
  },
  {
    id: 'sedekap',
    stepNumber: 3,
    category: 'sunnah',
    title: 'Meletakkan Tangan di Dada (Sedekap)',
    arabicName: 'وَضْعُ الْيُمْنَى عَلَى الْيُسْرَى',
    movementName: 'Tangan Kanan Memegang/Menutupi Tangan Kiri',
    movementDescription:
      'Meletakkan telapak tangan kanan di atas punggung pergelangan tangan kiri di antara dada dan pusar, menjaga pandangan tetap tertunduk ke tempat sujud.',
    arabic: 'كَانَ النَّاسُ يُؤْمَرُونَ أَنْ يَضَعَ الرَّجُلُ الْيَدَ الْيُمْنَى عَلَى ذِرَاعِهِ الْيُسْرَى فِي الصَّلَاةِ',
    transliteration: 'Kaana an-naasu yu\'maruuna an yadha\'ar rajulu al-yadal yumnaa \'alaa dziraa\'ihil yusraa fish-shalaah.',
    translation:
      'Dahulu manusia diperintahkan agar seseorang meletakkan tangan kanannya di atas lengan kirinya dalam sholat.',
    spiritualMeaning:
      'Sikap sedekap adalah postur tubuh seorang hamba sahaya atau prajurit yang berdiri khidmat dan tawadhu\' di depan Sang Pemilik Kerajaan. Menjaga ketenangan anggota tubuh agar hati tidak goyah.',
    tadabbur:
      'Tangan yang terkunci di depan dada menghentikan tangan dari menyentuh hal-hal duniawi, simbol kepatuhan batin dan ketundukan raga.',
    hadithSource: 'HR. Bukhari no. 740 (dari Sahl bin Sa\'ad radhiyallahu anhu)',
    referenceBook: 'Fathul Bari Syarah Shahih Al-Bukhari (Al-Hafizh Ibnu Hajar)',
  },
  {
    id: 'doa-iftitah',
    stepNumber: 4,
    category: 'sunnah',
    title: 'Doa Iftitah (Istiftah)',
    arabicName: 'دُعَاءُ الِاسْتِفْتَاحِ',
    movementName: 'Berdiri Khidmat Membaca Pembuka Sholat',
    movementDescription:
      'Membaca doa iftitah secara sirr (perlahan) setelah takbiratul ihram sebelum membaca surah Al-Fatihah pada rakaat pertama.',
    arabic: 'وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا مُسْلِمًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ، إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ، لَا شَرِيكَ لَهُ وَبِذَٰلِكَ أُمِرْتُ وَأَنَا مِنَ الْمُسْلِمِينَ',
    transliteration:
      'Wajjahtu wajhiya lilladzii fatharas-samaawaati wal-ardha haniifam-muslimaw-wa maa ana minal-musyrikiin. Inna shalaatii wa nusukii wa mahyaaya wa mamaatii lillaahi rabbil-\'aalamiin. Laa syariika lahu wa bidzaalika umirtu wa ana minal-muslimiin.',
    translation:
      'Aku hadapkan wajahku kepada Dzat yang menciptakan langit dan bumi dengan lurus dan berserah diri, dan aku bukanlah termasuk orang-orang musyrik. Sesungguhnya sholatku, ibadahku, hidupku, dan matiku hanyalah untuk Allah Rabb semesta alam. Tiada sekutu bagi-Nya, dan demikianlah yang diperintahkan kepadaku dan aku termasuk orang-orang yang berserah diri.',
    spiritualMeaning:
      'Deklarasi tauhid mutlak dan pemurnian arah hidup. Menegaskan bahwa seluruh tarikan nafas, ibadah, hidup di dunia hingga kematian di masa depan hanya dipersembahkan kepada Allah semata.',
    tadabbur:
      'Apakah hidup dan mati kita sudah benar-benar kita serahkan kepada Allah? Doa iftitah adalah janji setia hamba setiap kali membuka perjumpaan dengan Rabb-nya.',
    hadithSource: 'HR. Muslim no. 771 (dari Ali bin Abi Thalib radhiyallahu anhu)',
    referenceBook: 'Shahih Muslim & Panduan Risalah Sholat Kemenag RI',
  },
  {
    id: 'al-fatihah',
    stepNumber: 5,
    category: 'rukun',
    title: "Membaca Surah Al-Fatihah (Ummul Qur'an)",
    arabicName: 'قِرَاءَةُ سُورَةِ الْفَاتِحَةِ',
    movementName: 'Membaca Ayat demi Ayat dengan Tartil',
    movementDescription:
      'Membaca Surah Al-Fatihah dengan benar tajwidnya, melafadzkan basmalah, dan berhenti pada setiap akhir ayat (waqaf sunnah). Wajib dibaca pada setiap rakaat.',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    transliteration:
      "Bismillaahir-rahmaanir-rahiim. Al-hamdu lillaahi rabbil-'aalamiin. Ar-rahmaanir-rahiim. Maaliki yawmid-diin. Iyyaaka na'budu wa iyyaaka nasta'iin. Ihdinas-shiraathal-mustaqiim. Shiraathal-ladziina an'amta 'alayhim ghayril-maghdhuubi 'alayhim waladh-dhaalliin.",
    translation:
      'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Rabb semesta alam. Maha Pengasih lagi Maha Penyayang. Pemilik Hari Pembalasan. Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan. Tunjukilah kami jalan yang lurus, (yaitu) jalan orang-orang yang telah Engkau beri nikmat kepada mereka; bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat.',
    spiritualMeaning:
      'Al-Fatihah adalah dialog dua arah langsung dengan Allah. Dalam Hadits Qudsi, Allah menjawab setiap ayat: memuji-Ku, menyanjung-Ku, mengagungkan-Ku, dan doa hamba-Ku pasti Ku-kabulkan.',
    tadabbur:
      'Puncak Al-Fatihah ada pada "Iyyaka na\'budu wa iyyaka nasta\'in" (kemurnian ibadah dan tawakkal) serta permohonan hidayah jalan lurus para nabi dan syuhada.',
    hadithSource: 'HR. Bukhari no. 756 & Muslim no. 394 & Hadits Qudsi Muslim no. 395',
    referenceBook: 'Madarijus Salikin & Asrar Ash-Salah (Imam Ibnul Qayyim)',
  },
  {
    id: 'ruku',
    stepNumber: 6,
    category: 'rukun',
    title: "Ruku' & Thuma'ninah",
    arabicName: 'الرُّكُوعُ وَالطُّمَأْنِينَةُ',
    movementName: 'Membungkukkan Punggung Rata Sejajar Kepala',
    movementDescription:
      'Membungkuk hingga punggung lurus mendatar, kedua tangan mencengkeram lutut dengan jari-jari renggang, siku tidak menempel ke badan, dan tenang sejenak (thuma\'ninah).',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ',
    transliteration: "Subhaana rabbiyal 'azhiimi wa bihamdih (3x)",
    translation: 'Maha Suci Rabbku Yang Maha Agung dan dengan memuji-Nya.',
    spiritualMeaning:
      'Ruku\' adalah penundukan fisik tertinggi sebelum sujud. Punggung yang kerap menegak karena kesombongan atau kedudukan dunia kini dibungkukkan datar sebagai lambang pengakuan atas Keagungan Allah (Al-\'Azhim).',
    tadabbur:
      'Rasulullah ﷺ bersabda: "Adapun ketika ruku\', agungkanlah Rabb di dalamnya." Menunduklah seraya menyadari betapa kerdilnya manusia di hadapan kemegahan Ilahi.',
    hadithSource: 'HR. Muslim no. 479 & Abu Dawud no. 870 (dari Hudzaifah radhiyallahu anhu)',
    referenceBook: 'Shahih Muslim & Al-Adzkar (Imam An-Nawawi)',
  },
  {
    id: 'itidal',
    stepNumber: 7,
    category: 'rukun',
    title: "I'tidal (Bangkit dari Ruku')",
    arabicName: 'الِاعْتِدَالُ وَالطُّمَأْنِينَةُ',
    movementName: 'Berdiri Tegak Sejenak dengan Ketenangan',
    movementDescription:
      'Bangkit dari ruku\' seraya mengangkat kedua tangan sambil membaca tasmi\', lalu berdiri tegak sempurna dengan thuma\'ninah seraya membaca tahmid.',
    arabic: 'سَمِعَ اللهُ لِمَنْ حَمِدَهُ ۝ رَبَّنَا لَكَ الْحَمْدُ مِلْءَ السَّمَاوَاتِ وَمِلْءَ الْأَرْضِ وَمِلْءَ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ',
    transliteration:
      "Sami'allaahu liman hamidah. Rabbanaa lakal hamdu mil'as-samaawaati wa mil'al-ardhi wa mil'a maa syi'ta min syai'im-ba'd.",
    translation:
      'Allah Maha Mendengar siapa saja yang memuji-Nya. Wahai Rabb kami, bagi-Mu segala puji sepenuh langit dan sepenuh bumi, dan sepenuh apa pun yang Engkau kehendaki setelah itu.',
    spiritualMeaning:
      'Kepastian bahwa setiap pujian dan bisikan syukur seorang hamba didengar langsung oleh Allah tanpa perantara. Kita memuji Allah dengan pujian yang melimpah memenuhi seisi jagat raya.',
    tadabbur:
      'Ketika malaikat bergegas mencatat pahala orang yang membaca tahmid i\'tidal (HR. Bukhari no. 799), hayatilah bahwa pujian kita kepada Allah melampaui batas langit dan bumi.',
    hadithSource: 'HR. Bukhari no. 795 & Muslim no. 477 (dari Abu Hurairah radhiyallahu anhu)',
    referenceBook: 'Al-Majmu\' Syarah Al-Muhadzdzab (Imam An-Nawawi)',
  },
  {
    id: 'sujud',
    stepNumber: 8,
    category: 'rukun',
    title: 'Sujud (Puncak Kedekatan dengan Allah)',
    arabicName: 'السُّجُودُ وَالطُّمَأْنِينَةُ',
    movementName: 'Menempelkan 7 Anggota Sujud ke Tanah',
    movementDescription:
      'Sujud dengan 7 anggota badan: dahi beserta hidung, kedua telapak tangan, kedua lutut, dan ujung jari jemari kedua kaki yang ditegakkan menghadap kiblat.',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ',
    transliteration: "Subhaana rabbiyal a'laa wa bihamdih (3x)",
    translation: 'Maha Suci Rabbku Yang Maha Tinggi dan dengan memuji-Nya.',
    spiritualMeaning:
      'Puncak kehambaan dan titik terdekat hamba dengan Allah. Anggota tubuh yang paling terhormat dan dimuliakan manusia (wajah dan dahi) diciumkan ke atas tanah yang rendah, mengakui bahwa hanya Allah Yang Maha Tinggi (Al-A\'la).',
    tadabbur:
      'Nabi ﷺ bersabda: "Keadaan paling dekat seorang hamba kepada Rabb-nya adalah ketika ia sedang sujud, maka perbanyaklah doa." (HR. Muslim). Bersujudlah seolah ini adalah sujud terakhir Anda di dunia.',
    hadithSource: 'HR. Muslim no. 482 & HR. Bukhari no. 812 (dari Ibnu Abbas radhiyallahu anhuma)',
    referenceBook: 'Asrar Ash-Salah (Imam Ibnul Qayyim) & Shahihain',
  },
  {
    id: 'duduk-antara-dua-sujud',
    stepNumber: 9,
    category: 'rukun',
    title: 'Duduk di Antara Dua Sujud (Iftirasy)',
    arabicName: 'الْجُلُوسُ بَيْنَ السَّجْدَتَيْنِ',
    movementName: 'Duduk di Atas Kaki Kiri & Menegakkan Kaki Kanan',
    movementDescription:
      'Duduk tenang (thuma\'ninah) di atas telapak kaki kiri yang dibentangkan, sementara telapak kaki kanan ditegakkan dengan jari-jari menghadap kiblat.',
    arabic: 'رَبِّ اغْفِرْ لِي، وَارْحَمْنِي، وَاجْبُرْنِي، وَارْفَعْنِي، وَارْزُقْنِي، وَاهْدِنِي، وَعَافِنِي، وَاعْفُ عَنِّي',
    transliteration:
      "Rabbighfir lii, warhamnii, wajburnii, warfa'nii, warzuqnii, wahdinii, wa 'aafinii, wa'fu 'annii.",
    translation:
      'Wahai Rabbku, ampunilah aku, sayangilah aku, tutuplah segala kekuranganku, tinggikanlah derajatku, karuniakanlah aku rezeki, berilah aku petunjuk, berikanlah aku kesehatan/keselamatan, dan maafkanlah kesalahanku.',
    spiritualMeaning:
      'Kumpulan 8 doa paling komprehensif dalam syariat. Di jeda antara dua sujud ini, hamba meminta paket lengkap keselamatan: ampunan dosa, kasih sayang, perbaikan aib, kemuliaan derajat, rezeki halal, hidayah, kesehatan lahir batin, dan maaf Ilahi.',
    tadabbur:
      'Resapilah setiap satu kata dari 8 permohonan ini. Tidak ada satu pun hajat dunia dan akhirat manusia yang luput dari doa agung yang diajarkan Rasulullah ﷺ ini.',
    hadithSource: 'HR. Abu Dawud no. 850 & Tirmidzi no. 284 (dari Ibnu Abbas radhiyallahu anhuma)',
    referenceBook: 'Sunan Abu Dawud, Jami\' At-Tirmidzi, & Fiqhus Sunnah',
  },
  {
    id: 'tasyahud',
    stepNumber: 10,
    category: 'rukun',
    title: 'Tasyahud Awal & Akhir (Tahiyyat)',
    arabicName: 'التَّشَهُّدُ وَالصَّلَاةُ عَلَى النَّبِيِّ',
    movementName: 'Duduk Tawarruk/Iftirasy & Berisyarat Jari Telunjuk',
    movementDescription:
      'Duduk bersimpuh dan meletakkan tangan di atas paha. Jari telunjuk tangan kanan diacungkan saat melafadzkan kalimat syahadat sebagai lambang ketauhidan.',
    arabic: 'التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللهِ',
    transliteration:
      "At-tahiyyaatul-mubaarakaatus-shalawaatut-thayyibaatu lillaah. As-salaamu 'alayka ayyuhan-nabiyyu wa rahmatullaahi wa barakaatuh. As-salaamu 'alaynaa wa 'alaa 'ibaadillaahis-shaalihiin. Asyhadu allaa ilaaha illallaah, wa asyhadu anna Muhammadar-rasuulullaah.",
    translation:
      'Segala penghormatan yang penuh berkah, shalawat, dan kebaikan hanyalah milik Allah. Keselamatan bagimu wahai Nabi, beserta rahmat Allah dan keberkahan-Nya. Keselamatan semoga tercurah atas kami dan atas hamba-hamba Allah yang shalih. Aku bersaksi bahwa tiada ilah selain Allah, dan aku bersaksi bahwa Muhammad adalah utusan Allah.',
    spiritualMeaning:
      'Mengabadikan salam penghormatan ruhani: mempersembahkan segala kemuliaan kepada Allah, menyapa Rasulullah ﷺ dengan salam cinta dan rindu, mendoakan keselamatan seluruh kaum mukminin di seantero bumi, dan memperbarui ikrar dua kalimat syahadat.',
    tadabbur:
      'Ketika mengucapkan "As-salamu \'alayna wa \'ala \'ibadillahis shalihin", salam Anda sampai kepada setiap hamba shalih di langit dan di bumi (HR. Bukhari no. 831).',
    hadithSource: 'HR. Bukhari no. 831, 1202 & Muslim no. 402, 403 (dari Abdullah bin Mas\'ud radhiyallahu anhu)',
    referenceBook: 'Shahih Al-Bukhari & Al-Adzkar An-Nawawiyyah',
  },
  {
    id: 'shalawat-ibrahimiyyah',
    stepNumber: 11,
    category: 'rukun',
    title: 'Shalawat Ibrahimiyyah',
    arabicName: 'الصَّلَاةُ الْإِبْرَاهِيمِيَّةُ',
    movementName: 'Melafadzkan Shalawat Sempurna di Tasyahud Akhir',
    movementDescription:
      'Wajib dibaca pada tasyahud akhir sebelum salam, mendoakan keberkahan bagi Nabi Muhammad ﷺ dan keluarga Nabi Ibrahim \'alaihissalam.',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration:
      "Allaahumma shalli 'alaa Muhammadiw-wa 'alaa aali Muhammad, kamaa shallayta 'alaa Ibraahiima wa 'alaa aali Ibraahiim, innaka hamiidum-majiid. Allaahumma baarik 'alaa Muhammadiw-wa 'alaa aali Muhammad, kamaa baarakta 'alaa Ibraahiima wa 'alaa aali Ibraahiim, innaka hamiidum-majiid.",
    translation:
      'Ya Allah, limpahkanlah rahmat kepada Nabi Muhammad dan kepada keluarga Nabi Muhammad, sebagaimana Engkau telah melimpahkan rahmat kepada Nabi Ibrahim dan keluarga Nabi Ibrahim. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, berkahilah Nabi Muhammad dan keluarga Nabi Muhammad, sebagaimana Engkau telah memberkahi Nabi Ibrahim dan keluarga Nabi Ibrahim. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.',
    spiritualMeaning:
      'Lafadz shalawat paling utama dan paling afdhal yang diajarkan langsung oleh Rasulullah ﷺ. Menyambungkan sanad keberkahan risalah tauhid dari Nabi Ibrahim Khalilullah hingga penutup para nabi, Muhammad Rasulullah ﷺ.',
    tadabbur:
      'Membaca shalawat ini adalah bukti cinta dan balas budi atas perjuangan Rasulullah ﷺ menyampaikan hidayah Islam hingga sampai kepada kita hari ini.',
    hadithSource: 'HR. Bukhari no. 3370 & Muslim no. 405 (dari Ka\'ab bin \'Ujrah radhiyallahu anhu)',
    referenceBook: 'Shahih Al-Bukhari, Bab Shifatush Shalah',
  },
  {
    id: 'doa-sebelum-salam',
    stepNumber: 12,
    category: 'sunnah',
    title: 'Doa Perlindungan 4 Perkara Sebelum Salam',
    arabicName: 'الدُّعَاءُ قَبْلَ السَّلَامِ',
    movementName: 'Memohon Perlindungan Terakhir Sebelum Menutup Sholat',
    movementDescription:
      'Dianjurkan dibaca setelah tasyahud akhir dan shalawat, sebelum menolehkan kepala ke kanan untuk salam.',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
    transliteration:
      "Allaahumma innii a'uudzu bika min 'adzaabi jahannam, wa min 'adzaabil-qabr, wa min fitnatil-mahyaa wal-mamaat, wa min syarri fitnatil-masiihid-dajjaal.",
    translation:
      'Ya Allah, sesungguhnya aku berlindung kepada-Mu dari siksa neraka Jahannam, dari siksa kubur, dari fitnah kehidupan dan kematian, serta dari keburukan fitnah Al-Masih Ad-Dajjal.',
    spiritualMeaning:
      'Benteng pamungkas dari 4 fitnah dan ancaman paling mengerikan dalam eksistensi manusia: azab neraka, azab alam barzakh (kubur), ujian godaan nafsu/dunia saat hidup dan saat sakaratul maut, serta fitnah penyesatan Dajjal di akhir zaman.',
    tadabbur:
      'Sebelum kembali melangkah ke hiruk pikuk kehidupan dunia, mintalah perlindungan kokoh kepada Allah agar tidak tersesat oleh fitnah zaman.',
    hadithSource: 'HR. Bukhari no. 1377 & Muslim no. 588 (dari Abu Hurairah radhiyallahu anhu)',
    referenceBook: 'Riyadhus Shalihin (Imam An-Nawawi, Bab Adzkar Ash-Salah)',
  },
  {
    id: 'salam',
    stepNumber: 13,
    category: 'rukun',
    title: 'Salam (Penutup Sholat)',
    arabicName: 'التَّسْلِيمُ (خِتَامُ الصَّلَاةِ)',
    movementName: 'Menoleh ke Kanan Lalu ke Kiri',
    movementDescription:
      'Menolehkan kepala ke kanan hingga pipi putih terlihat dari belakang seraya berucap salam pertama (rukun), kemudian menoleh ke kiri seraya berucap salam kedua (sunnah).',
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ',
    transliteration: "As-salaamu 'alaykum wa rahmatullaah.",
    translation: 'Semoga keselamatan dan rahmat Allah senantiasa tercurah kepada kalian.',
    spiritualMeaning:
      'Sholat dimulai dengan Takbir (mengagungkan Allah dan memutus dunia) dan diakhiri dengan Salam (menebarkan damai, kasih sayang, dan rahmat kepada sesama manusia dan seluruh alam semesta).',
    tadabbur:
      'Seseorang yang telah selesai sholat keluar dengan hati yang bersih, membawa misi kedamaian dan rahmat Islam, berjanji tidak akan menyakiti orang lain dengan lisan maupun tangannya.',
    hadithSource: 'HR. Muslim no. 582 & Abu Dawud no. 996 (dari Abdullah bin Mas\'ud radhiyallahu anhu)',
    referenceBook: 'Sifat Shalat Nabi ﷺ (Al-Albani) & Al-Fiqh Al-Manhaji',
  },
];
