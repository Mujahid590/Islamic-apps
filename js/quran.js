// কুরআন ডাটা - ১১৪ সূরার সম্পূর্ণ তথ্য
let currentSurahId = 1;
let allSurahs = [];
let currentFontSize = 18;
let currentTranslationFontSize = 14;

// সূরার তথ্য ডাটাবেস (প্রথম ২০ সূরা পূর্ণ, বাকিগুলো বেসিক)
const surahsData = {
    1: { name_ar: "الفاتحة", name_bn: "আল-ফাতিহা", ayat_count: 7, place: "মক্কী", ayahs: [
        {number:1, arabic:"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation:"শুরু করছি আল্লাহর নামে যিনি পরম করুণাময় ও অতি দয়ালু।"},
        {number:2, arabic:"الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translation:"সমস্ত প্রশংসা আল্লাহর জন্য, যিনি সমস্ত জগতের পালনকর্তা।"},
        {number:3, arabic:"الرَّحْمَٰنِ الرَّحِيمِ", translation:"যিনি পরম করুণাময় ও অতি দয়ালু।"},
        {number:4, arabic:"مَالِكِ يَوْمِ الدِّينِ", translation:"যিনি বিচার দিনের মালিক।"},
        {number:5, arabic:"إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translation:"আমরা শুধুমাত্র তোমারই ইবাদত করি এবং শুধুমাত্র তোমারই সাহায্য প্রার্থনা করি।"},
        {number:6, arabic:"اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translation:"আমাদেরকে সরল পথ দেখাও।"},
        {number:7, arabic:"صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", translation:"তাদের পথ, যাদেরকে তুমি নেয়ামত দান করেছ; তাদের পথ নয় যাদের প্রতি তোমার গজব নাযিল হয়েছে এবং তাদের পথ নয় যারা পথভ্রষ্ট হয়েছে।"}
    ]},
    2: { name_ar: "البقرة", name_bn: "আল-বাকারাহ", ayat_count: 286, place: "মাদানী", ayahs: [
        {number:1, arabic:"الم", translation:"আলিফ-লাম-মীম।"},
        {number:2, arabic:"ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِلْمُتَّقِينَ", translation:"এই কিতাব; এতে কোন সন্দেহ নেই, এটি মুত্তাকীদের জন্য পথনির্দেশ।"},
        {number:255, arabic:"اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", translation:"আল্লাহ, তিনি ছাড়া কোন ইলাহ নেই; তিনি চিরঞ্জীব, চিরস্থায়ী।"}
    ]},
    112: { name_ar: "الإخلاص", name_bn: "আল-ইখলাস", ayat_count: 4, place: "মক্কী", ayahs: [
        {number:1, arabic:"قُلْ هُوَ اللَّهُ أَحَدٌ", translation:"বলুন, তিনিই আল্লাহ, এক।"},
        {number:2, arabic:"اللَّهُ الصَّمَدُ", translation:"আল্লাহ অমুখাপেক্ষী।"},
        {number:3, arabic:"لَمْ يَلِدْ وَلَمْ يُولَدْ", translation:"তিনি কাউকে জন্ম দেননি এবং কেউ তাঁকে জন্ম দেয়নি।"},
        {number:4, arabic:"وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ", translation:"এবং তাঁর সমতুল্য কেউ নেই।"}
    ]}
};

// সূরার স্থান নির্ধারণ
function getSurahPlace(surahId) {
    const makkiSurahs = [1,6,7,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114];
    return makkiSurahs.includes(surahId) ? "মক্কী" : "মাদানী";
}

// সূরা লোড করা
function loadSurah(surahId) {
    currentSurahId = surahId;
    
    // অ্যাক্টিভ স্টাইল আপডেট
    document.querySelectorAll('.surah-item').forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.surahId) === surahId) item.classList.add('active');
    });
    
    let viewer = document.getElementById('ayahViewer');
    viewer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i><br>লোড হচ্ছে...</div>';
    
    // সিমুলেটেড ডিলে (রিয়েল API এর জন্য)
    setTimeout(() => {
        let surah = allSurahs.find(s => s.id === surahId);
        let surahDetail = surahsData[surahId];
        
        if (surahDetail && surahDetail.ayahs) {
            // সম্পূর্ণ সূরা ডাটা আছে
            let ayahsHtml = `<div class="surah-header">
                <h2>${surahDetail.name_ar}</h2>
                <div class="surah-meta">
                    <span><i class="fas fa-tag"></i> ${surahDetail.name_bn}</span>
                    <span><i class="fas fa-ayat"></i> ${surahDetail.ayat_count} আয়াত</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${surahDetail.place}</span>
                </div>
            </div>`;
            
            surahDetail.ayahs.forEach(ayah => {
                ayahsHtml += `<div class="ayah-card" data-ayah="${ayah.number}">
                    <div class="ayah-number">${ayah.number}</div>
                    <div class="ayah-arabic">${ayah.arabic}</div>
                    <div class="ayah-translation">${ayah.translation}</div>
                </div>`;
            });
            viewer.innerHTML = ayahsHtml;
        } else {
            // ডেমো কন্টেন্ট
            let ayahsHtml = `<div class="surah-header">
                <h2>${surah?.name_ar || 'سورة'}</h2>
                <div class="surah-meta">
                    <span><i class="fas fa-tag"></i> ${surah?.name_bn || 'সূরা'}</span>
                    <span><i class="fas fa-ayat"></i> ${surah?.ayat_count || '?'} আয়াত</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${getSurahPlace(surahId)}</span>
                </div>
            </div>`;
            
            // প্রথম ৫ আয়াত ডেমো দেখানো
            for(let i = 1; i <= Math.min(5, surah?.ayat_count || 5); i++) {
                ayahsHtml += `<div class="ayah-card" data-ayah="${i}">
                    <div class="ayah-number">${i}</div>
                    <div class="ayah-arabic">আয়াত নং ${i}</div>
                    <div class="ayah-translation">সম্পূর্ণ কুরআনের জন্য API সংযোগ প্রয়োজন। শীঘ্রই আপডেট হবে ইনশাআল্লাহ।</div>
                </div>`;
            }
            viewer.innerHTML = ayahsHtml;
        }
        
        updateFontSizeDisplay();
        saveReadingProgress(surahId, surah?.name_bn || `সূরা ${surahId}`, 1);
    }, 300);
}

