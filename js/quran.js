// কুরআন পেজের জন্য জাভাস্ক্রিপ্ট
let currentSurahId = 1;
let allSurahs = [];
let currentFontSize = 18;
let currentTranslationFontSize = 14;
let isLoading = false;
let currentSurahData = null;
let fullQuranData = {}; // সব সূরার ডাটা স্টোর করার জন্য

// সব কুরআনের ডাটা (আরবি + বাংলা + বিষয় ভিত্তিক সার্চের জন্য)
const quranDatabase = {
    1: {
        name_ar: "الفاتحة", name_bn: "আল-ফাতিহা", ayat_count: 7, place: "মক্কী",
        ayahs: [
            {number:1, arabic:"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation:"শুরু করছি আল্লাহর নামে যিনি পরম করুণাময় ও অতি দয়ালু।"},
            {number:2, arabic:"الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translation:"সমস্ত প্রশংসা আল্লাহর জন্য, যিনি সমস্ত জগতের পালনকর্তা।"},
            {number:3, arabic:"الرَّحْمَٰنِ الرَّحِيمِ", translation:"যিনি পরম করুণাময় ও অতি দয়ালু।"},
            {number:4, arabic:"مَالِكِ يَوْمِ الدِّينِ", translation:"যিনি বিচার দিনের মালিক।"},
            {number:5, arabic:"إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translation:"আমরা শুধুমাত্র তোমারই ইবাদত করি এবং শুধুমাত্র তোমারই সাহায্য প্রার্থনা করি।"},
            {number:6, arabic:"اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translation:"আমাদেরকে সরল পথ দেখাও।"},
            {number:7, arabic:"صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ", translation:"তাদের পথ, যাদেরকে তুমি নেয়ামত দান করেছ।"}
        ]
    },
    2: {
        name_ar: "البقرة", name_bn: "আল-বাকারাহ", ayat_count: 286, place: "মাদানী",
        ayahs: [
            {number:1, arabic:"الم", translation:"আলিফ-লাম-মীম।"},
            {number:2, arabic:"ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِلْمُتَّقِينَ", translation:"এই কিতাব; এতে কোন সন্দেহ নেই, এটি মুত্তাকীদের জন্য পথনির্দেশ।"},
            {number:3, arabic:"الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ", translation:"যারা অদৃশ্যের প্রতি ঈমান আনে, নামাজ কায়েম করে এবং রিজিক থেকে ব্যয় করে।"},
            {number:4, arabic:"وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ", translation:"যারা বিশ্বাস করে যা তোমার প্রতি নাযিল করা হয়েছে এবং তোমার পূর্বে যা নাযিল হয়েছে।"},
            {number:5, arabic:"أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ", translation:"এরাই তাদের পালনকর্তার পক্ষ থেকে সঠিক পথে রয়েছে এবং এরাই সফলকাম।"},
            {number:183, arabic:"يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ", translation:"হে মুমিনগণ, তোমাদের উপর রোযা ফরজ করা হয়েছে।"},
            {number:185, arabic:"شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ", translation:"রমযান মাস, যাতে কুরআন নাযিল করা হয়েছে।"},
            {number:255, arabic:"اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", translation:"আল্লাহ, তিনি ছাড়া কোন ইলাহ নেই; তিনি চিরঞ্জীব, চিরস্থায়ী।"}
        ]
    },
    112: {
        name_ar: "الإخلاص", name_bn: "আল-ইখলাস", ayat_count: 4, place: "মক্কী",
        ayahs: [
            {number:1, arabic:"قُلْ هُوَ اللَّهُ أَحَدٌ", translation:"বলুন, তিনিই আল্লাহ, এক।"},
            {number:2, arabic:"اللَّهُ الصَّمَدُ", translation:"আল্লাহ অমুখাপেক্ষী।"},
            {number:3, arabic:"لَمْ يَلِدْ وَلَمْ يُولَدْ", translation:"তিনি কাউকে জন্ম দেননি এবং কেউ তাঁকে জন্ম দেয়নি।"},
            {number:4, arabic:"وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ", translation:"এবং তাঁর সমতুল্য কেউ নেই।"}
        ]
    }
};

// সূরা লিস্ট লোড করা
async function loadSurahList() {
    try {
        const response = await fetch('surah-data/surah-list.json');
        if (response.ok) {
            allSurahs = await response.json();
        } else {
            allSurahs = generateLocalSurahList();
        }
    } catch (error) {
        allSurahs = generateLocalSurahList();
    }
    renderSurahList(allSurahs);
}

function generateLocalSurahList() {
    let surahs = [];
    for (let i = 1; i <= 114; i++) {
        let existing = quranDatabase[i];
        surahs.push({
            id: i,
            name_ar: existing ? existing.name_ar : `سورة ${i}`,
            name_bn: existing ? existing.name_bn : `সূরা ${i}`,
            ayat_count: existing ? existing.ayat_count : 100,
            place: getSurahPlace(i)
        });
    }
    return surahs;
}

function getSurahPlace(surahId) {
    const makkiSurahs = [1,6,7,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114];
    return makkiSurahs.includes(surahId) ? "মক্কী" : "মাদানী";
}

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

// সূরা লোড করা
async function loadSurah(surahId, highlightAyah = null) {
    if (isLoading) return;
    isLoading = true;
    
    currentSurahId = surahId;
    
    document.querySelectorAll('.surah-item').forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.surahId) === surahId) item.classList.add('active');
    });
    
    let surah = allSurahs.find(s => s.id === surahId);
    document.getElementById('stickySurahNameAr').innerText = surah?.name_ar || `سورة ${surahId}`;
    document.getElementById('stickySurahNameBn').innerText = surah?.name_bn || `সূরা ${surahId}`;
    document.getElementById('stickySurahAyatCount').innerText = surah?.ayat_count || '?';
    document.getElementById('stickySurahPlace').innerText = getSurahPlace(surahId);
    
    let ayahsContainer = document.getElementById('ayahsContainer');
    ayahsContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-pulse"></i> লোড হচ্ছে...</div>';
    
    setTimeout(async () => {
        let surahData = await getSurahData(surahId);
        currentSurahData = surahData;
        displaySurah(surahData, highlightAyah);
        saveReadingProgress(surahId, surahData.name_bn, 1);
        isLoading = false;
    }, 200);
    
    closeSidebar();
}

