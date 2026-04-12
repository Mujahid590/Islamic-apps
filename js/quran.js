// কুরআন পেজের জন্য জাভাস্ক্রিপ্ট
let currentSurahId = 1;
let allSurahs = [];
let currentFontSize = 18;
let currentTranslationFontSize = 14;
let isLoading = false;
let currentSurahData = null;

// টপিক ভিত্তিক আয়াত ডাটাবেস
const topicAyahDatabase = {
    "নামাজ": [
        { surahId: 2, surahName: "আল-বাকারাহ", ayahNum: 43, arabic: "وَأَقِيمُوا الصَّلَاةَ", translation: "আর নামাজ কায়েম করো।" },
        { surahId: 2, surahName: "আল-বাকারাহ", ayahNum: 238, arabic: "حَافِظُوا عَلَى الصَّلَوَاتِ", translation: "তোমরা সব নামাজের প্রতি যত্নবান হও।" },
        { surahId: 4, surahName: "আন-নিসা", ayahNum: 103, arabic: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا", translation: "নিশ্চয় নামাজ মুমিনদের উপর নির্ধারিত সময়ের ফরজ।" }
    ],
    "রোযা": [
        { surahId: 2, surahName: "আল-বাকারাহ", ayahNum: 183, arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ", translation: "হে মুমিনগণ, তোমাদের উপর রোযা ফরজ করা হয়েছে।" },
        { surahId: 2, surahName: "আল-বাকারাহ", ayahNum: 185, arabic: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ", translation: "রমযান মাস, যাতে কুরআন নাযিল করা হয়েছে।" }
    ],
    "বিয়ে": [
        { surahId: 24, surahName: "আন-নূর", ayahNum: 32, arabic: "وَأَنكِحُوا الْأَيَامَىٰ مِنكُمْ", translation: "তোমাদের মধ্যে যারা অবিবাহিত তাদের বিবাহ দাও।" },
        { surahId: 30, surahName: "আর-রূম", ayahNum: 21, arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا", translation: "আর তাঁর নিদর্শনসমূহের মধ্যে এই যে, তিনি তোমাদের জন্য তোমাদেরই同类 থেকে স্ত্রী সৃষ্টি করেছেন।" }
    ],
    "দান": [
        { surahId: 2, surahName: "আল-বাকারাহ", ayahNum: 261, arabic: "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ", translation: "যারা আল্লাহর পথে তাদের সম্পদ ব্যয় করে, তাদের দৃষ্টান্ত..." },
        { surahId: 2, surahName: "আল-বাকারাহ", ayahNum: 267, arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا أَنفِقُوا مِن طَيِّبَاتِ مَا كَسَبْتُمْ", translation: "হে মুমিনগণ, তোমরা যা উপার্জন কর তার উত্তম অংশ ব্যয় কর।" }
    ],
    "মুহাম্মদ": [
        { surahId: 33, surahName: "আল-আহযাব", ayahNum: 21, arabic: "لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ", translation: "নিশ্চয়ই আল্লাহর রাসূলের মধ্যে তোমাদের জন্য উত্তম আদর্শ রয়েছে।" },
        { surahId: 21, surahName: "আল-আম্বিয়া", ayahNum: 107, arabic: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ", translation: "আমি তোমাকে সারা জাহানের জন্য রহমত স্বরূপই প্রেরণ করেছি।" }
    ],
    "ধৈর্য": [
        { surahId: 2, surahName: "আল-বাকারাহ", ayahNum: 153, arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", translation: "হে মুমিনগণ, ধৈর্য ও নামাজের মাধ্যমে সাহায্য প্রার্থনা কর।" }
    ],
    "মাকরুসা": [
        { surahId: 2, surahName: "আল-বাকারাহ", ayahNum: 219, arabic: "يَسْأَلُونَكَ عَنِ الْخَمْرِ وَالْمَيْسِرِ قُلْ فِيهِمَا إِثْمٌ كَبِيرٌ", translation: "তোমাকে মদ ও জুয়া সম্পর্কে জিজ্ঞেস করে। বল, এ উভয়ের মধ্যে বড় পাপ রয়েছে।" },
        { surahId: 5, surahName: "আল-মায়িদাহ", ayahNum: 90, arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِنَّمَا الْخَمْرُ وَالْمَيْسِرُ وَالْأَنصَابُ وَالْأَزْلَامُ رِجْسٌ مِّنْ عَمَلِ الشَّيْطَانِ", translation: "হে মুমিনগণ, মদ, জুয়া, প্রতিমা এবং ভাগ্য নির্ধারণের তীরসমূহ নাপাক, শয়তানের কাজ।" }
    ]
};

// সূরা লিস্ট লোড করা
async function loadSurahList() {
    let surahs = [];
    for (let i = 1; i <= 114; i++) {
        surahs.push({
            id: i,
            name_ar: i === 1 ? "الفاتحة" : i === 2 ? "البقرة" : i === 112 ? "الإخلاص" : `سورة ${i}`,
            name_bn: i === 1 ? "আল-ফাতিহা" : i === 2 ? "আল-বাকারাহ" : i === 112 ? "আল-ইখলাস" : `সূরা ${i}`,
            ayat_count: i === 1 ? 7 : i === 2 ? 286 : i === 112 ? 4 : 100,
            place: getSurahPlace(i)
        });
    }
    allSurahs = surahs;
    renderSurahList(allSurahs);
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
    
    setTimeout(() => {
        let surahData = getLocalSurahData(surahId);
        currentSurahData = surahData;
        displaySurah(surahData, highlightAyah);
        saveReadingProgress(surahId, surahData.name_bn, 1);
        isLoading = false;
    }, 300);
    
    closeSidebar();
}

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
                {number:7, arabic:"صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ", translation:"তাদের পথ, যাদেরকে তুমি নেয়ামত দান করেছ।"}
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
                <div class="ayah-translation">সম্পূর্ণ কুরআনের জন্য API সংযোগ প্রয়োজন। শীঘ্রই আপডেট হবে ইনশাআল্লাহ।</div>
            </div>`;
        }
        ayahsContainer.innerHTML = ayahsHtml;
    }
    
    updateFontSizeDisplay();
    
    if (highlightAyah) {
        document.querySelector(`.ayah-card[data-ayah="${highlightAyah}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

function initSearch() {
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
    let topicSearchInput = document.getElementById('topicSearchInput');
    let topicSearchBtn = document.getElementById('topicSearchBtn');
    let searchResults = document.getElementById('searchResults');
    let searchResultsList = document.getElementById('searchResultsList');
    let closeResultsBtn = document.getElementById('closeResultsBtn');
    
    function performSearch(topic) {
        let results = [];
        let lowerTopic = topic.toLowerCase();
        
        for (let [key, ayahs] of Object.entries(topicAyahDatabase)) {
            if (key.toLowerCase().includes(lowerTopic) || lowerTopic.includes(key.toLowerCase())) {
                results.push(...ayahs);
            }
        }
        
        if (results.length === 0 && topicAyahDatabase[topic]) {
            results = topicAyahDatabase[topic];
        }
        
        if (results.length > 0) {
            searchResultsList.innerHTML = results.map(r => `
                <div class="search-result-item" data-surah="${r.surahId}" data-ayah="${r.ayahNum}">
                    <div class="result-surah"><i class="fas fa-quran"></i> ${r.surahName}</div>
                    <div class="result-ayah-num">আয়াত: ${r.ayahNum}</div>
                    <div class="result-arabic">${r.arabic}</div>
                    <div class="result-translation">${r.translation}</div>
                </div>
            `).join('');
            
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
            searchResultsList.innerHTML = '<div style="text-align:center;padding:20px;">কোন ফলাফল পাওয়া যায়নি</div>';
            searchResults.style.display = 'flex';
        }
    }
    
    if (topicSearchBtn) {
        topicSearchBtn.onclick = () => {
            let topic = topicSearchInput.value.trim();
            if (topic) performSearch(topic);
        };
    }
    
    if (topicSearchInput) {
        topicSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                let topic = topicSearchInput.value.trim();
                if (topic) performSearch(topic);
            }
        });
    }
    
    document.querySelectorAll('.topic-chip').forEach(chip => {
        chip.onclick = () => {
            let topic = chip.dataset.topic;
            topicSearchInput.value = topic;
            performSearch(topic);
        };
    });
    
    if (closeResultsBtn) {
        closeResultsBtn.onclick = () => searchResults.style.display = 'none';
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
    if (searchInput && currentSurahData) {
        searchInput.addEventListener('input', (e) => {
            let term = e.target.value.toLowerCase();
            let ayahs = document.querySelectorAll('.ayah-card');
            let found = false;
            
            ayahs.forEach(ayah => {
                let arabic = ayah.querySelector('.ayah-arabic')?.innerText.toLowerCase() || '';
                let translation = ayah.querySelector('.ayah-translation')?.innerText.toLowerCase() || '';
                
                if (arabic.includes(term) || translation.includes(term)) {
                    ayah.style.display = 'block';
                    ayah.style.backgroundColor = 'var(--primary-light)';
                    found = true;
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
    initSearch();
    loadReadingProgress();
    initFontSizeControl();
    initTopicSearch();
    initTopicToggle();
    initSidebar();
    loadSurah(1);
    setTimeout(() => initSurahHeaderSearch(), 500);
});
