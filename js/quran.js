// কুরআন পেজের জন্য জাভাস্ক্রিপ্ট
let currentSurahId = 1;
let allSurahs = [];
let currentFontSize = 18;
let currentTranslationFontSize = 14;
let isLoading = false;

// সূরা লিস্ট লোড করা (JSON থেকে)
async function loadSurahList() {
    try {
        const response = await fetch('data/surah-list.json');
        if (response.ok) {
            allSurahs = await response.json();
        } else {
            allSurahs = getLocalSurahList();
        }
        renderSurahList(allSurahs);
        
        let totalSpan = document.getElementById('totalSurahCount');
        let searchSpan = document.getElementById('searchCount');
        if (totalSpan) totalSpan.innerText = allSurahs.length;
        if (searchSpan) searchSpan.innerText = `${allSurahs.length} টি সূরা`;
    } catch (error) {
        console.log('JSON লোড করতে সমস্যা, লোকাল ডাটা ব্যবহার করা হচ্ছে');
        allSurahs = getLocalSurahList();
        renderSurahList(allSurahs);
    }
}

// লোকাল সূরা লিস্ট (ব্যাকআপ)
function getLocalSurahList() {
    const surahNamesBn = [
        "আল-ফাতিহা", "আল-বাকারাহ", "আল-ইমরান", "আন-নিসা", "আল-মায়িদাহ",
        "আল-আনআম", "আল-আরাফ", "আল-আনফাল", "আত-তাওবাহ", "ইউনুস",
        "হুদ", "ইউসুফ", "আর-রাদ", "ইব্রাহীম", "আল-হিজর", "আন-নাহল",
        "বনী-ইসরাঈল", "আল-কাহফ", "মারইয়াম", "ত্বোয়া-হা"
    ];
    const surahNamesAr = [
        "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة",
        "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
        "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل",
        "الإسراء", "الكهف", "مريم", "طه"
    ];
    const ayatCounts = [7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135];
    
    let surahs = [];
    for (let i = 1; i <= 114; i++) {
        surahs.push({
            id: i,
            name_ar: i <= 20 ? surahNamesAr[i-1] : `سورة ${i}`,
            name_bn: i <= 20 ? surahNamesBn[i-1] : `সূরা ${i}`,
            ayat_count: i <= 20 ? ayatCounts[i-1] : 100,
            place: getSurahPlace(i)
        });
    }
    return surahs;
}

// সূরার স্থান নির্ধারণ
function getSurahPlace(surahId) {
    const makkiSurahs = [1,6,7,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114];
    return makkiSurahs.includes(surahId) ? "মক্কী" : "মাদানী";
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

// সূরা লোড করা (JSON থেকে)
async function loadSurah(surahId) {
    if (isLoading) return;
    isLoading = true;
    
    currentSurahId = surahId;
    
    // সাইডবারে অ্যাক্টিভ স্টাইল আপডেট
    document.querySelectorAll('.surah-item').forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.surahId) === surahId) item.classList.add('active');
    });
    
    let viewer = document.getElementById('ayahViewer');
    viewer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-pulse"></i> লোড হচ্ছে...</div>';
    
    try {
        const response = await fetch(`data/surah-${surahId}.json`);
        let surahData;
        
        if (response.ok) {
            surahData = await response.json();
        } else {
            surahData = getLocalSurahData(surahId);
        }
        
        displaySurah(surahData);
        saveReadingProgress(surahId, surahData.name_bn, 1);
        
    } catch (error) {
        console.log('সূরা ডাটা লোড করতে সমস্যা');
        let surahData = getLocalSurahData(surahId);
        displaySurah(surahData);
    }
    
    isLoading = false;
    
    // মোবাইলে সাইডবার বন্ধ করা
    closeSidebar();
}