async function getSurahData(surahId) {
    if (quranDatabase[surahId]) {
        return quranDatabase[surahId];
    }
    
    try {
        const response = await fetch(`surah-data/surah-${surahId}.json`);
        if (response.ok) {
            const data = await response.json();
            quranDatabase[surahId] = data;
            return data;
        }
    } catch (error) {}
    
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

function displaySurah(surahData, highlightAyah = null) {
    let ayahsContainer = document.getElementById('ayahsContainer');
    
    if (surahData.ayahs && surahData.ayahs.length > 0) {
        let ayahsHtml = '';
        surahData.ayahs.forEach(ayah => {
            let highlightClass = (highlightAyah === ayah.number) ? ' highlight' : '';
            ayahsHtml += `<div class="ayah-card${highlightClass}" data-ayah="${ayah.number}">
                <div class="ayah-number">${ayah.number}</div>
                <div class="ayah-arabic">${ayah.arabic}</div>
                <div class="ayah-translation">${ayah.translation}</div>
            </div>`;
        });
        ayahsContainer.innerHTML = ayahsHtml;
    } else {
        let ayahsHtml = '';
        for(let i = 1; i <= Math.min(10, surahData.ayat_count); i++) {
            ayahsHtml += `<div class="ayah-card" data-ayah="${i}">
                <div class="ayah-number">${i}</div>
                <div class="ayah-arabic">আয়াত নং ${i}</div>
                <div class="ayah-translation">সম্পূর্ণ কুরআনের জন্য JSON ফাইল প্রয়োজন। শীঘ্রই আপডেট হবে ইনশাআল্লাহ।</div>
            </div>`;
        }
        ayahsContainer.innerHTML = ayahsHtml;
    }
    
    updateFontSizeDisplay();
    
    if (highlightAyah) {
        document.querySelector(`.ayah-card[data-ayah="${highlightAyah}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// বিষয় অনুসন্ধান ফাংশন (আরবি ও বাংলা উভয় ভাষায়)
function searchInQuran(searchTerm) {
    let results = [];
    let term = searchTerm.toLowerCase().trim();
    
    if (term.length < 2) return results;
    
    for (let surahId in quranDatabase) {
        let surah = quranDatabase[surahId];
        if (!surah.ayahs) continue;
        
        for (let ayah of surah.ayahs) {
            let arabicMatch = ayah.arabic.toLowerCase().includes(term);
            let translationMatch = ayah.translation.toLowerCase().includes(term);
            
            if (arabicMatch || translationMatch) {
                results.push({
                    surahId: parseInt(surahId),
                    surahName: surah.name_bn,
                    surahNameAr: surah.name_ar,
                    ayahNum: ayah.number,
                    arabic: ayah.arabic,
                    translation: ayah.translation
                });
            }
        }
    }
    
    return results;
}

function performTopicSearch() {
    let searchInput = document.getElementById('topicSearchInput');
    let searchTerm = searchInput.value.trim();
    
    if (searchTerm === "") {
        alert("অনুগ্রহ করে একটি বিষয় লিখুন");
        return;
    }
    
    let results = searchInQuran(searchTerm);
    let searchResults = document.getElementById('searchResults');
    let searchResultsList = document.getElementById('searchResultsList');
    let resultCount = document.getElementById('resultCount');
    
    if (results.length > 0) {
        searchResultsList.innerHTML = results.map(r => `
            <div class="search-result-item" data-surah="${r.surahId}" data-ayah="${r.ayahNum}">
                <div class="result-surah"><i class="fas fa-quran"></i> ${r.surahName} (সূরা ${r.surahId})</div>
                <div class="result-ayah-num">আয়াত: ${r.ayahNum}</div>
                <div class="result-arabic">${r.arabic.substring(0, 100)}${r.arabic.length > 100 ? '...' : ''}</div>
                <div class="result-translation">${r.translation.substring(0, 150)}${r.translation.length > 150 ? '...' : ''}</div>
            </div>
        `).join('');
        
        if (resultCount) resultCount.innerText = `(${results.length}টি ফলাফল)`;
        
        document.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                let surah = parseInt(item.dataset.surah);
                let ayah = parseInt(item.dataset.ayah);
                loadSurah(surah, ayah);
                searchResults.style.display = 'none';
            });
        });
        
        searchResults.style.display = 'flex';
    } else {
        searchResultsList.innerHTML = `<div style="text-align:center;padding:20px;">
            <i class="fas fa-search" style="font-size:2rem;color:var(--text-gray)"></i>
            <p style="margin-top:10px;">"${searchTerm}" সম্পর্কে কোন আয়াত পাওয়া যায়নি</p>
            <p style="font-size:0.7rem;color:var(--text-gray)">অন্য কোনো শব্দ দিয়ে চেষ্টা করুন</p>
        </div>`;
        if (resultCount) resultCount.innerText = `(০টি ফলাফল)`;
        searchResults.style.display = 'flex';
    }
}

function updateFontSizeDisplay() {
    document.querySelectorAll('.ayah-arabic').forEach(el => {
        el.style.fontSize = currentFontSize + 'px';
    });
    document.querySelectorAll('.ayah-translation').forEach(el => {
        el.style.fontSize = currentTranslationFontSize + 'px';
    });
}

function saveReadingProgress(surahId, surahName, ayahNumber) {
    localStorage.setItem('lastReadQuran', JSON.stringify({ surahId, surahName, ayahNumber }));
    let lastReadInfo = document.getElementById('lastReadInfo');
    if (lastReadInfo) {
        lastReadInfo.innerHTML = `${surahName}, আয়াত ${ayahNumber}`;
    }
}

function loadReadingProgress() {
    let saved = localStorage.getItem('lastReadQuran');
    if (saved) {
        let p = JSON.parse(saved);
        let lastReadInfo = document.getElementById('lastReadInfo');
        if (lastReadInfo) lastReadInfo.innerHTML = `${p.surahName}, আয়াত ${p.ayahNumber}`;
        let continueBtn = document.getElementById('continueReadingBtn');
        if (continueBtn) continueBtn.onclick = () => loadSurah(p.surahId);
    }
}

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
    
    if (decreaseBtn) decreaseBtn.onclick = () => {
        if (currentFontSize > 12) { currentFontSize--; updateFontSizeDisplay(); localStorage.setItem('ayahFontSize', currentFontSize); if(fontSizeValue) fontSizeValue.innerText = currentFontSize; }
    };
    if (increaseBtn) increaseBtn.onclick = () => {
        if (currentFontSize < 32) { currentFontSize++; updateFontSizeDisplay(); localStorage.setItem('ayahFontSize', currentFontSize); if(fontSizeValue) fontSizeValue.innerText = currentFontSize; }
    };
    if (decreaseTranslationBtn) decreaseTranslationBtn.onclick = () => {
        if (currentTranslationFontSize > 10) { currentTranslationFontSize--; updateFontSizeDisplay(); localStorage.setItem('translationFontSize', currentTranslationFontSize); if(translationFontSizeValue) translationFontSizeValue.innerText = currentTranslationFontSize; }
    };
    if (increaseTranslationBtn) increaseTranslationBtn.onclick = () => {
        if (currentTranslationFontSize < 24) { currentTranslationFontSize++; updateFontSizeDisplay(); localStorage.setItem('translationFontSize', currentTranslationFontSize); if(translationFontSizeValue) translationFontSizeValue.innerText = currentTranslationFontSize; }
    };
    if (fontSizeValue) fontSizeValue.innerText = currentFontSize;
    if (translationFontSizeValue) translationFontSizeValue.innerText = currentTranslationFontSize;
}

function initSidebarSearch() {
    let searchInput = document.getElementById('sidebarSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            let term = e.target.value.toLowerCase();
            let filtered = allSurahs.filter(s => s.name_bn.toLowerCase().includes(term) || s.name_ar.toLowerCase().includes(term) || s.id.toString().includes(term));
            renderSurahList(filtered);
        });
    }
}

function initTopicSearch() {
    let topicSearchBtn = document.getElementById('topicSearchBtn');
    let topicSearchInput = document.getElementById('topicSearchInput');
    let closeResultsBtn = document.getElementById('closeResultsBtn');
    
    if (topicSearchBtn) {
        topicSearchBtn.onclick = performTopicSearch;
    }
    if (topicSearchInput) {
        topicSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performTopicSearch();
        });
    }
    if (closeResultsBtn) {
        closeResultsBtn.onclick = () => {
            document.getElementById('searchResults').style.display = 'none';
        };
    }
}

function initTopicToggle() {
    let header = document.getElementById('topicSearchHeader');
    let content = document.getElementById('topicSearchContent');
    let icon = document.getElementById('topicToggleIcon');
    
    if (header && content && icon) {
        header.onclick = () => {
            content.classList.toggle('show');
            icon.classList.toggle('open');
        };
    }
}

function initSurahHeaderSearch() {
    let searchInput = document.getElementById('surahHeaderSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            let term = e.target.value.toLowerCase();
            let ayahs = document.querySelectorAll('.ayah-card');
            
            ayahs.forEach(ayah => {
                let arabic = ayah.querySelector('.ayah-arabic')?.innerText.toLowerCase() || '';
                let translation = ayah.querySelector('.ayah-translation')?.innerText.toLowerCase() || '';
                
                if (arabic.includes(term) || translation.includes(term)) {
                    ayah.style.display = 'block';
                    if (term) ayah.style.backgroundColor = 'var(--primary-light)';
                    else ayah.style.backgroundColor = '';
                } else {
                    ayah.style.display = 'none';
                }
            });
            
            if (!term) {
                ayahs.forEach(ayah => {
                    ayah.style.display = 'block';
                    ayah.style.backgroundColor = '';
                });
            }
        });
    }
}

function openSidebar() {
    let sidebar = document.getElementById('surahSidebar');
    let overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('show');
}

function closeSidebar() {
    let sidebar = document.getElementById('surahSidebar');
    let overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
}

function initSidebar() {
    let floatingBtn = document.getElementById('floatingSurahBtn');
    let closeBtn = document.getElementById('closeSidebarBtn');
    let overlay = document.getElementById('sidebarOverlay');
    
    if (floatingBtn) floatingBtn.onclick = openSidebar;
    if (closeBtn) closeBtn.onclick = closeSidebar;
    if (overlay) overlay.onclick = closeSidebar;
}

document.addEventListener('DOMContentLoaded', () => {
    loadSurahList();
    initSidebarSearch();
    loadReadingProgress();
    initFontSizeControl();
    initTopicSearch();
    initTopicToggle();
    initSidebar();
    loadSurah(1);
    setTimeout(() => initSurahHeaderSearch(), 500);
});
