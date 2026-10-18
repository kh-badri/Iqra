import fs from 'node:fs';
import path from 'node:path';

const levels = [
  {
    level: 1,
    title: 'Makharijul Huruf & Sifat Huruf',
    arabicTitle: 'مخارج الحروف وصفاتها',
    description: 'Mengenal tempat keluarnya huruf hijaiyah dari rongga mulut hingga tenggorokan serta karakteristik sifat suara setiap huruf.',
    icon: 'volume-2',
    color: 'primary',
    lessonSlugs: [
      'pengantar-makharijul-huruf',
      'makhraj-halq-dan-syafatain',
      'makhraj-al-lisan',
      'sifat-huruf-dasar'
    ]
  },
  {
    level: 2,
    title: 'Hukum Nun Sukun & Tanwin',
    arabicTitle: 'أحكام النون الساكنة والتنوين',
    description: 'Kaidah mendasar membaca nun mati dan tanwin: Izhar, Idgham Bighunnah, Idgham Bilaghunnah, Iqlab, dan Ikhfa Haqiqi.',
    icon: 'book-open',
    color: 'success',
    lessonSlugs: [
      'izhar-halqi',
      'idgham-bighunnah',
      'idgham-bilaghunnah',
      'iqlab',
      'ikhfa-haqiqi'
    ]
  },
  {
    level: 3,
    title: 'Hukum Mim Sukun',
    arabicTitle: 'أحكام الميم الساكنة',
    description: 'Kaidah membaca mim sukun yang bertemu huruf hijaiyah: Ikhfa Syafawi, Idgham Mimi, dan Izhar Syafawi.',
    icon: 'layers',
    color: 'warning',
    lessonSlugs: [
      'ikhfa-syafawi',
      'idgham-mimi',
      'izhar-syafawi'
    ]
  },
  {
    level: 4,
    title: 'Hukum Mad (Panjang Suara)',
    arabicTitle: 'أحكام المد والقصر',
    description: 'Kaidah memanjangkan bacaan dari 2 hingga 6 harakat: Mad Asli (Thabi\'i), Muttashil, Munfashil, \'Aridh Lissukun, Lin, hingga Mad Lazim.',
    icon: 'maximize-2',
    color: 'accent',
    lessonSlugs: [
      'mad-thabii',
      'mad-wajib-muttashil',
      'mad-jaiz-munfashil',
      'mad-aridh-lissukun-dan-lin',
      'mad-lazim',
      'mad-badal-dan-iwadh'
    ]
  },
  {
    level: 5,
    title: 'Qalqalah, Ghunnah, & Tanda Waqaf',
    arabicTitle: 'القلقلة والوقف والابتداء',
    description: 'Kaidah pantulan huruf qalqalah, dengung tasydid, ketebalan lafaz Allah & Ra, serta panduan berhenti (waqaf) standar Mushaf Kemenag RI.',
    icon: 'check-circle-2',
    color: 'danger',
    lessonSlugs: [
      'hukum-qalqalah',
      'ghunnah-musyaddadah',
      'hukum-lam-jalalah-dan-ra',
      'tanda-waqaf-dan-ibtida'
    ]
  }
];