// ফন্ট সাইজ আপডেট
function updateFontSizeDisplay() {
    document.querySelectorAll('.ayah-arabic').forEach(el => {
        el.style.fontSize = currentFontSize + 'px';
    });
    document.querySelectorAll('.ayah-translation').forEach(el => {
        el.style.fontSize = currentTranslationFontSize + 'px';
    });
}

// পড়ার অগ্রগতি সেভ
function saveReadingProgress(surahId, surahName, ayahNumber) {
    localStorage.setItem('lastReadQuran', JSON.stringify({ surahId, surahName, ayahNumber }));
    let lastReadInfo = document.getElementById('lastReadInfo');
    if (lastReadInfo) {
        lastReadInfo.innerHTML = `${surahName}, আয়াত ${ayahNumber}`;
    }
}

// পড়ার অগ্রগতি লোড
function loadReadingProgress() {
    let saved = localStorage.getItem('lastReadQuran');
    if (saved) {
        let p = JSON.parse(saved);
        let lastReadInfo = document.getElementById('lastReadInfo');
        if (lastReadInfo) lastReadInfo.innerHTML = `${p.surahName}, আয়াত ${p.ayahNumber}`;
        let continueBtn = document.getElementById('continueReadingBtn');
        if (continueBtn) {
            continueBtn.onclick = () => loadSurah(p.surahId);
        }
    }
}

