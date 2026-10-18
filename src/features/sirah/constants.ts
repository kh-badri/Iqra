import type { SirahEpisode } from './types';

export const SIRAH_EPISODES: SirahEpisode[] = [
  {
    id: 'kelahiran-nasab',
    order: 1,
    phase: 'makkah',
    title: 'Nasab Mulia & Kelahiran Yatim di Tahun Gajah',
    arabicTitle: 'النَّسَبُ الشَّرِيفُ وَالْمَوْلِدُ النَّبَوِيُّ',
    yearMasehi: '571 M',
    yearHijri: '53 SH (Sebelum Hijriah)',
    age: 'Bayi',
    location: 'Makkah Al-Mukarramah',
    summary:
      'Nabi Muhammad ﷺ lahir dari garis keturunan Quraisy paling mulia keturunan Nabi Ismail AS. Beliau lahir dalam keadaan yatim pada Tahun Gajah, saat pasukan Abrahah dihancurkan Allah.',
    content: [
      'Garis nasab Nabi Muhammad ﷺ tersambung hingga Nabi Ismail AS bin Nabi Ibrahim AS. Ayah beliau bernama Abdullah bin Abdul Muthalib, dan ibunda beliau bernama Aminah binti Wahab.',
      'Sang ayah wafat di Yatsrib saat beliau masih di dalam kandungan, sehingga beliau lahir ke dunia sebagai anak yatim pada hari Senin, 12 Rabi\'ul Awwal Tahun Gajah (571 M).',
      'Kelahiran beliau diiringi berbagai tanda kenabian dan keberkahan, bertepatan dengan peristiwa binasanya pasukan bergajah raja Abrahah yang hendak menghancurkan Ka\'bah.'
    ],
    verseRefs: [
      {
        surah: 'QS. Adh-Dhuha : 6',
        text: 'أَلَمْ يَجِدْكَ يَتِيمًا فَـَٔاوَىٰ',
        translation: 'Bukankah Dia mendapatimu sebagai seorang yatim, lalu Dia melindungimu?'
      },
      {
        surah: 'QS. Al-Fil : 1-2',
        text: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَـٰبِ ٱلْفِيلِ',
        translation: 'Tidakkah engkau perhatikan bagaimana Tuhanmu telah bertindak terhadap pasukan bergajah?'
      }
    ],
    hadithRefs: [
      {
        source: 'HR. Muslim No. 1162',
        text: 'Nabi ﷺ ditanya tentang puasa hari Senin, beliau bersabda: "Itu adalah hari aku dilahirkan dan hari aku diutus atau diturunkan wahyu kepadaku."'
      }
    ],
    lessons: [
      'Allah memilih garis keturunan yang paling bersih dan mulia untuk membawa risalah terakhir.',
      'Kondisi yatim menumbuhkan kepekaan, keikhlasan, dan kebergantungan mutlak hanya kepada Allah ﷻ.'
    ]
  },
  {
    id: 'masa-susuan-asuhan',
    order: 2,
    phase: 'makkah',
    title: 'Masa Susuan di Bani Sa\'ad & Peristiwa Pembelahan Dada',
    arabicTitle: 'رَضَاعُهُ فِي بَنِي سَعْدٍ وَشَقُّ الصَّدْرِ',
    yearMasehi: '571 - 576 M',
    yearHijri: '53 - 48 SH',
    age: '0 - 5 Tahun',
    location: 'Perkampungan Bani Sa\'ad & Makkah',
    summary:
      'Disusui oleh Halimah As-Sa\'diyah di padang pasir. Terjadi peristiwa pembelahan dada oleh malaikat Jibril untuk menyucikan hati beliau.',
    content: [
      'Sesuai tradisi bangsawan Quraisy, bayi Muhammad diasuh di pedalaman Arab oleh Halimah As-Sa\'diyah agar terlatih berbahasa Arab fasih dan berfisik kuat.',
      'Kehadiran bayi Muhammad mendatangkan keberkahan luar biasa: unta Halimah memproduksi banyak susu, ternak gemuk, dan tanaman subur.',
      'Ketika berusia sekitar 4 tahun, malaikat Jibril mendatangi beliau, membelah dadanya, mengeluarkan gumpalan hitam (bagian setan), lalu mencuci hatinya dengan air zamzam di dalam bejana emas sebelum mengembalikannya.'
    ],
    hadithRefs: [
      {
        source: 'HR. Muslim No. 162',
        text: 'Dari Anas bin Malik RA, bahwa Jibril mendatangi Rasulullah ﷺ ketika sedang bermain... Jibril membelah dadanya dan mengeluarkan segumpal darah lalu berkata: "Ini bagian setan yang ada padamu," lalu mencucinya di bejana emas dengan air zamzam.'
      }
    ],
    lessons: [
      'Penyucian hati dari segala kecenderungan maksiat adalah persiapan Ilahi bagi sang pengemban wahyu.',
      'Lingkungan yang sehat dan bahasa yang santun membentuk karakter pemimpin sejati.'
    ]
  },
  {
    id: 'wafat-ibu-kakek-paman',
    order: 3,
    phase: 'makkah',
    title: 'Wafatnya Ibunda Aminah & Kasih Sayang Abu Thalib',
    arabicTitle: 'وَفَاةُ أُمِّهِ وَجَدِّهِ وَكَفَالَةُ أَبِي طَالِبٍ',
    yearMasehi: '577 - 583 M',
    yearHijri: '47 - 41 SH',
    age: '6 - 12 Tahun',
    location: 'Abwa & Makkah',
    summary:
      'Ibunda beliau wafat di Abwa saat beliau berusia 6 tahun. Diasuh oleh sang kakek Abdul Muthalib hingga usia 8 tahun, lalu dilanjutkan oleh pamannya Abu Thalib.',
    content: [
      'Saat kembali dari ziarah ke makam ayahnya di Yatsrib, ibunda Aminah jatuh sakit dan wafat di desa Abwa. Muhammad kecil kembali ke Makkah tanpa ayah dan ibu.',
      'Sang kakek Abdul Muthalib merawatnya dengan penuh kemuliaan melebihi anak-anaknya sendiri, hingga sang kakek wafat saat Nabi berusia 8 tahun.',
      'Pengasuhan kemudian dilanjutkan oleh pamannya Abu Thalib yang berhati mulia, setia melindungi beliau dari segala mara bahaya hingga masa dakwah kelak.'
    ],
    lessons: [
      'Ujian kehilangan orang tercinta di masa kecil menempa jiwa menjadi tangguh, mandiri, dan berempati tinggi.',
      'Kasih sayang keluarga dan perlindungan paman menjadi benteng awal dakwah Islam.'
    ]
  },
  {
    id: 'pemuda-al-amin',
    order: 4,
    phase: 'makkah',
    title: 'Masa Pemuda, Menggembala, & Gelar Al-Amin',
    arabicTitle: 'شَبَابُهُ وَرَعْيُ الْغَنَمِ وَلَقَبُ الأَمِينِ',
    yearMasehi: '583 - 595 M',
    yearHijri: '41 - 29 SH',
    age: '12 - 24 Tahun',
    location: 'Makkah & Syam',
    summary:
      'Bekerja mandiri menggembala kambing dan berdagang ke negeri Syam. Dikenal masyarakat luas karena kejujuran puncaknya hingga digelari Al-Amin.',
    content: [
      'Muhammad muda tidak hidup berpangku tangan. Beliau menggembala kambing milik penduduk Makkah dengan upah beberapa qirath.',
      'Pada usia 12 tahun, beliau ikut berdagang ke Syam bersama Abu Thalib, di mana seorang pendeta bernama Bahira mengenali tanda-tanda kenabian pada diri beliau.',
      'Integritas, kejujuran, dan keluhuran akhlaknya membuat seluruh kabilah Makkah sepakat menjulukinya Al-Amin (orang yang paling terpercaya).'
    ],
    hadithRefs: [
      {
        source: 'HR. Bukhari No. 2262',
        text: 'Nabi ﷺ bersabda: "Tidaklah Allah mengutus seorang nabi pun melainkan dia pernah menggembala kambing." Para sahabat bertanya: "Dan engkau juga?" Beliau menjawab: "Ya, aku dahulu menggembalakannya untuk penduduk Makkah dengan upah beberapa qirath."'
      }
    ],
    lessons: [
      'Menggembala kambing melatih kesabaran, kelembutan, dan ketelitian dalam memimpin manusia.',
      'Kepercayaan masyarakat (reputasi integritas) adalah modal termahal sebelum menyampaikan kebenaran.'
    ]
  },
  {
    id: 'pernikahan-khadijah',
    order: 5,
    phase: 'makkah',
    title: 'Pernikahan dengan Khadijah RA & Renovasi Ka\'bah',
    arabicTitle: 'زَوَاجُهُ بِخَدِيجَةَ وَبِنَاءُ الْكَعْبَةِ',
    yearMasehi: '595 - 605 M',
    yearHijri: '28 - 18 SH',
    age: '25 - 35 Tahun',
    location: 'Makkah Al-Mukarramah',
    summary:
      'Menikah dengan wanita mulia Khadijah binti Khuwailid dan mendamaikan perselisihan kabilah Quraisy dalam peletakan Hajar Aswad.',
    content: [
      'Khadijah binti Khuwailid, seorang saudagar wanita terpandang, mempercayakan barang dagangannya kepada Muhammad. Terpikat oleh kejujuran dan kemuliaan akhlaknya, Khadijah mengajukan lamaran pernikahan.',
      'Dari pernikahan penuh berkah ini lahir putra-putri mulia: Al-Qasim, Abdullah, Zainab, Ruqayyah, Ummu Kultsum, dan Fatimah Az-Zahra.',
      'Ketika banjir merusak dinding Ka\'bah dan terjadi sengketa peletakan Hajar Aswad, Nabi ﷺ meletakkan batu suci itu di atas kain dan meminta setiap kepala suku memegang ujungnya, menghindarkan Makkah dari perang saudara.'
    ],
    lessons: [
      'Rumah tangga yang dibangun atas dasar kesalehan dan saling menghormati menjadi pilar penopang dakwah.',
      'Kebijaksanaan dan keadilan mampu meredam konflik persaudaraan yang berpotensi mematikan.'
    ]
  },
  {
    id: 'wahyu-pertama',
    order: 6,
    phase: 'makkah',
    title: 'Tahannuts di Gua Hira & Turunnya Wahyu Pertama',
    arabicTitle: 'التَّحَنُّثُ فِي غَارِ حِرَاءٍ وَبَدْءُ الْوَحْيِ',
    yearMasehi: '610 M',
    yearHijri: '13 SH (17 Ramadhan)',
    age: '40 Tahun',
    location: 'Gua Hira, Jabal An-Nur, Makkah',
    summary:
      'Malaikat Jibril membawa wahyu pertama Surah Al-\'Alaq ayat 1-5 di Gua Hira, menandai dimulainya era kenabian dan kerasulan akhir zaman.',
    content: [
      'Menjelang usia 40 tahun, beliau terbiasa menyendiri bertahannuts (beribadah) di Gua Hira, merenungkan keagungan pencipta di tengah kegelapan kemusyrikan kaumnya.',
      'Pada malam 17 Ramadhan, malaikat Jibril mendatangi beliau dan mendekapnya erat seraya berkata: "Iqra\'!" (Bacalah!). Beliau menjawab: "Aku tidak bisa membaca."',
      'Setelah dekapan ketiga, turunlah ayat pertama: "Iqra\' bismi Rabbikalladzii khalaq" (Bacalah dengan nama Tuhanmu yang menciptakan). Beliau pulang dengan gemetar dan ditenangkan oleh Khadijah dengan penuh kehangatan iman.'
    ],
    verseRefs: [
      {
        surah: 'QS. Al-\'Alaq : 1-5',
        text: 'ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ . خَلَقَ ٱلْإِنسَـٰنَ مِنْ عَلَقٍ . ٱقْرَأْ وَرَبُّكَ ٱلْأَكْرَمُ',
        translation: 'Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan. Dia telah menciptakan manusia dari segumpal darah. Bacalah, dan Tuhanmulah Yang Mahamulia.'
      }
    ],
    hadithRefs: [
      {
        source: 'HR. Bukhari No. 3',
        text: 'Khadijah menenangkan Nabi: "Demi Allah, Allah tidak akan menghinakanmu selama-lamanya. Engkau selalu menyambung silaturahmi, menanggung beban orang lemah, membantu orang miskin, memuliakan tamu, dan menolong penegak kebenaran."'
      }
    ],
    lessons: [
      'Ilmu dan literasi ("Iqra") adalah fondasi utama peradaban Islam.',
      'Peran istri shalihah (Khadijah) menjadi penguat iman terpenting di saat genting.'
    ]
  },
  {
    id: 'dakwah-sirriyah-jahriyyah',
    order: 7,
    phase: 'makkah',
    title: 'Dakwah Sirriyah di Darul Arqam & Seruan Terbuka di Shafa',
    arabicTitle: 'الدَّعْوَةُ السِّرِّيَّةُ وَالْجَهْرُ بِالدَّعْوَةِ',
    yearMasehi: '610 - 615 M',
    yearHijri: '13 - 8 SH',
    age: '40 - 45 Tahun',
    location: 'Rumah Al-Arqam & Bukit Shafa, Makkah',
    summary:
      'Dakwah rahasia selama 3 tahun melahirkan As-Sabiqunal Awwalun. Kemudian turun perintah berdakwah terbuka di Bukit Shafa menghadapi penentangan Quraisy.',
    content: [
      'Dakwah fase awal berpusat secara rahasia di rumah sahabat Al-Arqam bin Abi Al-Arqam. Generasi pertama masuk Islam: Abu Bakar, Ali bin Abi Thalib, Zaid bin Haritsah, Bilal, dan Utsman bin Affan.',
      'Setelah 3 tahun, turun firman Allah untuk berdakwah terang-terangan (QS. Al-Hijr: 94). Nabi menaiki Bukit Shafa dan menyeru seluruh kabilah Quraisy agar mentauhidkan Allah.',
      'Pamannya Abu Lahab mencela beliau: "Celakalah engkau, apakah hanya untuk ini engkau mengumpulkan kami?" Maka Allah menurunkan Surah Al-Lahab.'
    ],
    verseRefs: [
      {
        surah: 'QS. Al-Hijr : 94',
        text: 'فَٱصْدَعْ بِمَا تُؤْمَرُ وَأَعْرِضْ عَنِ ٱلْمُشْرِكِينَ',
        translation: 'Maka sampaikanlah secara terang-terangan apa yang diperintahkan kepadamu dan berpalinglah dari orang-orang musyrik.'
      }
    ],
    lessons: [
      'Strategi dakwah harus memperhatikan situasi: dimulai dari pembinaan kader yang kokoh sebelum ekspansi terbuka.',
      'Kebenaran seringkali ditentang pertama kali oleh orang terdekat yang tertutup hatinya oleh kesombongan.'
    ]
  },
  {
    id: 'penindasan-boikot',
    order: 8,
    phase: 'makkah',
    title: 'Penindasan Kaum Mukminin, Hijrah Habasyah, & Boikot',
    arabicTitle: 'تَعْذِيبُ الْمُسْتَضْعَفِينَ وَالْهِجْرَةُ إِلَى الْحَبَشَةِ وَالْحِصَارُ',
    yearMasehi: '615 - 619 M',
    yearHijri: '8 - 4 SH',
    age: '45 - 49 Tahun',
    location: 'Makkah & Kerajaan Habasyah (Ethiopia)',
    summary:
      'Penyiksaan kejam terhadap sahabat dhu\'afa, hijrah pertama ke Habasyah di bawah naungan Raja Najasyi, dan boikot ekonomi 3 tahun di Syi\'ib Abu Thalib.',
    content: [
      'Kaum kafir Quraisy menyiksa sahabat lemah: Bilal ditindih batu panas di padang pasir terik, keluarga Yasir disiksa hingga Sumayyah syahid sebagai syahidah pertama dalam Islam.',
      'Untuk menyelamatkan nyawa pengikutnya, Nabi memerintahkan hijrah ke Habasyah (Ethiopia) yang dipimpin Raja Najasyi, seorang raja adil yang melindungi kaum mukminin.',
      'Kaum Quraisy lalu memberlakukan boikot total terhadap Bani Hasyim dan Muthalib selama 3 tahun di lembah Syi\'ib, melarang jual beli dan perkawinan hingga kaum muslimin memakan dedaunan kering karena kelaparan.'
    ],
    lessons: [
      'Keteguhan aqidah kaum muslimin awal membuktikan bahwa iman lebih berharga daripada nyawa dan harta.',
      'Islam mengajarkan diplomasi cerdas mencari suaka perlindungan kepada pemimpin yang adil.'
    ]
  },
  {
    id: 'amul-huzni-isra-miraj',
    order: 9,
    phase: 'makkah',
    title: 'Tahun Duka Cita (\'Amul Huzni), Tha\'if, & Isra\' Mi\'raj',
    arabicTitle: 'عَامُ الْحُزْنِ وَرِحْلَةُ الطَّائِفِ وَالإِسْرَاءُ وَالْمِعْرَاجُ',
    yearMasehi: '619 - 621 M',
    yearHijri: '3 - 1 SH',
    age: '50 - 52 Tahun',
    location: 'Makkah, Tha\'if, Masjidil Aqsa, Sidratul Muntaha',
    summary:
      'Wafatnya Khadijah dan Abu Thalib, penolakan kejam penduduk Tha\'if, dan hiburan Ilahi melalui perjalanan mukjizat agung Isra\' Mi\'raj serta kewajiban sholat 5 waktu.',
    content: [
      'Pada tahun yang sama, dua pelindung utama Nabi wafat: sang paman Abu Thalib dan istri tercinta Khadijah RA. Tahun ini dinamai \'Amul Huzni (Tahun Kesedihan).',
      'Nabi berjalan kaki ke kota Tha\'if untuk berdakwah, namun penduduknya melempari beliau dengan batu hingga terompah beliau basah oleh darah. Saat malaikat menawarkan untuk menghimpit mereka dengan gunung, Nabi justru berdoa agar anak keturunan mereka menjadi penyembah Allah.',
      'Allah menghibur kekasih-Nya dengan mukjizat Isra\' Mi\'raj: diperjalankan dari Masjidil Haram ke Masjidil Aqsa, lalu dinaikkan ke Sidratul Muntaha melampaui tujuh lapis langit untuk menerima perintah agung sholat lima waktu.'
    ],
    verseRefs: [
      {
        surah: 'QS. Al-Isra\' : 1',
        text: 'سُبْحَـٰنَ ٱلَّذِىٓ أَسْرَىٰ بِعَبْدِهِۦ لَيْلًا مِّنَ ٱلْمَسْجِدِ ٱلْحَرَامِ إِلَى ٱلْمَسْجِدِ ٱلْأَقْصَا',
        translation: 'Mahasuci (Allah), yang telah memperjalankan hamba-Nya (Muhammad) pada malam hari dari Masjidilharam ke Masjidilaksa...'
      }
    ],
    hadithRefs: [
      {
        source: 'HR. Bukhari No. 3231',
        text: 'Doa Nabi di Tha\'if: "Bahkan aku berharap Allah mengeluarkan dari tulang sulbi mereka orang-orang yang beribadah kepada Allah semata dan tidak menyekutukan-Nya dengan apa pun."'
      }
    ],
    lessons: [
      'Puncak kesabaran dan pemaafan Rasulullah ﷺ terpancar saat menolak azab bagi penduduk Tha\'if yang menyakitinya.',
      'Ibadah sholat adalah hadiah langit langsung dan mi\'raj spiritual bagi setiap orang mukmin.'
    ]
  },
  {
    id: 'hijrah-madinah',
    order: 10,
    phase: 'madinah',
    title: 'Bai\'at \'Aqabah & Hijrah Menuju Madinah Al-Munawwarah',
    arabicTitle: 'بَيْعَةُ الْعَقَبَةِ وَالْهِجْرَةُ النَّبَوِيَّةُ الْمُبَارَكَةُ',
    yearMasehi: '622 M',
    yearHijri: '1 H',
    age: '53 Tahun',
    location: 'Gua Tsur, Quba, Madinah',
    summary:
      'Perjanjian setia kaum Anshar membuka jalan hijrah. Nabi ﷺ lolos dari kepungan pembunuhan Quraisy, berlindung di Gua Tsur bersama Abu Bakar, dan tiba di Madinah.',
    content: [
      'Musim haji membawa berkah dengan masuk Islamnya tokoh-tokoh Yatsrib melalui Bai\'at \'Aqabah I dan II, berjanji membela Rasulullah sebagaimana membela keluarga sendiri.',
      'Kaum musyrikin Quraisy bersekongkol mengepung rumah Nabi untuk membunuhnya. Nabi menugaskan Ali bin Abi Thalib tidur di tempat tidurnya dan keluar tanpa terlihat oleh mereka.',
      'Nabi bersama Abu Bakar bersembunyi 3 malam di Gua Tsur. Setelah menempuh perjalanan gurun berbahaya, beliau tiba di Quba membangun masjid pertama (Masjid Quba), lalu memasuki Madinah yang menyambut beliau dengan lantunan nasyid kegembiraan.'
    ],
    verseRefs: [
      {
        surah: 'QS. At-Taubah : 40',
        text: 'إِلَّا تَنصُرُوهُ فَقَدْ نَصَرَهُ ٱللَّهُ إِذْ أَخْرَجَهُ ٱلَّذِينَ كَفَرُوا۟ ثَانِىَ ٱثْنَيْنِ إِذْ هُمَا فِى ٱلْغَارِ إِذْ يَقُولُ لِصَـٰحِبِهِۦ لَا تَحْزَنْ إِنَّ ٱللَّهَ مَعَنَا',
        translation: 'Jikalau kamu tidak menolongnya, maka sesungguhnya Allah telah menolongnya (yaitu) ketika orang-orang kafir mengeluarkannya sedang dia salah seorang dari dua orang ketika keduanya berada dalam gua, waktu itu dia berkata kepada sahabatnya: "Janganlah engkau berduka cita, sesungguhnya Allah beserta kita."'
      }
    ],
    lessons: [
      'Tawakkal sempurna senantiasa disertai dengan perencanaan dan kehati-hatian (*ikhtiar*).',
      'Peristiwa Hijrah menjadi titik awal penanggalan kalender Islam (Tahun Hijriah).'
    ]
  },
  {
    id: 'piagam-madinah-masjid',
    order: 11,
    phase: 'madinah',
    title: 'Membangun Masjid Nabawi, Mu\'akhat, & Piagam Madinah',
    arabicTitle: 'بِنَاءُ الْمَسْجِدِ النَّبَوِيِّ وَالْمُؤَاخَاةُ وَصَحِيفَةُ الْمَدِينَةِ',
    yearMasehi: '622 - 623 M',
    yearHijri: '1 H',
    age: '53 Tahun',
    location: 'Madinah Al-Munawwarah',
    summary:
      'Tiga pilar peradaban Madinah: Membangun Masjid Nabawi sebagai pusat umat, mempersaudarakan Muhajirin dan Anshar, serta merumuskan konstitusi Piagam Madinah.',
    content: [
      'Pilar pertama: Membangun Masjid Nabawi yang berfungsi sebagai tempat ibadah, pusat pendidikan, musyawarah pemerintahan, dan tempat bernaung kaum dhu\'afa (Ahlus Suffah).',
      'Pilar kedua: *Mu\'akhat* (mempersaudarakan) antara kaum Muhajirin yang meninggalkan harta di Makkah dengan kaum Anshar Madinah yang rela membagi rumah dan hartanya.',
      'Pilar ketiga: Menetapkan Piagam Madinah (*Dustur Al-Madinah*), konstitusi tertulis pertama di dunia yang menjamin kebebasan beragama, keadilan hukum, dan persatuan seluruh warga termasuk kaum Yahudi.'
    ],
    lessons: [
      'Masjid adalah jantung utama pembangunan peradaban, persatuan, dan pendidikan umat.',
      'Solidaritas sosial persaudaraan Islam melampaui batas suku, ras, dan ikatan darah.'
    ]
  },
  {
    id: 'perang-badar-kubra',
    order: 12,
    phase: 'madinah',
    title: 'Perang Badar Al-Kubra: Kemenangan Pembeda (Yaumul Furqan)',
    arabicTitle: 'غَزْوَةُ بَدْرٍ الْكُبْرَى (يَوْمُ الْفُرْقَانِ)',
    yearMasehi: '624 M',
    yearHijri: '17 Ramadhan 2 H',
    age: '54 Tahun',
    location: 'Lembah Badar (130 km barat daya Madinah)',
    summary:
      'Pertempuran pembeda antara kebenaran dan kebatilan. 313 kaum muslimin dengan pertolongan Allah mengalahkan 1.000 pasukan musyrikin Quraisy.',
    content: [
      'Pada 17 Ramadhan 2 H, pasukan muslimin yang awalnya hendak mencegat kafilah dagang Quraisy berhadapan dengan 1.000 bala tentara kafir Makkah yang lengkap bersenjata.',
      'Nabi ﷺ berdoa semalam suntuk dengan mengangkat kedua tangan hingga sorbannya jatuh: "Ya Allah, jikalau pasukan kecil ini binasa, Engkau tidak akan disembah lagi di muka bumi."',
      'Allah menurunkan ribuan malaikat membantu barisan muslimin. Kemenangan besar diraih: para tokoh utama kekufuran Makkah (seperti Abu Jahal) tewas, dan para tawanan perang diperlakukan dengan penuh adab dan kemanusiaan.'
    ],
    verseRefs: [
      {
        surah: 'QS. Ali \'Imran : 123',
        text: 'وَلَقَدْ نَصَرَكُمُ ٱللَّهُ بِبَدْرٍ وَأَنتُمْ أَذِلَّةٌ ۖ فَٱتَّقُوا۟ ٱللَّهَ لَعَلَّكُمْ تَشْكُرُونَ',
        translation: 'Dan sungguh Allah telah menolong kamu dalam peperangan Badar, padahal kamu adalah (ketika itu) pihak yang lemah...'
      }
    ],
    lessons: [
      'Kemenangan hakiki ditentukan oleh pertolongan Allah dan ketakwaan, bukan oleh keunggulan jumlah materi semata.',
      'Perlakuan beradab terhadap tawanan perang menjadi tonggak hukum humaniter Islam.'
    ]
  },
  {
    id: 'perang-uhud-khandaq',
    order: 13,
    phase: 'madinah',
    title: 'Ujian Perang Uhud & Strategi Parit Perang Khandaq',
    arabicTitle: 'غَزْوَةُ أُحُدٍ وَغَزْوَةُ الْخَنْدَقِ (الأَحْزَابِ)',
    yearMasehi: '625 - 627 M',
    yearHijri: 'Syawwal 3 H & Syawwal 5 H',
    age: '55 - 57 Tahun',
    location: 'Bukit Uhud & Sekeliling Madinah',
    summary:
      'Pelajaran kepatuhan pada Perang Uhud ketika pemanah turun dari bukit. Disusul Perang Khandaq ketika parit pertahanan berhasil memukul mundur 10.000 pasukan koalisi sekutu.',
    content: [
      'Pada Perang Uhud, kemenangan awal kaum muslimin berbalik menjadi ujian berat saat pasukan pemanah meninggalkan posisi di bukit demi mengejar ghanimah, mengakibatkan gugurnya 70 sahabat termasuk Hamzah bin Abdul Muthalib.',
      'Dua tahun berselang, kaum musyrikin membentuk koalisi sekutu (Ahzab) berkekuatan 10.000 tentara mengepung Madinah. Atas saran brilian Salman Al-Farisi, Nabi memimpin penggalian parit (khandaq) raksasa di perbatasan utara kota.',
      'Setelah pengepungan sengit di tengah badai angin dingin dan kelaparan, Allah mengirimkan angin kencang yang memporak-porandakan kemah pasukan sekutu hingga mereka melarikan diri tanpa hasil.'
    ],
    verseRefs: [
      {
        surah: 'QS. Al-Ahzab : 9',
        text: 'يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱذْكُرُوا۟ نِعْمَةَ ٱللَّهِ عَلَيْكُمْ إِذْ جَآءَتْكُمْ جُنُودٌ فَأَرْسَلْنَا عَلَيْهِمْ رِيحًا وَجُنُودًا لَّمْ تَرَوْهَا',
        translation: 'Wahai orang-orang yang beriman, ingatlah nikmat Allah yang dianugerahkan kepadamu ketika datang kepadamu bala tentara, lalu Kami kirimkan kepada mereka angin kencang dan bala tentara yang tidak dapat kamu lihat...'
      }
    ],
    lessons: [
      'Ketaatan mutlak kepada instruksi Rasulullah ﷺ adalah kunci keselamatan dan kemenangan umat.',
      'Keterbukaan terhadap musyawarah dan strategi taktik baru (seperti parit Salman) adalah sunnah kepemimpinan Nabi.'
    ]
  },
  {
    id: 'perjanjian-hudaibiyah',
    order: 14,
    phase: 'madinah',
    title: 'Perjanjian Hudaibiyah & Surat Dakwah ke Raja-Raja Dunia',
    arabicTitle: 'صُلْحُ الْحُدَيْبِيَةِ وَمُرَاسَلَةُ الْمُلُوكِ وَالأُمَرَاءِ',
    yearMasehi: '628 M',
    yearHijri: 'Dzulqa\'dah 6 H',
    age: '57 Tahun',
    location: 'Hudaibiyah & Istana-Istana Dunia',
    summary:
      'Gencatan senjata 10 tahun yang dinilai Allah sebagai kemenangan nyata (Fathan Mubina). Rasulullah ﷺ mengirim surat dakwah resmi kepada para kaisar dan raja dunia.',
    content: [
      'Nabi bersama 1.400 sahabat berniat umrah damai, namun dihadang Quraisy di Hudaibiyah. Terjadi perundingan alot yang menghasilkan kesepakatan gencatan senjata 10 tahun.',
      'Meskipun secara lahiriah isi perjanjian tampak berat sebelah merugikan kaum muslimin, Allah menyebutnya sebagai "Kemenangan yang Nyata" (Fathan Mubina) karena terciptanya stabilitas keamanan dakwah.',
      'Masa damai dimanfaatkan untuk menyebarkan risalah universal Islam: Nabi mengirim utusan dan surat bertuliskan stempel "Muhammad Rasulullah" kepada Kaisar Romawi (Heraklius), Kisra Persia, Raja Najasyi Habasyah, dan Muqauqis Mesir.'
    ],
    verseRefs: [
      {
        surah: 'QS. Al-Fath : 1',
        text: 'إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا',
        translation: 'Sesungguhnya Kami telah memberikan kepadamu kemenangan yang nyata.'
      }
    ],
    lessons: [
      'Perdamaian dan diplomasi seringkali menghasilkan kemenangan dakwah yang jauh lebih besar daripada peperangan.',
      'Islam adalah risalah global untuk seluruh umat manusia, bukan terbatas pada bangsa Arab saja.'
    ]
  },
  {
    id: 'fathu-makkah',
    order: 15,
    phase: 'madinah',
    title: 'Fathu Makkah: Pembebasan Kota Suci Tanpa Pertumpahan Darah',
    arabicTitle: 'فَتْحُ مَكَّةَ الْمُعَظَّمَةِ (النَّصْرُ الأَعْظَمُ)',
    yearMasehi: '630 M',
    yearHijri: 'Ramadhan 8 H',
    age: '60 Tahun',
    location: 'Makkah Al-Mukarramah',
    summary:
      'Pasukan 10.000 kaum muslimin memasuki Makkah dengan damai. 360 berhala di sekitar Ka\'bah dihancurkan, dan Rasulullah ﷺ memberikan pengampunan umum kepada seluruh penduduk Makkah.',
    content: [
      'Pelanggaran perjanjian Hudaibiyah oleh sekutu Quraisy memicu pergerakan 10.000 pasukan muslimin menuju Makkah di bulan Ramadhan 8 H.',
      'Nabi ﷺ memasuki kota kelahirannya bukan sebagai penakluk yang sombong, melainkan menundukkan kepala hingga ujung janggutnya hampir menyentuh pelana untanya karena rasa syukur dan tawadhu\' kepada Allah.',
      'Beliau menyucikan Ka\'bah dengan merobohkan 360 berhala sambil melantunkan: "Kebenaran telah datang dan kebatilan telah lenyap." Kepada penduduk Makkah yang dahulu menyiksanya, beliau bersabda: "Pergilah kalian, pada hari ini kalian semua bebas!"'
    ],
    verseRefs: [
      {
        surah: 'QS. Al-Isra\' : 81',
        text: 'وَقُلْ جَآءَ ٱلْحَقُّ وَزَهَقَ ٱلْبَـٰطِلُ ۚ إِنَّ ٱلْبَـٰطِلَ كَانَ زَهُوقًا',
        translation: 'Dan katakanlah: "Kebenaran telah datang dan yang batil telah lenyap." Sesungguhnya yang batil itu adalah sesuatu yang pasti lenyap.'
      },
      {
        surah: 'QS. An-Nasr : 1-2',
        text: 'إِذَا جَآءَ نَصْرُ ٱللَّهِ وَٱلْفَتْحُ . وَرَأَيْتَ ٱلنَّاسَ يَدْخُلُونَ فِى دِينِ ٱللَّهِ أَفْوَاجًا',
        translation: 'Apabila telah datang pertolongan Allah dan kemenangan, dan engkau melihat manusia berbondong-bondong masuk agama Allah...'
      }
    ],
    lessons: [
      'Pemaafan di saat memiliki kekuasaan penuh untuk membalas dendam adalah puncak keluhuran akhlak kenabian.',
      'Kemenangan sejati mengantarkan seorang hamba pada ketundukan, dzikir, dan istighfar, bukan keangkuhan.'
    ]
  },
  {
    id: 'haji-wada',
    order: 16,
    phase: 'madinah',
    title: 'Haji Wada\' (Haji Perpisahan) & Turunnya Ayat Penyempurna Agama',
    arabicTitle: 'حَجَّةُ الْوَدَاعِ وَتَمَامُ الدِّينِ',
    yearMasehi: '632 M',
    yearHijri: 'Dzulhijjah 10 H',
    age: '62 Tahun',
    location: 'Padang Arafah & Mina, Makkah',
    summary:
      'Haji pertama dan terakhir Rasulullah ﷺ bersama lebih dari 100.000 jamaah. Menyampaikan khutbah perpisahan agung tentang hak asasi, persaudaraan, dan penyempurnaan risalah.',
    content: [
      'Pada Dzulhijjah 10 H, Nabi memimpin ibadah haji yang diikuti lebih dari 100.000 sahabat dari seantero jazirah Arab untuk mengajarkan manasik haji yang shahih.',
      'Di Padang Arafah, beliau menyampaikan khutbah Wada\' bersejarah: mengharamkan penumpahan darah, merampas harta, menghapuskan riba jahiliyah, memerintahkan pemuliaan terhadap kaum wanita, dan menegaskan kesetaraan manusia tanpa memandang suku atau warna kulit.',
      'Saat itu turun firman Allah yang menyempurnakan agama Islam (QS. Al-Ma\'idah: 3). Beliau memandang ke langit dan berseru: "Ya Allah, bukankah telah kusampaikan?" Seluruh jamaah menjawab serempak: "Benar, engkau telah menyampaikannya!" Beliau menimpali: "Ya Allah, saksikanlah!"'
    ],
    verseRefs: [
      {
        surah: 'QS. Al-Ma\'idah : 3',
        text: 'ٱلْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ وَأَتْمَمْتُ عَلَيْكُمْ نِعْمَتِى وَرَضِيتُ لَكُمُ ٱلْإِسْلَـٰمَ دِينًا',
        translation: 'Pada hari ini telah Kusempurnakan untuk kamu agamamu, dan telah Kucukupkan kepadamu nikmat-Ku, dan telah Kuridhai Islam itu jadi agama bagimu.'
      }
    ],
    lessons: [
      'Agama Islam telah paripurna; tidak boleh ditambah-tambah atau dikurangi.',
      'Khutbah Wada\' adalah deklarasi hak asasi manusia dan persaudaraan universal terlengkap dalam sejarah peradaban.'
    ]
  },
  {
    id: 'wafat-rasulullah',
    order: 17,
    phase: 'madinah',
    title: 'Detik-Detik Wafatnya Rasulullah ﷺ & Warisan Abadi',
    arabicTitle: 'وَفَاةُ خَيْرِ الأَنَامِ ﷺ وَالْمِيرَاثُ الْخَالِدُ',
    yearMasehi: '632 M',
    yearHijri: 'Senin, 12 Rabi\'ul Awwal 11 H',
    age: '63 Tahun',
    location: 'Kamar Aisyah RA, Masjid Nabawi, Madinah',
    summary:
      'Wafatnya manusia teragung, penutup para nabi dan rasul. Wafat di pangkuan Aisyah RA dengan wasiat menjaga sholat dan warisan abadi Al-Qur\'an serta Sunnah.',
    content: [
      'Menjelang akhir hayatnya, Nabi ﷺ mengalami demam tinggi. Beliau meminta izin istri-istrinya untuk dirawat di kamar Aisyah RA dan menunjuk Abu Bakar Ash-Shiddiq mengimami sholat menggantikan beliau.',
      'Wasiat terakhir yang diulang-ulang beliau sebelum menghembuskan nafas terakhir adalah: "Jagalah sholat! Jagalah sholat! Dan bertakwalah kepada Allah terhadap orang-orang yang kamu pimpin (hamba sahaya)."',
      'Pada hari Senin, 12 Rabi\'ul Awwal 11 H di waktu dhuha, beliau bersiwak lalu mengangkat telunjuknya ke langit seraya berbisik: "Bal ar-Rafiiqal A\'laa" (Bahkan aku memilih Sahabat Tertinggi di Surga). Beliau pun wafat dengan tenang.',
      'Abu Bakar menenangkan kepanikan para sahabat dengan ucapan masyhur: "Barangsiapa menyembah Muhammad, sungguh Muhammad telah wafat. Dan barangsiapa menyembah Allah, sesungguhnya Allah Mahahidup dan tidak akan pernah mati."'
    ],
    verseRefs: [
      {
        surah: 'QS. Ali \'Imran : 144',
        text: 'وَمَا مُحَمَّدٌ إِلَّا رَسُولٌ قَدْ خَلَتْ مِن قَبْلِهِ ٱلرُّسُلُ ۚ أَفَإِي۟ن مَّاتَ أَوْ قُتِلَ ٱنقَلَبْتُمْ عَلَىٰٓ أَعْقَـٰبِكُمْ',
        translation: 'Muhammad itu tidak lain hanyalah seorang rasul, sungguh telah berlalu sebelumnya beberapa orang rasul. Apakah jika dia wafat atau dibunuh kamu berbalik ke belakang (murtad)?'
      }
    ],
    hadithRefs: [
      {
        source: 'HR. Malik (Al-Muwaththa\') & Hakim',
        text: 'Rasulullah ﷺ bersabda: "Aku tinggalkan kepada kalian dua perkara yang kalian tidak akan tersesat selama berpegang teguh kepada keduanya: Kitabullah (Al-Qur\'an) dan Sunnah Nabi-Nya."'
      }
    ],
    lessons: [
      'Nabi Muhammad ﷺ adalah manusia biasa yang fana, namun risalah tauhid yang dibawanya abadi hingga akhir zaman.',
      'Wasiat terbesar beliau adalah menjaga sholat lima waktu serta berpegang teguh pada Al-Qur\'an dan Sunnah agar tidak tersesat.'
    ]
  }
];