const lessons = [
  // --- LEVEL 1 ---
  {
    slug: 'pengantar-makharijul-huruf',
    level: 1,
    title: 'Pengantar Makharijul Huruf',
    arabicTitle: 'مخارج الحروف العامة',
    category: 'Makharijul Huruf',
    ruleId: 'makhraj',
    colorToken: 'primary',
    summary: 'Mengenal 5 tempat keluar huruf hijaiyah secara umum (Al-Jauf, Al-Halq, Al-Lisan, Asy-Syafatain, dan Al-Khaisyum).',
    description: 'Makharijul Huruf secara bahasa berarti tempat-tempat keluarnya huruf. Mengetahui makhraj huruf sangat penting agar setiap huruf hijaiyah terucap dengan tepat tanpa tertukar dengan huruf lain yang bunyinya serupa.',
    letters: ['Al-Jauf', 'Al-Halq', 'Al-Lisan', 'Asy-Syafatain', 'Al-Khaisyum'],
    rules: [
      { name: 'Al-Jauf (الْجَوْف)', description: 'Rongga mulut dan rongga tenggorokan terbuka. Tempat keluarnya huruf mad (Alif, Wau sukun, Ya sukun).' },
      { name: 'Al-Halq (الْحَلْق)', description: 'Tenggorokan, terbagi menjadi pangkal, tengah, dan ujung tenggorokan (ء، هـ، ع، ح، غ، خ).' },
      { name: 'Al-Lisan (اللِّسَان)', description: 'Lidah, tempat keluar bagi 18 huruf hijaiyah (terbagi menjadi 10 makhraj khusus).' },
      { name: 'Asy-Syafatain (الشَّفَتَيْن)', description: 'Dua bibir, tempat keluar huruf Fa, Wau, Ba, dan Mim (ف، و، ب، م).' },
      { name: 'Al-Khaisyum (الْخَيْشُوم)', description: 'Pangkal hidung, tempat mengalirnya suara dengung (ghunnah).' }
    ],
    examples: [
      {
        surahNumber: 1,
        surahName: 'Al-Fatihah',
        ayahNumber: 1,
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
        ruleName: 'Asy-Syafatain (Ba & Mim) dan Al-Halq (Ha)',
        note: 'Huruf Ba dan Mim keluar dari kedua bibir (Asy-Syafatain), sedangkan Ha pada Ar-Rahman keluar dari tengah tenggorokan (Al-Halq).',
        segments: [
          { text: 'بِـ', isHighlighted: true, ruleId: 'syafatain' },
          { text: 'ـسْـ', isHighlighted: false },
          { text: 'ـمِ اللَّهِ الرَّ', isHighlighted: false },
          { text: 'حْـ', isHighlighted: true, ruleId: 'halq' },
          { text: 'ـمَٰنِ الرَّحِيمِ', isHighlighted: false }
        ]
      }
    ],
    tips: [
      'Untuk mengetahui makhraj suatu huruf, matikan huruf tersebut (beri sukun atau tasydid) lalu dahului dengan hamzah berharakat (misal: أَحْ atau أَبْ).',
      'Suara huruf berhenti tepat pada titik makhrajnya bergetar atau terkatup.'
    ],
    commonMistakes: [
      'Mencampuradukkan bunyi huruf yang makhrajnya berdekatan seperti Ta (ت) dengan Tha (ث) atau Ha (ح) dengan Kha (خ).'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Ada berapa makhraj umum (makharrijul huruf \'ammah) dalam qiraat standar?',
        options: ['3 tempat', '5 tempat', '7 tempat', '17 tempat'],
        answerIndex: 1,
        explanation: 'Ada 5 makhraj umum: Al-Jauf (rongga mulut), Al-Halq (tenggorokan), Al-Lisan (lidah), Asy-Syafatain (dua bibir), dan Al-Khaisyum (rongga hidung).'
      },
      {
        id: 'q2',
        question: 'Tempat keluarnya suara dengung (ghunnah) bersumber dari bagian...',
        options: ['Al-Lisan (Lidah)', 'Al-Halq (Tenggorokan)', 'Al-Khaisyum (Pangkal Hidung)', 'Asy-Syafatain (Dua Bibir)'],
        answerIndex: 2,
        explanation: 'Al-Khaisyum (rongga/pangkal hidung) adalah tempat khusus mengalirnya bunyi dengung (ghunnah).'
      },
      {
        id: 'q3',
        question: 'Huruf-huruf Mad (Alif, Wau sukun, Ya sukun) keluar dari makhraj...',
        options: ['Al-Jauf', 'Al-Halq', 'Al-Lisan', 'Asy-Syafatain'],
        answerIndex: 0,
        explanation: 'Al-Jauf adalah rongga udara di mulut dan tenggorokan tempat keluarnya huruf mad tanpa terhalang katupan alat ucap.'
      }
    ]
  },
  {
    slug: 'makhraj-halq-dan-syafatain',
    level: 1,
    title: 'Makhraj Al-Halq & Asy-Syafatain',
    arabicTitle: 'مخارج الحلق والشفتين',
    category: 'Makharijul Huruf',
    ruleId: 'halq',
    colorToken: 'primary',
    summary: 'Mempelajari 6 huruf tenggorokan (Al-Halq) dan 4 huruf dua bibir (Asy-Syafatain).',
    description: 'Al-Halq terbagi menjadi 3 bagian: pangkal tenggorokan (Aqshal Halq), tengah tenggorokan (Wasathul Halq), dan ujung tenggorokan (Adnal Halq). Sedangkan Asy-Syafatain mencakup huruf yang terucap dari kedua bibir atau bibir dengan gigi seri atas.',
    letters: ['ء', 'هـ', 'ع', 'ح', 'غ', 'خ', 'ف', 'و', 'ب', 'م'],
    rules: [
      { name: 'Aqshal Halq (Pangkal Tenggorokan)', description: 'Huruf Hamzah (ء) dan Ha (هـ), berada di pita suara paling bawah dekat dada.' },
      { name: 'Wasathul Halq (Tengah Tenggorokan)', description: 'Huruf \'Ain (ع) dan Ha (ح), berada di daerah katup epiglotis.' },
      { name: 'Adnal Halq (Ujung Tenggorokan)', description: 'Huruf Ghain (غ) dan Kha (خ), berada di dekat anak lidah/pangkal mulut.' },
      { name: 'Bibir Bawah & Gigi Seri Atas', description: 'Huruf Fa (ف), tepi bibir bawah bagian dalam menyentuh ujung gigi seri atas.' },
      { name: 'Kedua Bibir (Merapat / Membulat)', description: 'Huruf Ba (ب) merapat kuat, Mim (م) merapat dengan dengung hidung, dan Wau (و) membulatkan kedua bibir.' }
    ],
    examples: [
      {
        surahNumber: 112,
        surahName: 'Al-Ikhlas',
        ayahNumber: 1,
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        translation: 'Katakanlah (Muhammad): "Dialah Allah, Yang Maha Esa."',
        ruleName: 'Huruf Ha (هـ), Hamzah (أ), dan Ha (ح)',
        note: 'Ha (هُوَ) keluar dari pangkal tenggorokan, Hamzah (أَ) dari pangkal tenggorokan, dan Ha (حَدٌ) dari tengah tenggorokan.',
        segments: [
          { text: 'قُلْ ', isHighlighted: false },
          { text: 'هُـ', isHighlighted: true, ruleId: 'halq' },
          { text: 'ـوَ اللَّهُ ', isHighlighted: false },
          { text: 'أَ', isHighlighted: true, ruleId: 'halq' },
          { text: 'حَـ', isHighlighted: true, ruleId: 'halq' },
          { text: 'ـدٌ', isHighlighted: false }
        ]
      }
    ],
    tips: [
      'Latih perbedaan huruf Ha pedas (ح) di tengah tenggorokan yang bersih dengan Ha dada (هـ) di pangkal tenggorokan.',
      'Huruf Kha (خ) memiliki sifat mendengkur halus tanpa gesekan kasar di langit-langit mulut.'
    ],
    commonMistakes: [
      'Membaca huruf \'Ain (ع) seperti Hamzah (ء) atau hidung bindeng.',
      'Membaca huruf Fa (ف) dengan menempelkan kedua bibir seperti huruf P.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Huruf yang keluar dari tengah tenggorokan (Wasathul Halq) adalah...',
        options: ['ء dan هـ', 'ع dan ح', 'غ dan خ', 'ق dan ك'],
        answerIndex: 1,
        explanation: 'Wasathul Halq (tengah tenggorokan) adalah makhraj bagi huruf \'Ain (ع) dan Ha pedas (ح).'
      },
      {
        id: 'q2',
        question: 'Huruf Fa (ف) keluar melalui pertemuan antara...',
        options: ['Kedua bibir yang merapat', 'Bibir bawah bagian dalam dengan ujung dua gigi seri atas', 'Pangkal lidah dengan langit-langit lunak', 'Ujung lidah dengan gusi'],
        answerIndex: 1,
        explanation: 'Makhraj Fa (ف) adalah perut/tepi dalam bibir bawah yang bersentuhan dengan ujung dua gigi seri atas.'
      }
    ]
  },
  {
    slug: 'makhraj-al-lisan',
    level: 1,
    title: 'Makhraj Al-Lisan (Lidah)',
    arabicTitle: 'مخارج اللسان',
    category: 'Makharijul Huruf',
    ruleId: 'lisan',
    colorToken: 'primary',
    summary: 'Mempelajari 18 huruf hijaiyah yang keluar dari pangkal, tengah, tepi, dan ujung lidah.',
    description: 'Lidah (Al-Lisan) merupakan organ ucap terbesar dalam huruf hijaiyah yang melahirkan 18 huruf. Pembagiannya meliputi Pangkal Lidah (Qaf, Kaf), Tengah Lidah (Jim, Syin, Ya), Tepi Lidah (Dhad, Lam), dan Ujung Lidah (Nun, Ra, Tha, Dal, Ta, Shad, Zay, Sin, Zha, Dzal, Tsa).',
    letters: ['ق', 'ك', 'ج', 'ش', 'ي', 'ض', 'ل', 'ن', 'ر', 'ط', 'د', 'ت', 'ص', 'ز', 'س', 'ظ', 'ذ', 'ث'],
    rules: [
      { name: 'Pangkal Lidah (Aqshal Lisan)', description: 'Qaf (ق) menempel ke langit-langit lunak bagian belakang; Kaf (ك) sedikit di depannya menyentuh langit-langit keras dan lunak.' },
      { name: 'Tengah Lidah (Wasathul Lisan)', description: 'Jim, Syin, dan Ya (ج، ش، ي) menyentuh langit-langit keras di tengah mulut.' },
      { name: 'Tepi Lidah (Hafatal Lisan)', description: 'Dhad (ض) dari salah satu atau kedua tepi lidah ke gigi geraham atas; Lam (ل) dari ujung tepi lidah ke langit-langit atas.' },
      { name: 'Ujung Lidah (Tharaful Lisan)', description: 'Huruf Nun, Ra, Tha, Dal, Ta, Shad, Zay, Sin, Zha, Dzal, dan Tsa.' }
    ],
    examples: [
      {
        surahNumber: 114,
        surahName: 'An-Nas',
        ayahNumber: 4,
        arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        translation: 'Dari kejahatan (bisikan) setan yang bersembunyi.',
        ruleName: 'Huruf Syin (ش), Sin (س), dan Ra (ر)',
        note: 'Syin keluar dari tengah lidah, Sin dari ujung lidah bertemu rongga gigi seri, dan Ra dari punggung ujung lidah ke gusi atas.',
        segments: [
          { text: 'مِن ', isHighlighted: false },
          { text: 'شَـ', isHighlighted: true, ruleId: 'lisan' },
          { text: 'ـرِّ الْوَ', isHighlighted: false },
          { text: 'سْـ', isHighlighted: true, ruleId: 'lisan' },
          { text: 'ـوَا', isHighlighted: false },
          { text: 'سِ', isHighlighted: true, ruleId: 'lisan' }
        ]
      }
    ],
    tips: [
      'Huruf Dhad (ض) adalah huruf teristimewa dalam bahasa Arab (Lughat adh-Dhad); bunyinya bukan huruf Z atau D tebal, melainkan tekanan tepi lidah ke gigi geraham.',
      'Bedakan ujung lidah huruf Tha (ث) yang keluar sedikit di antara gigi seri dengan Sin (س) yang berada di balik gigi seri bawah.'
    ],
    commonMistakes: [
      'Menyentuhkan ujung lidah ke gigi seri saat melafalkan Dhad (seperti huruf Dal tebal).',
      'Mengeluarkan desis angin berlebihan pada huruf Qaf (ق).'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Huruf yang keluar dari pangkal lidah menyentuh langit-langit lunak paling belakang adalah...',
        options: ['Kaf (ك)', 'Qaf (ق)', 'Jim (ج)', 'Dhad (ض)'],
        answerIndex: 1,
        explanation: 'Qaf (ق) keluar dari pangkal lidah yang menempel pada langit-langit lunak (bagian daging) paling belakang dekat anak lidah.'
      },
      {
        id: 'q2',
        question: 'Huruf manakah yang keluar dari tengah lidah bertemu langit-langit bagian tengah?',
        options: ['Jim, Syin, Ya (ج، ش، ي)', 'Qaf dan Kaf (ق، ك)', 'Tha, Dal, Ta (ط، د، ت)', 'Lam, Nun, Ra (ل، ن، ر)'],
        answerIndex: 0,
        explanation: 'Tengah lidah (Wasathul Lisan) adalah makhraj bersama untuk huruf Jim, Syin, dan Ya (ج، ش، ي).'
      }
    ]
  },
  {
    slug: 'sifat-huruf-dasar',
    level: 1,
    title: 'Sifat-Sifat Huruf Dasar',
    arabicTitle: 'صفات الحروف الأساسية',
    category: 'Sifat Huruf',
    ruleId: 'sifat',
    colorToken: 'primary',
    summary: 'Mengenal sifat huruf berpasangan (Hams vs Jahr, Syiddah vs Rakhawah, Isti\'la vs Istifal).',
    description: 'Sifat huruf adalah cara atau karakteristik suara huruf ketika keluar dari makhrajnya. Mengetahui sifat huruf membuat pelafalan huruf menjadi sempurna dan tidak tertukar satu sama lain.',
    letters: ['Hams', 'Jahr', 'Syiddah', 'Rakhawah', 'Isti\'la', 'Istifal'],
    rules: [
      { name: 'Hams (هَمْس) vs Jahr (جَهْر)', description: 'Hams mengalirkan nafas/desis saat pengucapan (10 huruf: فحثه شخص سكت); Jahr tertahannya nafas.' },
      { name: 'Syiddah (شِدَّة) vs Rakhawah (رَخَاوَة)', description: 'Syiddah tertahannya suara karena makhraj tertutup kuat (أجد قط بكت); Rakhawah mengalirnya suara.' },
      { name: 'Isti\'la (اسْتِعْلَاء) vs Istifal (اسْتِفَال)', description: 'Isti\'la pangkal lidah terangkat ke langit-langit hingga suara tebal/tafkhim (خص ضغط قظ); Istifal lidah merendah hingga suara tipis.' }
    ],
    examples: [
      {
        surahNumber: 113,
        surahName: 'Al-Falaq',
        ayahNumber: 2,
        arabic: 'مِن شَرِّ مَا خَلَقَ',
        translation: 'Dari kejahatan (makhluk yang) Dia ciptakan.',
        ruleName: 'Isti\'la pada Kha (خ) dan Qaf (ق)',
        note: 'Kha dan Qaf terangkat pangkal lidahnya sehingga suaranya tebal dan berwibawa.',
        segments: [
          { text: 'مِن شَرِّ مَا ', isHighlighted: false },
          { text: 'خَـ', isHighlighted: true, ruleId: 'istila' },
          { text: 'ـلَـ', isHighlighted: false },
          { text: 'ـقَ', isHighlighted: true, ruleId: 'istila' }
        ]
      }
    ],
    tips: [
      'Ingat rumus huruf Hams: "Fahatstsahu syakhshun sakat" (فَحَثَّهُ شَخْصٌ سَكَتَ).',
      'Huruf Isti\'la selalu dibaca tebal (tafkhim) dalam segala harakat.'
    ],
    commonMistakes: [
      'Menebalkan huruf-huruf tipis (istifal) saat bersebelahan dengan huruf tebal (isti\'la), seperti mengebalkan Ta pada "Taslamun".'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Huruf-huruf Isti\'la (yang dibaca tebal karena pangkal lidah naik) terangkum dalam kalimat...',
        options: ['فحثه شخص سكت', 'خص ضغط قظ', 'أجد قط بكت', 'يرملون'],
        answerIndex: 1,
        explanation: 'Huruf Isti\'la ada 7 terangkum dalam "Khush-sha Dhagh-thin Qizh" (خ، ص، ض، غ، ط، ق، ظ).'
      }
    ]
  },

  // --- LEVEL 2 ---
  {
    slug: 'izhar-halqi',
    level: 2,
    title: 'Hukum Izhar Halqi',
    arabicTitle: 'الإظهار الحلقي',
    category: 'Hukum Nun Sukun & Tanwin',
    ruleId: 'izhar',
    colorToken: 'success',
    summary: 'Membaca nun sukun atau tanwin secara jelas dan tegas tanpa dengung saat bertemu salah satu dari 6 huruf halq.',
    description: 'Secara bahasa, Izhar berarti jelas/terang, dan Halqi berarti tenggorokan. Hukum Izhar Halqi terjadi apabila Nun Sukun (نْ) atau Tanwin (ً ٍ ٌ) bertemu dengan salah satu dari 6 huruf yang keluar dari tenggorokan. Cara membacanya harus jelas, terang, dan tidak berdengung sama sekali.',
    letters: ['ء (Hamzah)', 'هـ (Ha)', 'ع (\'Ain)', 'ح (Ha)', 'غ (Ghain)', 'خ (Kha)'],
    rules: [
      { name: 'Kaidah Bacaan', description: 'Bunyi nun sukun atau tanwin diucapkan tepat dari makhrajnya (ujung lidah) dengan terang dan bersih tanpa ditahan atau didengungkan.' }
    ],
    examples: [
      {
        surahNumber: 112,
        surahName: 'Al-Ikhlas',
        ayahNumber: 4,
        arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        translation: 'Dan tidak ada seorang pun yang setara dengan Dia.',
        ruleName: 'Tanwin bertemu Hamzah (كُفُوًا أَحَدٌ)',
        note: 'Fathatain pada kata كُفُوًا bertemu huruf Hamzah أَ dibaca jelas: "kufuwan ahad".',
        segments: [
          { text: 'وَلَمْ يَكُن لَّهُ ', isHighlighted: false },
          { text: 'كُفُوًا ', isHighlighted: true, ruleId: 'izhar' },
          { text: 'أَحَدٌ', isHighlighted: true, ruleId: 'izhar' }
        ]
      },
      {
        surahNumber: 1,
        surahName: 'Al-Fatihah',
        ayahNumber: 7,
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ',
        translation: 'Yaitu jalan orang-orang yang telah Engkau anugerahkan nikmat kepada mereka.',
        ruleName: 'Nun Sukun bertemu \'Ain (أَنْعَمْتَ)',
        note: 'Nun mati bertemu huruf \'Ain dalam satu kata dibaca tegas "an\'amta".',
        segments: [
          { text: 'صِرَاطَ الَّذِينَ ', isHighlighted: false },
          { text: 'أَنْـ', isHighlighted: true, ruleId: 'izhar' },
          { text: 'ـعَمْتَ عَلَيْهِمْ', isHighlighted: false }
        ]
      }
    ],
    tips: [
      'Jangan menahan bunyi "N" terlalu lama saat Izhar; lepaskan suara dengan wajar tanpa jeda napas (saktah).'
    ],
    commonMistakes: [
      'Mendengungkan bunyi nun sukun pada kata "an\'amta" atau "min khauf".'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Ada berapa huruf Izhar Halqi?',
        options: ['4 huruf', '5 huruf', '6 huruf', '15 huruf'],
        answerIndex: 2,
        explanation: 'Ada 6 huruf Izhar Halqi: Hamzah (ء), Ha (هـ), \'Ain (ع), Ha (ح), Ghain (غ), dan Kha (خ).'
      },
      {
        id: 'q2',
        question: 'Bagaimana cara membaca nun sukun pada bacaan Izhar Halqi?',
        options: ['Dengung panjang 2 harakat', 'Samar-samar', 'Jelas tanpa dengung', 'Dibalik menjadi mim'],
        answerIndex: 2,
        explanation: 'Izhar berarti jelas, sehingga nun sukun diucapkan tegas dan bersih tanpa dengung.'
      }
    ]
  },
  {
    slug: 'idgham-bighunnah',
    level: 2,
    title: 'Hukum Idgham Bighunnah',
    arabicTitle: 'الإدغام بغنة',
    category: 'Hukum Nun Sukun & Tanwin',
    ruleId: 'idgham_bighunnah',
    colorToken: 'warning',
    summary: 'Meleburkan bunyi nun sukun atau tanwin ke huruf berikutnya disertai dengung sempurna sepanjang 2 harakat.',
    description: 'Idgham Bighunnah terjadi apabila Nun Sukun atau Tanwin bertemu dengan salah satu dari 4 huruf: Ya, Nun, Mim, atau Wau (terangkum dalam kata يَنْمُوْ / Yanmu). Bunyi nun sukun atau tanwin dileburkan sepenuhnya ke huruf berikutnya dan ditahan dengan dengung selama 2 harakat. Syaratnya harus terjadi dalam dua kata terpisah.',
    letters: ['ي (Ya)', 'ن (Nun)', 'م (Mim)', 'و (Wau)'],
    rules: [
      { name: 'Kaidah Bacaan', description: 'Masukkan suara nun/tanwin ke huruf berikutnya disertai dengung yang keluar dari pangkal hidung (Al-Khaisyum) selama 2 ketukan.' },
      { name: 'Pengecualian (Izhar Wajib / Mutlaq)', description: 'Jika nun sukun bertemu huruf wau atau ya dalam SATU KATA, maka tidak boleh di-idgham melainkan wajib dibaca izhar. Terdapat pada 4 kata dalam Al-Qur\'an: Dun-ya (دُنْيَا), Bun-yan (بُنْيَانٌ), Qin-wan (قِنْوَانٌ), dan Shin-wan (صِنْوَانٌ).' }
    ],
    examples: [
      {
        surahNumber: 111,
        surahName: 'Al-Lahab',
        ayahNumber: 1,
        arabic: 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ',
        translation: 'Binasalah kedua tangan Abu Lahab dan benar-benar binasa dia!',
        ruleName: 'Kasratain bertemu Wau (لَهَبٍ وَتَبَّ)',
        note: 'Kasratain pada lahabin melebur ke huruf wau dengan dengung 2 harakat: "lahabiww-watabb".',
        segments: [
          { text: 'تَبَّتْ يَدَا أَبِي ', isHighlighted: false },
          { text: 'لَهَبٍ وَ', isHighlighted: true, ruleId: 'idgham_bighunnah' },
          { text: 'ـتَبَّ', isHighlighted: false }
        ]
      },
      {
        surahNumber: 99,
        surahName: 'Az-Zalzalah',
        ayahNumber: 7,
        arabic: 'فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ',
        translation: 'Maka barangsiapa mengerjakan kebaikan seberat zarrah, niscaya dia akan melihat (balasan)nya.',
        ruleName: 'Nun Sukun bertemu Ya (فَمَن يَعْمَلْ)',
        note: 'Nun sukun bertemu ya dibaca melebur: "famayy-ya\'mal" dengan dengung lembut.',
        segments: [
          { text: 'فَـ', isHighlighted: false },
          { text: 'ـمَن يَّـ', isHighlighted: true, ruleId: 'idgham_bighunnah' },
          { text: 'ـعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ', isHighlighted: false }
        ]
      }
    ],
    tips: [
      'Pastikan suara dengung mengalir lewat hidung; jika hidung dipencet saat melafalkan dengung, suaranya akan terhenti.',
      'Tahan selama 2 harakat penuh agar hak ghunnah tertunaikan.'
    ],
    commonMistakes: [
      'Membaca Idgham tanpa dengung (terburu-buru).',
      'Membaca kata "Ad-Dunya" dengan idgham (yang benar adalah izhar mutlaq).'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Huruf-huruf Idgham Bighunnah terangkum dalam kata...',
        options: ['Yanmu (يَنْمُوْ)', 'Yarmalun (يَرْمَلُوْنَ)', 'Halqi', 'Quthbu Jadin'],
        answerIndex: 0,
        explanation: 'Huruf Idgham Bighunnah ada 4: Ya, Nun, Mim, Wau (Yanmu).'
      },
      {
        id: 'q2',
        question: 'Pada kata "الدُّنْيَا" (Ad-Dunya), nun sukun bertemu ya dibaca...',
        options: ['Idgham Bighunnah', 'Izhar Wajib / Mutlaq', 'Ikhfa Haqiqi', 'Iqlab'],
        answerIndex: 1,
        explanation: 'Karena berada dalam SATU kata, hukumnya adalah Izhar Wajib (Izhar Mutlaq), dibaca jelas "ad-dunya" bukan "ad-duyya".'
      }
    ]
  },
  {
    slug: 'idgham-bilaghunnah',
    level: 2,
    title: 'Hukum Idgham Bilaghunnah',
    arabicTitle: 'الإدغام بغير غنة',
    category: 'Hukum Nun Sukun & Tanwin',
    ruleId: 'idgham_bilaghunnah',
    colorToken: 'warning',
    summary: 'Meleburkan nun sukun atau tanwin sepenuhnya ke dalam huruf Lam atau Ra tanpa dengung.',
    description: 'Idgham Bilaghunnah berarti memasukkan/meleburkan tanpa dengung. Hukum ini terjadi jika Nun Sukun atau Tanwin bertemu dengan huruf Lam (ل) atau Ra (ر). Bunyi nun/tanwin hilang sepenuhnya dan huruf Lam atau Ra dibaca bertasydid murni tanpa ada dengungan hidung.',
    letters: ['ل (Lam)', 'ر (Ra)'],
    rules: [
      { name: 'Kaidah Bacaan', description: 'Pindahkan makhraj secara langsung ke huruf Lam atau Ra dengan tasydid sempurna tanpa menahan dengung.' }
    ],
    examples: [
      {
        surahNumber: 112,
        surahName: 'Al-Ikhlas',
        ayahNumber: 4,
        arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        translation: 'Dan tidak ada seorang pun yang setara dengan Dia.',
        ruleName: 'Nun Sukun bertemu Lam (يَكُن لَّهُ)',
        note: 'Nun sukun melebur langsung ke Lam tanpa dengung: "yakullahu".',
        segments: [
          { text: 'وَلَمْ ', isHighlighted: false },
          { text: 'يَكُن لَّـ', isHighlighted: true, ruleId: 'idgham_bilaghunnah' },
          { text: 'ـهُ كُفُوًا أَحَدٌ', isHighlighted: false }
        ]
      },
      {
        surahNumber: 104,
        surahName: 'Al-Humazah',
        ayahNumber: 1,
        arabic: 'وَيْلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ',
        translation: 'Celakalah bagi setiap pengumpat dan pencela.',
        ruleName: 'Dhammatain bertemu Lam (وَيْلٌ لِّكُلِّ)',
        note: 'Dhammatain pada wailun langsung melebur ke Lam: "waillul-likulli".',
        segments: [
          { text: 'وَيْلٌ لِّـ', isHighlighted: true, ruleId: 'idgham_bilaghunnah' },
          { text: 'ـكُلِّ هُمَزَةٍ لُّمَزَةٍ', isHighlighted: false }
        ]
      }
    ],
    tips: [
      'Jangan menahan suara seperti pada idgham bighunnah. Langsung tekan huruf Lam atau Ra dengan mantap.'
    ],
    commonMistakes: [
      'Mendengungkan bunyi saat masuk ke huruf Ra atau Lam.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Huruf Idgham Bilaghunnah terdiri dari huruf...',
        options: ['Lam dan Ra (ل dan ر)', 'Mim dan Nun (م dan ن)', 'Wau dan Ya (و dan ي)', 'Ba dan Mim (ب dan م)'],
        answerIndex: 0,
        explanation: 'Hanya ada 2 huruf Idgham Bilaghunnah: Lam (ل) dan Ra (ر).'
      }
    ]
  },
  {
    slug: 'iqlab',
    level: 2,
    title: 'Hukum Iqlab',
    arabicTitle: 'الإقلاب',
    category: 'Hukum Nun Sukun & Tanwin',
    ruleId: 'iqlab',
    colorToken: 'accent',
    summary: 'Mengubah bunyi nun sukun atau tanwin menjadi bunyi Mim sukun tersembunyi disertai dengung saat bertemu huruf Ba.',
    description: 'Secara bahasa, Iqlab artinya membalik atau mengubah. Dalam tajwid, Iqlab adalah mengubah bunyi Nun Sukun atau Tanwin menjadi bunyi Mim (م) yang disamarkan dengan dengung 2 harakat ketika bertemu dengan huruf Ba (ب). Dalam mushaf standar, biasanya ditandai dengan huruf mim kecil (مـ) di atas nun atau tanwin.',
    letters: ['ب (Ba)'],
    rules: [
      { name: 'Kaidah Bacaan', description: 'Ganti bunyi N dengan M samar, bibir tidak dirapatkan terlalu kencang (ada sedikit renggang atau sentuhan lembut), lalu tahan dengung 2 harakat sebelum melafalkan Ba.' }
    ],
    examples: [
      {
        surahNumber: 96,
        surahName: 'Al-\'Alaq',
        ayahNumber: 15,
        arabic: 'كَلَّا لَئِن لَّمْ يَنتَهِ لَنَسْفَعًا بِالنَّاصِيَةِ',
        translation: 'Ketahuilah, sungguh jika dia tidak berhenti niscaya Kami tarik ubun-ubunnya.',
        ruleName: 'Tanwin bertemu Ba (لَنَسْفَعًا بِالنَّاصِيَةِ)',
        note: 'Fathatain bertemu Ba dibaca "lanasfa\'am-bin-nashiyah" dengan dengung mim.',
        segments: [
          { text: 'كَلَّا لَئِن لَّمْ يَنتَهِ ', isHighlighted: false },
          { text: 'لَنَسْفَعًا بِـ', isHighlighted: true, ruleId: 'iqlab' },
          { text: 'ـالنَّاصِيَةِ', isHighlighted: false }
        ]
      },
      {
        surahNumber: 2,
        surahName: 'Al-Baqarah',
        ayahNumber: 18,
        arabic: 'صُمٌّ بُكْمٌ عُمْيٌ فَهُمْ لَا يَرْجِعُونَ',
        translation: 'Mereka tuli, bisu dan buta, maka tidaklah mereka akan kembali.',
        ruleName: 'Dhammatain bertemu Ba (صُمٌّ بُكْمٌ)',
        note: 'Dhammatain bertemu huruf Ba dibaca "shummum-bukmun".',
        segments: [
          { text: 'صُمٌّ بُـ', isHighlighted: true, ruleId: 'iqlab' },
          { text: 'ـكْمٌ عُمْيٌ فَهُمْ لَا يَرْجِعُونَ', isHighlighted: false }
        ]
      }
    ],
    tips: [
      'Pertahankan dengung 2 harakat agar perpindahan ke huruf Ba terdengar lembut dan tidak terburu-buru.'
    ],
    commonMistakes: [
      'Menekan kedua bibir terlalu kuat dan kaku sehingga suara terdengar kasar.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Berapa jumlah huruf hukum Iqlab?',
        options: ['1 huruf (Ba)', '2 huruf (Ba dan Mim)', '4 huruf', '6 huruf'],
        answerIndex: 0,
        explanation: 'Hukum Iqlab hanya memiliki 1 huruf, yaitu Ba (ب).'
      }
    ]
  },
  {
    slug: 'ikhfa-haqiqi',
    level: 2,
    title: 'Hukum Ikhfa Haqiqi',
    arabicTitle: 'الإخفاء الحقيقي',
    category: 'Hukum Nun Sukun & Tanwin',
    ruleId: 'ikhfa',
    colorToken: 'primary',
    summary: 'Menyamarkan bacaan nun sukun atau tanwin antara izhar dan idgham disertai dengung saat bertemu 15 huruf ikhfa.',
    description: 'Secara bahasa Ikhfa artinya menyamarkan/menyembunyikan. Secara istilah, membaca nun sukun atau tanwin dengan sifat antara Izhar dan Idgham, tanpa tasydid, disertai dengung (ghunnah) 2 harakat pada huruf berikutnya. Huruf ikhfa ada 15 huruf.',
    letters: ['ت', 'ث', 'ج', 'د', 'ذ', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ف', 'ق', 'ك'],
    rules: [
      { name: 'Kaidah Bacaan', description: 'Ketika melafalkan nun sukun/tanwin, lidah sudah bersiap menuju ke makhraj huruf berikutnya seraya mengalirkan dengung lewat hidung.' },
      { name: 'Tebal & Tipisnya Ikhfa', description: 'Jika huruf berikutnya huruf tebal (Isti\'la: ص، ض، ط، ظ، ق), dengung ikhfa ikut tebal (Tafkhim). Jika huruf tipis, dengung ikut tipis (Tarqiq).' }
    ],
    examples: [
      {
        surahNumber: 113,
        surahName: 'Al-Falaq',
        ayahNumber: 2,
        arabic: 'مِن شَرِّ مَا خَلَقَ',
        translation: 'Dari kejahatan (makhluk yang) Dia ciptakan.',
        ruleName: 'Nun Sukun bertemu Syin (مِن شَرِّ)',
        note: 'Nun sukun bertemu huruf Syin disamarkan dengan dengung tipis: "ming-syarri".',
        segments: [
          { text: 'مِن شَـ', isHighlighted: true, ruleId: 'ikhfa' },
          { text: 'ـرِّ مَا خَلَقَ', isHighlighted: false }
        ]
      },
      {
        surahNumber: 114,
        surahName: 'An-Nas',
        ayahNumber: 4,
        arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        translation: 'Dari kejahatan bisikan (setan) yang bersembunyi.',
        ruleName: 'Ikhfa pada Syin',
        note: 'Dengung 2 harakat dengan posisi mulut menuju makhraj Syin.',
        segments: [
          { text: 'مِن شَـ', isHighlighted: true, ruleId: 'ikhfa' },
          { text: 'ـرِّ الْوَسْوَاسِ الْخَنَّاسِ', isHighlighted: false }
        ]
      }
    ],
    tips: [
      'Jangan membunyikan "NG" bahasa Indonesia murni untuk semua huruf ikhfa; arahkan lidah mendekati makhraj huruf sesudahnya.'
    ],
    commonMistakes: [
      'Menempelkan ujung lidah ke gusi atas sehingga bunyi nun menjadi jelas (izhar) padahal seharusnya samar.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Berapa jumlah huruf Ikhfa Haqiqi?',
        options: ['6 huruf', '12 huruf', '14 huruf', '15 huruf'],
        answerIndex: 3,
        explanation: 'Ada 15 huruf Ikhfa Haqiqi (ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك).'
      }
    ]
  },

  // --- LEVEL 3 ---
  {
    slug: 'ikhfa-syafawi',
    level: 3,
    title: 'Hukum Ikhfa Syafawi',
    arabicTitle: 'الإخفاء الشفوي',
    category: 'Hukum Mim Sukun',
    ruleId: 'ikhfa',
    colorToken: 'primary',
    summary: 'Menyamarkan bacaan mim sukun disertai dengung 2 harakat saat bertemu huruf Ba.',
    description: 'Ikhfa Syafawi terjadi bila Mim Sukun (مْ) bertemu dengan huruf Ba (ب). Disebut Syafawi karena makhraj kedua huruf tersebut berasal dari dua bibir (Asy-Syafatain). Cara membacanya adalah menyamarkan bunyi mim sukun di bibir disertai dengung 2 ketukan sebelum masuk ke huruf Ba.',
    letters: ['ب (Ba)'],
    rules: [
      { name: 'Kaidah Bacaan', description: 'Rapatkan dua bibir dengan lembut (tanpa tekanan keras) saat melafalkan mim sukun, tahan dengung 2 harakat, lalu buka ke huruf Ba.' }
    ],
    examples: [
      {
        surahNumber: 105,
        surahName: 'Al-Fil',
        ayahNumber: 4,
        arabic: 'تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ',
        translation: 'Yang melempari mereka dengan batu dari tanah liat yang dibakar.',
        ruleName: 'Mim Sukun bertemu Ba (تَرْمِيهِم بِحِجَارَةٍ)',
        note: 'Mim sukun pada tarmihim bertemu huruf Ba dibaca samar dan berdengung: "tarmihim-bihijarah".',
        segments: [
          { text: 'تَرْمِيهِـ', isHighlighted: false },
          { text: 'ـم بِـ', isHighlighted: true, ruleId: 'ikhfa' },
          { text: 'ـحِجَارَةٍ مِّن سِجِّيلٍ', isHighlighted: false }
        ]
      }
    ],
    tips: [
      'Pastikan bibir tidak membuka terlalu lebar dan tidak menekan terlalu kaku.'
    ],
    commonMistakes: [
      'Membaca mim sukun secara izhar (terlalu tegas) atau tanpa dengung sama sekali.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Huruf Ikhfa Syafawi adalah...',
        options: ['Huruf Ba (ب)', 'Huruf Mim (م)', 'Huruf Waw (و)', '15 huruf hijaiyah'],
        answerIndex: 0,
        explanation: 'Ikhfa Syafawi hanya memiliki 1 huruf, yaitu Ba (ب).'
      }
    ]
  },
  {
    slug: 'idgham-mimi',
    level: 3,
    title: 'Hukum Idgham Mimi (Mutamatsilain)',
    arabicTitle: 'إدغام المتماثلين / الميمي',
    category: 'Hukum Mim Sukun',
    ruleId: 'idgham_bighunnah',
    colorToken: 'warning',
    summary: 'Meleburkan mim sukun ke dalam huruf mim berikutnya dengan dengung sempurna 2 harakat.',
    description: 'Idgham Mimi (disebut juga Idgham Mutamatsilain Shaghir) terjadi apabila Mim Sukun (مْ) bertemu dengan huruf Mim (م). Mim pertama dileburkan sepenuhnya ke dalam mim kedua sehingga menjadi satu mim bertasydid disertai dengung (ghunnah) 2 harakat.',
    letters: ['م (Mim)'],
    rules: [
      { name: 'Kaidah Bacaan', description: 'Kedua bibir terkatup rapat, suara dengung keluar dari rongga hidung selama 2 ketukan penuh.' }
    ],
    examples: [
      {
        surahNumber: 106,
        surahName: 'Quraisy',
        ayahNumber: 4,
        arabic: 'الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ',
        translation: 'Yang telah memberi makanan kepada mereka untuk menghilangkan lapar dan mengamankan mereka dari rasa takut.',
        ruleName: 'Mim Sukun bertemu Mim (أَطْعَمَهُم مِّن)',
        note: 'Mim sukun melebur sempurna ke huruf mim berharakat kasrah dengan dengung mantap.',
        segments: [
          { text: 'الَّذِي أَطْعَمَهُـ', isHighlighted: false },
          { text: 'ـم مِّـ', isHighlighted: true, ruleId: 'idgham_bighunnah' },
          { text: 'ـن جُوعٍ', isHighlighted: false }
        ]
      }
    ],
    tips: [
      'Jangan terburu-buru melepaskan bibir; tahan dengung mim selama 2 harakat.'
    ],
    commonMistakes: [
      'Membaca mim sukun membal (qalqalah) saat hendak menyambung ke mim berikutnya.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Hukum Idgham Mimi terjadi apabila mim sukun bertemu dengan huruf...',
        options: ['Ba (ب)', 'Mim (م)', 'Wau (و)', 'Nun (ن)'],
        answerIndex: 1,
        explanation: 'Idgham Mimi terjadi bila Mim Sukun bertemu dengan sesama huruf Mim.'
      }
    ]
  },
  {
    slug: 'izhar-syafawi',
    level: 3,
    title: 'Hukum Izhar Syafawi',
    arabicTitle: 'الإظهار الشفوي',
    category: 'Hukum Mim Sukun',
    ruleId: 'izhar',
    colorToken: 'success',
    summary: 'Membaca mim sukun secara jelas dan bersih tanpa dengung saat bertemu selain huruf Ba dan Mim.',
    description: 'Izhar Syafawi terjadi apabila Mim Sukun (مْ) bertemu dengan 26 huruf hijaiyah lainnya selain huruf Ba (ب) dan Mim (م). Cara membacanya adalah mim sukun diucapkan jelas, kedua bibir dirapatkan tanpa dengung dan tanpa menahan suara. Sangat ditekankan kejelasannya terutama saat bertemu huruf Wau (و) dan Fa (ف) agar tidak tersamarkan.',
    letters: ['26 huruf selain Ba dan Mim'],
    rules: [
      { name: 'Kaidah Bacaan', description: 'Ucapkan mim sukun secara tegas dan wajar, hindari memperpanjang suara bibir.' },
      { name: 'Peringatan Khusus', description: 'Lebih berhati-hati saat bertemu Wau dan Fa karena makhrajnya sama-sama dari bibir, jangan sampai dibaca ikhfa.' }
    ],
    examples: [
      {
        surahNumber: 1,
        surahName: 'Al-Fatihah',
        ayahNumber: 7,
        arabic: 'غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        translation: 'Bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat.',
        ruleName: 'Mim Sukun bertemu Wau (عَلَيْهِمْ وَلَا)',
        note: 'Mim sukun bertemu wau wajib dibaca jelas dan tegas tanpa dengung: "\'alaihim wa ladh-dhaalliin".',
        segments: [
          { text: 'غَيْرِ الْمَغْضُوبِ ', isHighlighted: false },
          { text: 'عَلَيْهِمْ ', isHighlighted: true, ruleId: 'izhar' },
          { text: 'وَلَا الضَّالِّينَ', isHighlighted: false }
        ]
      }
    ],
    tips: [
      'Tutup bibir sewajarnya lalu langsung buka ke makhraj huruf berikutnya tanpa jeda.'
    ],
    commonMistakes: [
      'Menyamarkan bunyi mim sukun ketika bertemu huruf Wau atau Fa.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Huruf yang memerlukan kehati-hatian ekstra pada Izhar Syafawi agar tidak tersamarkan adalah...',
        options: ['Wau (و) dan Fa (ف)', 'Alif dan Hamzah', 'Qaf dan Kaf', 'Lam dan Ra'],
        answerIndex: 0,
        explanation: 'Wau dan Fa berada di area bibir sehingga rentan tersamarkan (ikhfa), maka harus dibaca sangat jelas.'
      }
    ]
  },

  // --- LEVEL 4 ---
  {
    slug: 'mad-thabii',
    level: 4,
    title: 'Hukum Mad Thabi\'i (Mad Asli)',
    arabicTitle: 'المد الطبيعي / الأصلي',
    category: 'Hukum Mad',
    ruleId: 'mad',
    colorToken: 'accent',
    summary: 'Memanjangkan bacaan sepanjang 2 harakat (1 alif) karena keberadaan salah satu dari tiga huruf mad asli.',
    description: 'Mad secara bahasa artinya panjang. Mad Thabi\'i adalah mad asli yang tidak dipengaruhi oleh hamzah atau sukun. Terjadi apabila: (1) Huruf berharakat Fathah bertemu Alif (ـَ + ا), (2) Huruf berharakat Kasrah bertemu Ya sukun (ـِ + يْ), (3) Huruf berharakat Dhammah bertemu Wau sukun (ـُ + وْ). Panjang bacaannya adalah 2 harakat (1 alif).',
    letters: ['ا (Alif)', 'ي (Ya Sukun)', 'و (Wau Sukun)'],
    rules: [
      { name: 'Kadar Panjang', description: 'Tepat 2 harakat (tidak boleh kurang dari 2 atau lebih dari 2 ketukan).' }
    ],
    examples: [
      {
        surahNumber: 109,
        surahName: 'Al-Kafirun',
        ayahNumber: 2,
        arabic: 'لَا أَعْبُدُ مَا تَعْبُدُونَ',
        translation: 'Aku tidak akan menyembah apa yang kamu sembah.',
        ruleName: 'Mad Thabi\'i pada Maa (مَا)',
        note: 'Huruf Mim berharakat fathah bertemu alif dibaca panjang 2 harakat.',
        segments: [
          { text: 'لَا أَعْبُدُ ', isHighlighted: false },
          { text: 'مَا ', isHighlighted: true, ruleId: 'mad' },
          { text: 'تَعْبُدُونَ', isHighlighted: false }
        ]
      }
    ],
    tips: [
      'Dua harakat diukur setara dengan dua kali ketukan atau membuka-menutup satu jari dengan tempo wajar.'
    ],
    commonMistakes: [
      'Membaca mad asli terlalu panjang (lebih dari 2 harakat) karena terbawa irama lagu tilawah.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Berapa panjang harakat untuk Mad Thabi\'i?',
        options: ['1 harakat', '2 harakat (1 alif)', '4 harakat', '6 harakat'],
        answerIndex: 1,
        explanation: 'Mad Thabi\'i (Mad Asli) wajib dibaca sepanjang 2 harakat.'
      }
    ]
  },
  {
    slug: 'mad-wajib-muttashil',
    level: 4,
    title: 'Hukum Mad Wajib Muttashil',
    arabicTitle: 'المد الواجب المتصل',
    category: 'Hukum Mad',
    ruleId: 'mad',
    colorToken: 'accent',
    summary: 'Mad thabi\'i bertemu huruf Hamzah dalam SATU KATA yang sama, wajib dibaca panjang 4-5 harakat.',
    description: 'Dinamakan "Wajib" karena semua imam qiraat sepakat wajib memanjangkannya lebih dari 2 harakat. Dinamakan "Muttashil" karena huruf mad dan hamzah bersambung dalam satu kata yang sama. Panjang bacaannya adalah 4 atau 5 harakat (bisa 6 harakat jika berhenti di akhir kata).',
    letters: ['Mad Thabi\'i + Hamzah dalam satu kata'],
    rules: [
      { name: 'Kadar Panjang', description: '4 sampai 5 harakat pada riwayat Hafsh \'an \'Ashim.' }
    ],
    examples: [
      {
        surahNumber: 110,
        surahName: 'An-Nashr',
        ayahNumber: 1,
        arabic: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ',
        translation: 'Apabila telah datang pertolongan Allah dan kemenangan.',
        ruleName: 'Mad Wajib Muttashil pada Jaa-a (جَاءَ)',
        note: 'Huruf mad alif bertemu hamzah dalam kata tunggal جَاءَ dipanjangkan 4-5 harakat.',
        segments: [
          { text: 'إِذَا ', isHighlighted: false },
          { text: 'جَآءَ ', isHighlighted: true, ruleId: 'mad' },
          { text: 'نَصْرُ اللَّهِ وَالْفَتْحُ', isHighlighted: false }
        ]
      }
    ],
    tips: [
      'Dalam mushaf cetak standar, Mad Wajib ditandai dengan tanda bendera layar (~) di atas huruf mad.'
    ],
    commonMistakes: [
      'Membacanya hanya 2 harakat seperti mad thabi\'i biasa.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Dinamakan Muttashil (bersambung) karena...',
        options: ['Bertemu hamzah di lain kata', 'Huruf mad dan hamzah berada dalam SATU kata', 'Bersambung dengan ayat sesudahnya', 'Dibaca terus tanpa henti'],
        answerIndex: 1,
        explanation: 'Muttashil artinya bersambung, yaitu huruf mad dan hamzah berada dalam satu kata yang sama.'
      }
    ]
  },
  {
    slug: 'mad-jaiz-munfashil',
    level: 4,
    title: 'Hukum Mad Jaiz Munfashil',
    arabicTitle: 'المد الجائز المنفصل',
    category: 'Hukum Mad',
    ruleId: 'mad',
    colorToken: 'accent',
    summary: 'Mad thabi\'i di akhir kata bertemu huruf Hamzah di awal kata berikutnya, dibaca panjang 4-5 harakat (atau 2 harakat thariq qashr).',
    description: 'Dinamakan "Jaiz" (boleh) karena ada perbedaan kadar panjang di antara ulama qiraat. Dinamakan "Munfashil" (terpisah) karena huruf mad berada di akhir kata pertama dan hamzah berada di awal kata kedua. Dalam bacaan umum Imam \'Ashim jalur Syathibiyyah dipanjangkan 4 atau 5 harakat.',
    letters: ['Mad Thabi\'i + Hamzah di kata terpisah'],
    rules: [
      { name: 'Kadar Panjang', description: '4 hingga 5 harakat (boleh 2 harakat pada jalur Thayyibatun Nasyr).' }
    ],
    examples: [
      {
        surahNumber: 108,
        surahName: 'Al-Kautsar',
        ayahNumber: 1,
        arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
        translation: 'Sungguh, Kami telah memberimu telaga Kautsar.',
        ruleName: 'Mad Jaiz Munfashil pada Innaa A\'thaynaak (إِنَّا أَعْطَيْنَاكَ)',
        note: 'Kata إِنَّا berakhiran mad alif, bertemu kata أَعْطَيْنَاكَ yang diawali hamzah.',
        segments: [
          { text: 'إِنَّآ ', isHighlighted: true, ruleId: 'mad' },
          { text: 'أَعْطَيْنَاكَ الْكَوْثَرَ', isHighlighted: false }
        ]
      }
    ],
    tips: [
      'Jika diwaqafkan pada kata pertama (misal berhenti di إِنَّا), bacaannya kembali menjadi Mad Thabi\'i 2 harakat.'
    ],
    commonMistakes: [
      'Memanjangkan mad jaiz saat berhenti di akhir kata pertama.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Jika seseorang berhenti (waqaf) pada kata pertama pada Mad Jaiz Munfashil, panjang bacaannya menjadi...',
        options: ['Tetap 4-5 harakat', '6 harakat', '2 harakat (Mad Thabi\'i)', 'Tidak boleh berhenti'],
        answerIndex: 2,
        explanation: 'Saat waqaf pada kata pertama, sebab mad jaiz (pertemuan dengan hamzah di kata berikutnya) gugur, sehingga kembali menjadi mad asli 2 harakat.'
      }
    ]
  },
  {
    slug: 'mad-aridh-lissukun-dan-lin',
    level: 4,
    title: 'Mad \'Aridh Lissukun & Mad Lin',
    arabicTitle: 'المد العارض للسكون ومد اللين',
    category: 'Hukum Mad',
    ruleId: 'mad',
    colorToken: 'accent',
    summary: 'Mad thabi\'i atau huruf lin yang bertemu huruf hidup di akhir kata lalu diwaqafkan (disukunkan), dibaca 2, 4, atau 6 harakat.',
    description: 'Mad \'Aridh Lissukun terjadi apabila Mad Thabi\'i berada sebelum huruf hidup di ujung kata, lalu kita berhenti (waqaf) sehingga huruf terakhir tersebut dimatikan secara mendadak (\'aridh). Mad Lin terjadi apabila Wau sukun atau Ya sukun didahului huruf berfathah dan diwaqafkan di akhir kata (misal: Quraisy, Khauf).',
    letters: ['Mad Thabi\'i / Huruf Lin + Waqaf'],
    rules: [
      { name: 'Kadar Pilihan Panjang', description: 'Boleh dibaca Qashr (2 harakat), Tawassuth (4 harakat), atau Thul (6 harakat). Konsisten dalam satu sesi bacaan lebih diutamakan.' }
    ],
    examples: [
      {
        surahNumber: 1,
        surahName: 'Al-Fatihah',
        ayahNumber: 2,
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        translation: 'Segala puji bagi Allah, Tuhan seluruh alam.',
        ruleName: 'Mad \'Aridh Lissukun pada Al-\'Aalamiin (الْعَالَمِينَ)',
        note: 'Ya sukun bertemu Nun berharakat fathah yang dimatikan karena waqaf di akhir ayat.',
        segments: [
          { text: 'الْحَمْدُ لِلَّهِ رَبِّ ', isHighlighted: false },
          { text: 'الْعَالَمِينَ', isHighlighted: true, ruleId: 'mad' }
        ]
      },
      {
        surahNumber: 106,
        surahName: 'Quraisy',
        ayahNumber: 1,
        arabic: 'لِإِيلَافِ قُرَيْشٍ',
        translation: 'Karena kebiasaan orang-orang Quraisy.',
        ruleName: 'Mad Lin pada Quraisy (قُرَيْشٍ)',
        note: 'Ya sukun didahului Ra fathah lalu diwaqafkan pada huruf Syin.',
        segments: [
          { text: 'لِإِيلَافِ ', isHighlighted: false },
          { text: 'قُرَيْشٍ', isHighlighted: true, ruleId: 'mad' }
        ]
      }
    ],
    tips: [
      'Pilih salah satu panjang (misal 4 harakat) dan pertahankan konsistensinya di setiap akhir ayat yang dibaca.'
    ],
    commonMistakes: [
      'Membaca mad \'aridh lissukun dengan 4 harakat saat washal (bersambung terus). Ingat: jika tidak berhenti, ia kembali menjadi mad thabi\'i 2 harakat.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Pilihan panjang harakat yang diperbolehkan pada Mad \'Aridh Lissukun adalah...',
        options: ['Hanya 2 harakat', 'Hanya 6 harakat', '2, 4, atau 6 harakat', 'Bebas sekuat nafas'],
        answerIndex: 2,
        explanation: 'Boleh memilih 2 harakat (Qashr), 4 harakat (Tawassuth), atau 6 harakat (Thul).'
      }
    ]
  },
  {
    slug: 'mad-lazim',
    level: 4,
    title: 'Hukum Mad Lazim (Mutsaqqal & Mukhaffaf)',
    arabicTitle: 'المد اللازم (المثقل والمخفف)',
    category: 'Hukum Mad',
    ruleId: 'mad',
    colorToken: 'accent',
    summary: 'Mad bertemu huruf sukun asli atau bertasydid, wajib dipanjangkan 6 harakat secara lazim tanpa kompromi.',
    description: 'Dinamakan "Lazim" karena seluruh imam qiraat sepakat memanjangkannya tepat 6 harakat (3 alif), baik saat washal maupun waqaf. Terbagi menjadi Mad Lazim Kilmi (dalam kata) dan Mad Lazim Harfi (pada huruf muqaththa\'ah di awal surah). Jika ada tasydid disebut Mutsaqqal (berat), jika sukun murni disebut Mukhaffaf (ringan).',
    letters: ['Mad + Tasydid/Sukun Asli'],
    rules: [
      { name: 'Kadar Panjang', description: 'Wajib 6 harakat penuh.' }
    ],
    examples: [
      {
        surahNumber: 1,
        surahName: 'Al-Fatihah',
        ayahNumber: 7,
        arabic: 'غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        translation: 'Bukan jalan mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat.',
        ruleName: 'Mad Lazim Kilmi Mutsaqqal pada Adh-Dhaalliin (الضَّالِّينَ)',
        note: 'Mad alif bertemu Lam bertasydid dalam satu kata dipanjangkan 6 harakat mantap.',
        segments: [
          { text: 'غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا ', isHighlighted: false },
          { text: 'الضَّآلِّينَ', isHighlighted: true, ruleId: 'mad' }
        ]
      }
    ],
    tips: [
      'Tekan sedikit intonasi saat masuk ke huruf bertasydid sesudah mad (nabr).'
    ],
    commonMistakes: [
      'Mengurangi panjangnya menjadi kurang dari 6 harakat.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Berapa panjang harakat Mad Lazim Kilmi Mutsaqqal?',
        options: ['2 harakat', '4 harakat', '5 harakat', '6 harakat'],
        answerIndex: 3,
        explanation: 'Mad Lazim wajib dipanjangkan 6 harakat penuh.'
      }
    ]
  },
  {
    slug: 'mad-badal-dan-iwadh',
    level: 4,
    title: 'Mad Badal & Mad \'Iwadh',
    arabicTitle: 'مد البدل ومد العوض',
    category: 'Hukum Mad',
    ruleId: 'mad',
    colorToken: 'accent',
    summary: 'Mad Badal (huruf mad menggantikan hamzah sukun) dan Mad \'Iwadh (pengganti tanwin fathah saat berhenti di akhir kata).',
    description: 'Mad Badal terjadi apabila huruf hamzah mendahului huruf mad (misal: ءَامَنُوا, أُوتُوا, إِيمَانًا), dibaca 2 harakat. Mad \'Iwadh terjadi apabila kata berakhiran Fathatain (ـً) diwaqafkan di akhir kata, dibaca panjang 2 harakat sebagai pengganti tanwin (kecuali pada Ta Marbuthah ـةً yang berubah menjadi bunyi Ha sukun).',
    letters: ['Hamzah sebelum mad / Fathatain + Waqaf'],
    rules: [
      { name: 'Kadar Panjang', description: '2 harakat.' }
    ],
    examples: [
      {
        surahNumber: 100,
        surahName: 'Al-\'Adiyat',
        ayahNumber: 1,
        arabic: 'وَالْعَادِيَاتِ ضَبْحًا',
        translation: 'Demi kuda perang yang berlari kencang terengah-engah.',
        ruleName: 'Mad \'Iwadh pada Dhab-haa (ضَبْحًا)',
        note: 'Fathatain pada dhabhan berubah menjadi dhab-haa sepanjang 2 harakat saat waqaf.',
        segments: [
          { text: 'وَالْعَادِيَاتِ ', isHighlighted: false },
          { text: 'ضَبْحًا', isHighlighted: true, ruleId: 'mad' }
        ]
      }
    ],
    tips: [
      'Ingat: Fathatain pada Ta Marbuthah (ـةً) TIDAK dibaca mad \'iwadh, melainkan berubah menjadi bunyi "H" sukun (misal: rahmah).'
    ],
    commonMistakes: [
      'Membaca mad \'iwadh dengan dengung atau mematikan bunyi tanwin "an" secara mentah saat waqaf.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Bagaimana cara membaca kata berakhiran fathatain saat waqaf pada Mad \'Iwadh?',
        options: ['Dibaca bunyi tanwin "an"', 'Diganti bunyi mad fathah panjang 2 harakat', 'Dimatikan hurufnya', 'Dibaca 6 harakat'],
        answerIndex: 1,
        explanation: 'Fathatain diganti menjadi bunyi mad berharakat fathah sepanjang 2 harakat.'
      }
    ]
  },

  // --- LEVEL 5 ---
  {
    slug: 'hukum-qalqalah',
    level: 5,
    title: 'Hukum Qalqalah (Sughra & Kubra)',
    arabicTitle: 'أحكام القلقلة (الصغرى والكبرى)',
    category: 'Qalqalah & Ghunnah',
    ruleId: 'qalqalah',
    colorToken: 'danger',
    summary: 'Memantulkan suara huruf hijaiyah tertentu saat berharakat sukun di tengah kata atau saat diwaqafkan di akhir kata.',
    description: 'Secara bahasa Qalqalah berarti getaran atau pantulan. Terjadi pada 5 huruf yang terangkum dalam "Quthbu Jadin" (ق، ط، ب، ج، د). Qalqalah Sughra terjadi jika huruf qalqalah mati asli di tengah kata; pantulannya ringan. Qalqalah Kubra terjadi jika huruf qalqalah berada di akhir kata dan diwaqafkan; pantulannya lebih kuat dan jelas.',
    letters: ['ق', 'ط', 'ب', 'ج', 'د (Quthbu Jadin)'],
    rules: [
      { name: 'Qalqalah Sughra (Ringan)', description: 'Sukun asli di tengah kata, pantulan tidak memutus sambungan kata (misal: يَطْمَعُ، يَدْخُلُونَ).' },
      { name: 'Qalqalah Kubra (Kuat)', description: 'Di akhir kata yang diwaqafkan, pantulan tegas dan mantap (misal: الْفَلَقِ، أَحَدٌ).' },
      { name: 'Qalqalah Akbar (Sangat Kuat)', description: 'Huruf qalqalah bertasydid di akhir kata saat waqaf (misal: وَتَبَّ).' }
    ],
    examples: [
      {
        surahNumber: 112,
        surahName: 'Al-Ikhlas',
        ayahNumber: 1,
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        translation: 'Katakanlah: "Dialah Allah, Yang Maha Esa."',
        ruleName: 'Qalqalah Kubra pada Dal (أَحَدٌ)',
        note: 'Huruf Dal di akhir ayat diwaqafkan sehingga memantul kuat: "ahad(e)".',
        segments: [
          { text: 'قُلْ هُوَ اللَّهُ ', isHighlighted: false },
          { text: 'أَحَـ', isHighlighted: false },
          { text: 'ـدٌ', isHighlighted: true, ruleId: 'qalqalah' }
        ]
      },
      {
        surahNumber: 113,
        surahName: 'Al-Falaq',
        ayahNumber: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        translation: 'Katakanlah: "Aku berlindung kepada Tuhan Yang Menguasai subuh."',
        ruleName: 'Qalqalah Kubra pada Qaf (الْفَلَقِ)',
        note: 'Huruf Qaf di akhir ayat memantul tebal dan mantap: "al-falaq(e)".',
        segments: [
          { text: 'قُلْ أَعُوذُ بِرَبِّ ', isHighlighted: false },
          { text: 'الْفَلَـ', isHighlighted: false },
          { text: 'ـقِ', isHighlighted: true, ruleId: 'qalqalah' }
        ]
      }
    ],
    tips: [
      'Pantulan qalqalah bukan vokal utuh (bukan A murni, I murni, atau U murni), melainkan sentakan alami pelepasan makhraj.'
    ],
    commonMistakes: [
      'Menambahkan hamzah sukun di akhir pantulan qalqalah.',
      'Memantulkan huruf yang bukan huruf qalqalah seperti Kaf, Ta, atau Dhad.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Huruf-huruf Qalqalah terangkum dalam susunan kata...',
        options: ['Quthbu Jadin (قُطْبُ جَدٍ)', 'Yanmu (يَنْمُوْ)', 'Yarmalun', 'Khash-sha'],
        answerIndex: 0,
        explanation: 'Huruf Qalqalah ada 5: Qaf, Tha, Ba, Jim, Dal (Quthbu Jadin).'
      },
      {
        id: 'q2',
        question: 'Pantulan qalqalah saat huruf mati asli di tengah kata disebut...',
        options: ['Qalqalah Kubra', 'Qalqalah Sughra', 'Qalqalah Akbar', 'Ghunnah'],
        answerIndex: 1,
        explanation: 'Qalqalah Sughra adalah pantulan ringan yang terjadi di tengah kata.'
      }
    ]
  },
  {
    slug: 'ghunnah-musyaddadah',
    level: 5,
    title: 'Ghunnah Musyaddadah',
    arabicTitle: 'الغنة المشددة',
    category: 'Qalqalah & Ghunnah',
    ruleId: 'ghunnah',
    colorToken: 'primary',
    summary: 'Dengung sempurna dan paling kuat pada huruf Nun dan Mim yang berharakat Tasydid.',
    description: 'Ghunnah Musyaddadah terjadi pada setiap huruf Nun bertasydid (نّ) atau Mim bertasydid (مّ). Dengung ini menempati tingkatan ghunnah tertinggi (akmalu maa takuun) dan wajib ditahan selama 2 hingga 3 harakat dengan suara merdu dari pangkal hidung.',
    letters: ['نّ (Nun Tasydid)', 'مّ (Mim Tasydid)'],
    rules: [
      { name: 'Kadar Panjang', description: 'Tahan dengung 2 harakat penuh baik saat washal maupun waqaf.' }
    ],
    examples: [
      {
        surahNumber: 114,
        surahName: 'An-Nas',
        ayahNumber: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        translation: 'Katakanlah: "Aku berlindung kepada Tuhannya manusia."',
        ruleName: 'Nun Bertasydid pada An-Naas (النَّاسِ)',
        note: 'Nun bertasydid ditahan dengungnya selama 2 harakat penuh sebelum melanjutkan ke huruf mad.',
        segments: [
          { text: 'قُلْ أَعُوذُ بِرَبِّ ', isHighlighted: false },
          { text: 'الـ', isHighlighted: false },
          { text: 'ـنَّـ', isHighlighted: true, ruleId: 'ghunnah' },
          { text: 'ـاسِ', isHighlighted: false }
        ]
      }
    ],
    tips: [
      'Rasakan getaran halus pada tulang hidung saat melafalkan nun dan mim bertasydid.'
    ],
    commonMistakes: [
      'Membaca lewat terburu-buru tanpa menahan dengung tasydid.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Ghunnah Musyaddadah wajib diterapkan pada huruf...',
        options: ['Nun dan Mim bertasydid', 'Semua huruf bertasydid', 'Huruf Wau dan Ya', 'Lam bertasydid'],
        answerIndex: 0,
        explanation: 'Ghunnah Musyaddadah hanya berlaku untuk Nun bertasydid (نّ) dan Mim bertasydid (مّ).'
      }
    ]
  },
  {
    slug: 'hukum-lam-jalalah-dan-ra',
    level: 5,
    title: 'Hukum Lam Jalalah & Hukum Ra',
    arabicTitle: 'أحكام لام الجلالة وحرف الراء',
    category: 'Tafkhim & Tarqiq',
    ruleId: 'tebal_tipis',
    colorToken: 'primary',
    summary: 'Kaidah membaca tebal (Tafkhim) atau tipis (Tarqiq) pada lafaz nama Allah SWT dan huruf Ra.',
    description: 'Lam pada lafaz jalalah (اللَّه) dibaca tebal (Tafkhim / Mufakhkhamah) jika didahului huruf berharakat Fathah atau Dhammah; dan dibaca tipis (Tarqiq / Muraqqaqah) jika didahului harakat Kasrah (misal: Bismillahi). Huruf Ra juga memiliki kaidah tebal (fathah, dhammah, sukun setelah fathah/dhammah) dan tipis (kasrah, sukun setelah kasrah asli).',
    letters: ['Lafaz Allah (اللَّه)', 'Huruf Ra (ر)'],
    rules: [
      { name: 'Lam Jalalah Tebal', description: 'Didahului Fathah atau Dhammah (contoh: نَصْرُ اللَّهِ، شَهِدَ اللَّهُ).' },
      { name: 'Lam Jalalah Tipis', description: 'Didahului Kasrah (contoh: بِسْمِ اللَّهِ، قُلِ اللَّهُمَّ).' },
      { name: 'Ra Tebal', description: 'Berharakat Fathah/Dhammah atau sukun setelah fathah/dhammah.' },
      { name: 'Ra Tipis', description: 'Berharakat Kasrah atau sukun setelah kasrah asli tanpa huruf isti\'la.' }
    ],
    examples: [
      {
        surahNumber: 112,
        surahName: 'Al-Ikhlas',
        ayahNumber: 2,
        arabic: 'اللَّهُ الصَّمَدُ',
        translation: 'Allah tempat meminta segala sesuatu.',
        ruleName: 'Lam Jalalah Tebal (Tafkhim)',
        note: 'Di awal bacaan, huruf Lam Jalalah dibaca tebal dan agung.',
        segments: [
          { text: 'اللَّهُ ', isHighlighted: true, ruleId: 'tebal_tipis' },
          { text: 'الصَّمَدُ', isHighlighted: false }
        ]
      },
      {
        surahNumber: 1,
        surahName: 'Al-Fatihah',
        ayahNumber: 1,
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
        ruleName: 'Lam Jalalah Tipis (Tarqiq)',
        note: 'Didahului huruf Mim berharakat kasrah sehingga dibaca tipis: "Bismillahi".',
        segments: [
          { text: 'بِسْمِ ', isHighlighted: false },
          { text: 'اللَّهِ ', isHighlighted: true, ruleId: 'tebal_tipis' },
          { text: 'الرَّحْمَٰنِ الرَّحِيمِ', isHighlighted: false }
        ]
      }
    ],
    tips: [
      'Saat membaca tebal (tafkhim), mulut jangan terlalu dimonyongkan; ketebalan suara berasal dari terangkatnya pangkal lidah.'
    ],
    commonMistakes: [
      'Membaca "Bismillahi" dengan suara O tebal (seperti Bismilloh).'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Lafaz Lam Jalalah pada "بِسْمِ اللَّهِ" dibaca secara...',
        options: ['Tafkhim (tebal)', 'Tarqiq (tipis)', 'Qalqalah', 'Iqlab'],
        answerIndex: 1,
        explanation: 'Karena didahului huruf berharakat kasrah, maka dibaca Tarqiq (tipis).'
      }
    ]
  },
  {
    slug: 'tanda-waqaf-dan-ibtida',
    level: 5,
    title: 'Tanda Waqaf & Ibtida\' Standar Kemenag',
    arabicTitle: 'علامات الوقف والابتداء',
    category: 'Waqaf & Ibtida\'',
    ruleId: 'waqaf',
    colorToken: 'primary',
    summary: 'Mengenal rambu-rambu berhenti (Waqaf) dan memulai kembali (Ibtida\') pada mushaf standar Al-Qur\'an Kemenag RI.',
    description: 'Waqaf secara bahasa artinya berhenti. Memahami tanda waqaf sangat penting agar pemenggalan bacaan tidak merusak makna ayat suci Al-Qur\'an. Mushaf Standar Indonesia Kementerian Agama RI menggunakan tanda-tanda waqaf resmi yang memandu qari kapan harus berhenti, boleh memilih, atau lebih utama melanjutkan.',
    letters: ['م', 'لا', 'ج', 'قلى', 'صلى', '∴'],
    rules: [
      { name: 'Waqaf Lazim (مـ)', description: 'Harus berhenti. Jika dilanjutkan dapat mengubah arti ayat.' },
      { name: 'Waqaf Laa Taqif (لا)', description: 'Tidak boleh berhenti di tengah ayat karena maknanya belum lengkap.' },
      { name: 'Waqaf Jaiz (ج)', description: 'Boleh berhenti dan boleh melanjutkan.' },
      { name: 'Waqfu Aula (قلى)', description: 'Berhenti lebih utama daripada melanjutkan.' },
      { name: 'Washlu Aula (صلى)', description: 'Melanjutkan (washal) lebih utama daripada berhenti.' },
      { name: 'Waqaf Mu\'anaqah (∴  ...  ∴)', description: 'Tanda titik tiga kembar: berhenti di salah satu tanda, tidak boleh berhenti di kedua-duanya.' }
    ],
    examples: [
      {
        surahNumber: 2,
        surahName: 'Al-Baqarah',
        ayahNumber: 2,
        arabic: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
        translation: 'Kitab (Al-Qur\'an) ini tidak ada keraguan padanya; petunjuk bagi mereka yang bertakwa.',
        ruleName: 'Waqaf Mu\'anaqah (ۛ ... ۛ)',
        note: 'Jika berhenti di kata رَيْبَ, maka teruskan kata فِيهِ tanpa berhenti lagi.',
        segments: [
          { text: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ', isHighlighted: true, ruleId: 'waqaf' },
          { text: 'فِيهِ هُدًى لِّلْمُتَّقِينَ', isHighlighted: false }
        ]
      }
    ],
    tips: [
      'Jika kehabisan nafas di tengah ayat panjang, berhentilah di kata yang baik lalu ulangi 1 atau 2 kata sebelumnya (Ibtida\' yang baik).'
    ],
    commonMistakes: [
      'Berhenti pada tanda "La" (لا) lalu langsung melanjutkan dari kata berikutnya tanpa mengulang.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Tanda waqaf "قلى" (Qila/Waqfu Aula) memiliki arti...',
        options: ['Harus terus', 'Lebih utama berhenti', 'Lebih utama melanjutkan', 'Dilarang berhenti'],
        answerIndex: 1,
        explanation: 'Tanda "قلى" singkatan dari Al-Waqfu Aula, artinya berhenti lebih utama.'
      },
      {
        id: 'q2',
        question: 'Pada tanda Waqaf Mu\'anaqah (tanda titik tiga kembar berurutan), aturannya adalah...',
        options: ['Wajib berhenti di kedua-duanya', 'Berhenti di salah satu tanda saja', 'Tidak boleh berhenti sama sekali', 'Harus mengulang ayat'],
        answerIndex: 1,
        explanation: 'Pada tanda Mu\'anaqah, kita berhenti di salah satu tanda dan tidak boleh berhenti di keduanya.'
      }
    ]
  }
];