// লোকাল সূরা ডাটা (ব্যাকআপ)
function getLocalSurahData(surahId) {
    if (surahId === 1) {
        return {
            id: 1, name_ar: "الفاتحة", name_bn: "আল-ফাতিহা", ayat_count: 7, place: "মক্কী",
            ayahs: [
                {number:1, arabic:"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation:"শুরু করছি আল্লাহর নামে যিনি পরম করুণাময় ও অতি দয়ালু।"},
                {number:2, arabic:"الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translation:"সমস্ত প্রশংসা আল্লাহর জন্য, যিনি সমস্ত জগতের পালনকর্তা।"},
                {number:3, arabic:"الرَّحْمَٰنِ الرَّحِيمِ", translation:"যিনি পরম করুণাময় ও অতি দয়ালু।"},
                {number:4, arabic:"مَالِكِ يَوْمِ الدِّينِ", translation:"যিনি বিচার দিনের মালিক।"},
                {number:5, arabic:"إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translation:"আমরা শুধুমাত্র তোমারই ইবাদত করি এবং শুধুমাত্র তোমারই সাহায্য প্রার্থনা করি।"},
                {number:6, arabic:"اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translation:"আমাদেরকে সরল পথ দেখাও।"},
                {number:7, arabic:"صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", translation:"তাদের পথ, যাদেরকে তুমি নেয়ামত দান করেছ; তাদের পথ নয় যাদের প্রতি তোমার গজব নাযিল হয়েছে এবং তাদের পথ নয় যারা পথভ্রষ্ট হয়েছে।"}
            ]
        };
    } else if (surahId === 112) {
        return {
            id: 112, name_ar: "الإخلاص", name_bn: "আল-ইখলাস", ayat_count: 4, place: "মক্কী",
            ayahs: [
                {number:1, arabic:"قُلْ هُوَ اللَّهُ أَحَدٌ", translation:"বলুন, তিনিই আল্লাহ, এক।"},
                {number:2, arabic:"اللَّهُ الصَّمَدُ", translation:"আল্লাহ অমুখাপেক্ষী।"},
                {number:3, arabic:"لَمْ يَلِدْ وَلَمْ يُولَدْ", translation:"তিনি কাউকে জন্ম দেননি এবং কেউ তাঁকে জন্ম দেয়নি।"},
                {number:4, arabic:"وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ", translation:"এবং তাঁর সমতুল্য কেউ নেই।"}
            ]
        };
    } else {
        let surah = allSurahs.find(s => s.id === surahId);
        return {
            id: surahId,
            name_ar: surah?.name_ar || `سورة ${surahId}`,
            name_bn: surah?.name_bn || `সূরা ${surahId}`,
            ayat_count: surah?.ayat_count || 100,
            place: getSurahPlace(surahId),
            ayahs: []
        };
    }
}

// আয়াত ডিসপ্লে করা
function displaySurah(surahData) {
    let viewer = document.getElementById('ayahViewer');
    
    let ayahsHtml = `<div class="surah-header">
        <h2>${surahData.name_ar}</h2>
        <div class="surah-meta">
            <span><i class="fas fa-tag"></i> ${surahData.name_bn}</span>
            <span><i class="fas fa-ayat"></i> ${surahData.ayat_count} আয়াত</span>
            <span><i class="fas fa-map-marker-alt"></i> ${surahData.place}</span>
        </div>
    </div>`;
    
    if (surahData.ayahs && surahData.ayahs.length > 0) {
        surahData.ayahs.forEach(ayah => {
            ayahsHtml += `<div class="ayah-card" data-ayah="${ayah.number}">
                <div class="ayah-number">${ayah.number}</div>
                <div class="ayah-arabic">${ayah.arabic}</div>
                <div class="ayah-translation">${ayah.translation}</div>
            </div>`;
        });
    } else {
        // ডেমো কন্টেন্ট
        for(let i = 1; i <= Math.min(10, surahData.ayat_count); i++) {
            ayahsHtml += `<div class="ayah-card" data-ayah="${i}">
                <div class="ayah-number">${i}</div>
                <div class="ayah-arabic">আয়াত নং ${i}</div>
                <div class="ayah-translation">সম্পূর্ণ কুরআনের জন্য API সংযোগ প্রয়োজন। শীঘ্রই আপডেট হবে ইনশাআল্লাহ।</div>
            </div>`;
        }
        
        if (surahData.ayat_count > 10) {
            ayahsHtml += `<div class="ayah-card">
                <div class="ayah-number">...</div>
                <div class="ayah-arabic">মোট ${surahData.ayat_count}টি আয়াত</div>
                <div class="ayah-translation">শীঘ্রই সম্পূর্ণ সূরা যোগ করা হবে ইনশাআল্লাহ</div>
            </div>`;
        }
    }
    
    viewer.innerHTML = ayahsHtml;
    updateFontSizeDisplay();
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

// সার্চ ফাংশন (মেইন সার্চ)
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

// সাইডবার সার্চ
function initSidebarSearch() {
    let searchInput = document.getElementById('sidebarSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            let term = e.target.value.toLowerCase();
            let filtered = allSurahs.filter(s => 
                s.name_bn.toLowerCase().includes(term) || 
                s.name_ar.toLowerCase().includes(term) || 
                s.id.toString().includes(term)
            );
            renderSurahList(filtered);
        });
    }
}

// সাইডবার খোলা/বন্ধ করা
function openSidebar() {
    let sidebar = document.getElementById('surahSidebar');
    let overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    let sidebar = document.getElementById('surahSidebar');
    let overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';
}

// ফ্লোটিং বাটন এবং সাইডবার ইভেন্ট
function initSidebarToggle() {
    const floatingBtn = document.getElementById('floatingSurahBtn');
    const closeBtn = document.getElementById('closeSidebarBtn');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (floatingBtn) {
        floatingBtn.addEventListener('click', openSidebar);
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSidebar);
    }
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }
}

// ডেস্কটপে সাইডবার ভিউ
function initDesktopSidebar() {
    if (window.innerWidth >= 769) {
        let sidebar = document.getElementById('surahSidebar');
        if (sidebar) sidebar.classList.add('open');
    }
}

// উইন্ডো রিসাইজ ইভেন্ট
window.addEventListener('resize', () => {
    if (window.innerWidth >= 769) {
        let sidebar = document.getElementById('surahSidebar');
        if (sidebar) sidebar.classList.add('open');
    } else {
        let sidebar = document.getElementById('surahSidebar');
        if (sidebar && !sidebar.classList.contains('open')) {
            // মোবাইলে বন্ধ রাখো
        }
    }
});

// ডকুমেন্ট রেডি
document.addEventListener('DOMContentLoaded', () => {
    loadSurahList();
    initSearch();
    initSidebarSearch();
    loadReadingProgress();
    initFontSizeControl();
    initSidebarToggle();
    initDesktopSidebar();
    loadSurah(1);
});