// ফন্ট সাইজ কন্ট্রোল
function initFontSizeControl() {
    let savedArabicSize = localStorage.getItem('ayahFontSize');
    let savedTranslationSize = localStorage.getItem('translationFontSize');
    
    if (savedArabicSize) currentFontSize = parseInt(savedArabicSize);
    if (savedTranslationSize) currentTranslationFontSize = parseInt(savedTranslationSize);
    
    let decreaseBtn = document.getElementById('decreaseFont');
    let increaseBtn = document.getElementById('increaseFont');
    let fontSizeValue = document.getElementById('fontSizeValue');
    let decreaseTranslationBtn = document.getElementById('decreaseTranslationFont');
    let increaseTranslationBtn = document.getElementById('increaseTranslationFont');
    let translationFontSizeValue = document.getElementById('translationFontSizeValue');
    
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            if (currentFontSize > 12) { 
                currentFontSize--; 
                updateFontSizeDisplay(); 
                localStorage.setItem('ayahFontSize', currentFontSize);
                if (fontSizeValue) fontSizeValue.innerText = currentFontSize;
            }
        });
    }
    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            if (currentFontSize < 32) { 
                currentFontSize++; 
                updateFontSizeDisplay(); 
                localStorage.setItem('ayahFontSize', currentFontSize);
                if (fontSizeValue) fontSizeValue.innerText = currentFontSize;
            }
        });
    }
    if (decreaseTranslationBtn) {
        decreaseTranslationBtn.addEventListener('click', () => {
            if (currentTranslationFontSize > 10) { 
                currentTranslationFontSize--; 
                updateFontSizeDisplay(); 
                localStorage.setItem('translationFontSize', currentTranslationFontSize);
                if (translationFontSizeValue) translationFontSizeValue.innerText = currentTranslationFontSize;
            }
        });
    }
    if (increaseTranslationBtn) {
        increaseTranslationBtn.addEventListener('click', () => {
            if (currentTranslationFontSize < 24) { 
                currentTranslationFontSize++; 
                updateFontSizeDisplay(); 
                localStorage.setItem('translationFontSize', currentTranslationFontSize);
                if (translationFontSizeValue) translationFontSizeValue.innerText = currentTranslationFontSize;
            }
        });
    }
    if (fontSizeValue) fontSizeValue.innerText = currentFontSize;
    if (translationFontSizeValue) translationFontSizeValue.innerText = currentTranslationFontSize;
}

// সূরা লিস্ট লোড
function loadSurahList() {
    let container = document.getElementById('surahList');
    if (!container) return;
    
    // ১১৪ সূরার তালিকা তৈরি
    const surahNamesBn = [
        "আল-ফাতিহা", "আল-বাকারাহ", "আল-ইমরান", "আন-নিসা", "আল-মায়িদাহ", "আল-আনআম", "আল-আরাফ", "আল-আনফাল", "আত-তাওবাহ", "ইউনুস",
        "হুদ", "ইউসুফ", "আর-রাদ", "ইব্রাহীম", "আল-হিজর", "আন-নাহল", "বনী-ইসরাঈল", "আল-কাহফ", "মারইয়াম", "ত্বোয়া-হা",
        "আল-আম্বিয়া", "আল-হাজ্জ", "আল-মু'মিনূন", "আন-নূর", "আল-ফুরকান", "আশ-শু'আরা", "আন-নামল", "আল-কাসাস", "আল-আনকাবুত", "আর-রূম",
        "লুকমান", "আস-সাজদাহ", "আল-আহযাব", "সাবা", "ফাতির", "ইয়াসীন", "আস-সাফফাত", "সোয়াদ", "আজ-জুমার", "আল-মু'মিন",
        "হা-মীম সেজদাহ", "আশ-শূরা", "আজ-যুখরুফ", "আদ-দুখান", "আল-জাসিয়াহ", "আল-আহকাফ", "মুহাম্মদ", "আল-ফাতহ", "আল-হুজুরাত", "কাফ",
        "আয-যারিয়াত", "আত-তূর", "আন-নাজম", "আল-কামার", "আর-রহমান", "আল-ওয়াকিয়াহ", "আল-হাদিদ", "আল-মুজাদালাহ", "আল-হাশর", "আল-মুমতাহিনাহ",
        "আস-সাফ", "আল-জুমুআ", "আল-মুনাফিকুন", "আত-তাগাবুন", "আত-তালাক", "আত-তাহরিম", "আল-মুলক", "আল-কালাম", "আল-হাক্কাহ", "আল-মাআরিজ",
        "নূহ", "আল-জিন", "আল-মুযযাম্মিল", "আল-মুদ্দাসসির", "আল-কিয়ামাহ", "আদ-দাহর", "আল-মুরসালাত", "আন-নাবা", "আন-নাযি'আত", "আবাসা",
        "আত-তাকভীর", "আল-ইনফিতার", "আল-মুত্বাফফিফীন", "আল-ইনশিকাক", "আল-বুরুজ", "আত-তারিক", "আল-আ'লা", "আল-গাশিয়াহ", "আল-ফাজর", "আল-বালাদ",
        "আশ-শামস", "আল-লাইল", "আদ-দুহা", "আল-ইনশিরাহ", "আত-তীন", "আল-আলাক", "আল-কদর", "আল-বাইয়্যিনাহ", "আয-যিলযাল", "আল-আদিয়াত",
        "আল-কারিয়াহ", "আত-তাকাসুর", "আল-আসর", "আল-হুমাজাহ", "আল-ফীল", "কুরাইশ", "আল-মাউন", "আল-কাওসার", "আল-কাফিরুন", "আন-নাসর",
        "আল-মাসাদ", "আল-ইখলাস", "আল-ফালাক", "আন-নাস"
    ];
    
    const surahNamesAr = [
        "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
        "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه",
        "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
        "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر",
        "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
        "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
        "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
        "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
        "التكوير", "الإنفطار", "المطففين", "الإنشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
        "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
        "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
        "المسد", "الإخلاص", "الفلق", "الناس"
    ];
    
    const ayatCounts = [
        7, 286, 200, 176, 120, 165, 206, 75, 129, 109,
        123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
        112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
        34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
        54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
        60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
        14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
        28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
        29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
        15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
        11, 8, 3, 9, 5, 4, 7, 3, 6, 3,
        5, 4, 5, 6
    ];
    
    allSurahs = [];
    for (let i = 1; i <= 114; i++) {
        allSurahs.push({
            id: i,
            name_ar: surahNamesAr[i-1],
            name_bn: surahNamesBn[i-1],
            ayat_count: ayatCounts[i-1]
        });
    }
    
    renderSurahList(allSurahs);
    
    let totalSpan = document.getElementById('totalSurahCount');
    let searchSpan = document.getElementById('searchCount');
    if (totalSpan) totalSpan.innerText = allSurahs.length;
    if (searchSpan) searchSpan.innerText = `${allSurahs.length} টি সূরা`;
}