const glossary = [
  { term: 'Tajwid', arabic: 'تَجْوِيد', category: 'Dasar', definition: 'Mengeluarkan setiap huruf hijaiyah dari tempat keluarnya (makhraj) dengan memberikan hak dan mustahaknya.', example: 'Membaca Al-Qur\'an secara tartil.' },
  { term: 'Makhraj', arabic: 'مَخْرَج', category: 'Makharijul Huruf', definition: 'Titik artikulasi atau tempat keluarnya bunyi huruf hijaiyah saat diucapkan.', example: 'Tenggorokan, lidah, dua bibir.' },
  { term: 'Ghunnah', arabic: 'غُنَّة', category: 'Sifat Huruf', definition: 'Suara dengung merdu yang berhembus keluar dari rongga pangkal hidung (Al-Khaisyum).', example: 'Dengung pada Nun dan Mim bertasydid.' },
  { term: 'Hams', arabic: 'هَمْس', category: 'Sifat Huruf', definition: 'Mengalirnya nafas desis saat membunyikan huruf karena terbukanya pita suara.', example: 'Huruf Ta (ت), Sin (س), Fa (ف).' },
  { term: 'Jahr', arabic: 'جَهْر', category: 'Sifat Huruf', definition: 'Tertahannya hembusan nafas saat huruf dilafalkan karena kuatnya tekanan pada makhraj.', example: 'Huruf Hamzah (ء), Ba (ب).' },
  { term: 'Isti\'la', arabic: 'اسْتِعْلَاء', category: 'Sifat Huruf', definition: 'Terangkatnya pangkal lidah ke langit-langit mulut saat melafalkan huruf sehingga terdengar tebal (Tafkhim).', example: 'Huruf Shad (ص), Dhad (ض), Tha (ط).' },
  { term: 'Istifal', arabic: 'اسْتِفَال', category: 'Sifat Huruf', definition: 'Merendahnya lidah dari langit-langit mulut saat melafalkan huruf sehingga terdengar tipis (Tarqiq).', example: 'Huruf Dal (د), Sin (س).' },
  { term: 'Tafkhim', arabic: 'تَفْخِيم', category: 'Karakter Suara', definition: 'Menebalkan suara huruf dengan memenuhi rongga mulut oleh gema suaranya.', example: 'Lafaz Allah didahului fathah.' },
  { term: 'Tarqiq', arabic: 'تَرْقِيق', category: 'Karakter Suara', definition: 'Menipiskan suara huruf tanpa membusungkan gema di dalam rongga mulut.', example: 'Lafaz Allah didahului kasrah.' },
  { term: 'Izhar', arabic: 'إِظْهَار', category: 'Nun/Mim Sukun', definition: 'Mengucapkan bunyi huruf secara terang, jelas, dan tanpa dengung.', example: 'Nun sukun bertemu huruf Hamzah.' },
  { term: 'Idgham', arabic: 'إِدْغَام', category: 'Nun/Mim Sukun', definition: 'Memasukkan atau meleburkan huruf pertama yang sukun ke dalam huruf berikutnya yang berharakat.', example: 'Nun sukun bertemu Ya.' },
  { term: 'Iqlab', arabic: 'إِقْلَاب', category: 'Nun/Mim Sukun', definition: 'Mengubah bunyi nun sukun atau tanwin menjadi suara mim yang disamarkan dengan dengung.', example: 'Nun sukun bertemu Ba.' },
  { term: 'Ikhfa', arabic: 'إِخْفَاء', category: 'Nun/Mim Sukun', definition: 'Menyamarkan bacaan antara izhar dan idgham disertai dengung yang ditahan.', example: 'Nun sukun bertemu Dal.' },
  { term: 'Qalqalah', arabic: 'قَلْقَلَة', category: 'Sifat Huruf', definition: 'Getaran atau pantulan suara yang kuat saat melafalkan huruf sukun karena tertutupnya makhraj secara sempurna.', example: 'Pantulan pada huruf Qaf, Tha, Ba, Jim, Dal.' },
  { term: 'Mad', arabic: 'مَدّ', category: 'Hukum Mad', definition: 'Memanjangkan suara bacaan pada huruf-huruf mad (Alif, Wau, Ya).', example: 'Mad Thabi\'i sepanjang 2 harakat.' },
  { term: 'Qashr', arabic: 'قَصْر', category: 'Hukum Mad', definition: 'Membaca huruf mad dengan panjang asli minimal (2 harakat) tanpa penambahan.', example: 'Membaca mad thabi\'i 2 harakat.' },
  { term: 'Tawassuth', arabic: 'تَوَسُّط', category: 'Hukum Mad', definition: 'Membaca mad dengan kadar pertengahan yaitu 4 harakat.', example: 'Mad Jaiz Munfashil 4 harakat.' },
  { term: 'Thul', arabic: 'طُول', category: 'Hukum Mad', definition: 'Memanjangkan mad dengan kadar maksimal yaitu 6 harakat penuh.', example: 'Mad Lazim 6 harakat.' },
  { term: 'Waqaf', arabic: 'وَقْف', category: 'Waqaf & Ibtida\'', definition: 'Menghentikan bacaan sejenak di akhir kata seraya mengambil nafas baru dengan niat melanjutkan kembali.', example: 'Berhenti di akhir ayat.' },
  { term: 'Ibtida\'', arabic: 'ابْتِدَاء', category: 'Waqaf & Ibtida\'', definition: 'Memulai kembali bacaan Al-Qur\'an setelah berhenti (waqaf).', example: 'Memulai dari kata yang memiliki makna sempurna.' },
  { term: 'Saktah', arabic: 'سَكْتَة', category: 'Waqaf & Ibtida\'', definition: 'Berhenti sejenak tanpa bernafas selama kurang lebih 2 harakat lalu langsung melanjutkan bacaan.', example: 'Saktah pada Surah Al-Kahfi ayat 1-2.' }
];

const tajwidDir = path.join(process.cwd(), 'public', 'data', 'tajwid');
if (!fs.existsSync(tajwidDir)) {
  fs.mkdirSync(tajwidDir, { recursive: true });
}

fs.writeFileSync(path.join(tajwidDir, 'levels.json'), JSON.stringify(levels, null, 2), 'utf-8');
fs.writeFileSync(path.join(tajwidDir, 'lessons.json'), JSON.stringify(lessons, null, 2), 'utf-8');
fs.writeFileSync(path.join(tajwidDir, 'glossary.json'), JSON.stringify(glossary, null, 2), 'utf-8');

console.log(`Generated:
- ${levels.length} Tajwid levels in levels.json
- ${lessons.length} Tajwid lessons in lessons.json
- ${glossary.length} Tajwid glossary terms in glossary.json`);