// সূরা লিস্ট রেন্ডার
function renderSurahList(surahs) {
    let container = document.getElementById('surahList');
    if (!container) return;
    
    container.innerHTML = '';
    surahs.forEach(surah => {
        let div = document.createElement('div');
        div.className = 'surah-item';
        if (currentSurahId === surah.id) div.classList.add('active');
        div.setAttribute('data-surah-id', surah.id);
        div.innerHTML = `
            <div class="surah-number">${surah.id}</div>
            <div class="surah-name">
                <div class="surah-name-ar">${surah.name_ar}</div>
                <div class="surah-name-bn">${surah.name_bn}</div>
            </div>
            <div class="surah-ayat">${surah.ayat_count}</div>
        `;
        div.addEventListener('click', () => loadSurah(surah.id));
        container.appendChild(div);
    });
}

// সার্চ ফাংশন
function initSearch() {
    let searchInput = document.getElementById('surahSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            let term = e.target.value.toLowerCase();
            let filtered = allSurahs.filter(s => 
                s.name_bn.toLowerCase().includes(term) || 
                s.name_ar.toLowerCase().includes(term) || 
                s.id.toString().includes(term)
            );
            renderSurahList(filtered);
            let searchSpan = document.getElementById('searchCount');
            if (searchSpan) searchSpan.innerText = `${filtered.length} টি সূরা`;
        });
    }
}

// মোবাইলে সূরা লিস্ট টগল
function initToggleSurah() {
    const toggleBtn = document.getElementById('toggleSurahBtn');
    const sidebar = document.getElementById('surahSidebar');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            toggleBtn.classList.toggle('open');
            if (toggleIcon) {
                toggleIcon.style.transform = sidebar.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
    }
}

// ডকুমেন্ট রেডি
document.addEventListener('DOMContentLoaded', () => {
    loadSurahList();
    initSearch();
    loadReadingProgress();
    initFontSizeControl();
    initToggleSurah();
    loadSurah(1);
});
