// কুরআন পেজের জন্য জাভাস্ক্রিপ্ট
let currentSurahId = 1;
let allSurahs = [];
let currentFontSize = 18;
let currentTranslationFontSize = 14;
let isLoading = false;

// সিজদা আয়াতের তালিকা (সূরা নম্বর ও আয়াত নম্বর)
const sajdahAyahs = [
    { surah: 7, ayah: 206 },     // সূরা আল-আরাফ
    { surah: 13, ayah: 15 },     // সূরা আর-রাদ
    { surah: 16, ayah: 49 },     // সূরা আন-নাহল
    { surah: 17, ayah: 107 },    // সূরা বনী ইসরাঈল
    { surah: 19, ayah: 58 },     // সূরা মারইয়াম
    { surah: 22, ayah: 18 },     // সূরা আল-হাজ্জ
    { surah: 22, ayah: 77 },     // সূরা আল-হাজ্জ (দ্বিতীয়)
    { surah: 25, ayah: 60 },     // সূরা আল-ফুরকান
    { surah: 27, ayah: 25 },     // সূরা আন-নামল
    { surah: 32, ayah: 15 },     // সূরা আস-সাজদাহ
    { surah: 38, ayah: 24 },     // সূরা সোয়াদ
    { surah: 41, ayah: 37 },     // সূরা হা-মীম সেজদাহ
    { surah: 53, ayah: 62 },     // সূরা আন-নাজম
    { surah: 84, ayah: 21 },     // সূরা আল-ইনশিকাক
    { surah: 96, ayah: 19 }      // সূরা আল-আলাক
];

// সিজদা চেক করার ফাংশন
function isSajdahAyah(surahId, ayahNumber) {
    return sajdahAyahs.some(s => s.surah === surahId && s.ayah === ayahNumber);
}

// সিজদা নোটিফিকেশন দেখানো
function showSajdahNotification() {
    const notif = document.getElementById('sajdahNotification');
    if (notif) {
        notif.style.display = 'block';
        setTimeout(() => {
            notif.style.display = 'none';
        }, 3000);
    }
}

// সূরা লিস্ট লোড করা
async function loadSurahList() {
    try {
        const response = await fetch('data/surah-list.json');
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
        surahs.push({
            id: i,
            name_ar: `سورة ${i}`,
            name_bn: `সূরা ${i}`,
            ayat_count: 100,
            place: getSurahPlace(i)
        });
    }
    return surahs;
}

function getSurahPlace(surahId) {
    const makkiSurahs = [1,6,7,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114];
    return makkiSurahs.includes(surahId) ? "মক্কী" : "মাদানী";
}

function getPlaceIcon(place) {
    if (place === "মক্কী") {
        return '<i class="fas fa-kaaba"></i>';
    } else {
        return '<i class="fas fa-mosque"></i>';
    }
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
    let surahPlace = getSurahPlace(surahId);
    let placeIcon = getPlaceIcon(surahPlace);
    
    document.getElementById('stickySurahNameAr').innerText = surah?.name_ar || `سورة ${surahId}`;
    document.getElementById('stickySurahNameBn').innerText = surah?.name_bn || `সূরা ${surahId}`;
    document.getElementById('stickySurahAyatCount').innerText = surah?.ayat_count || '?';
    document.getElementById('surahPlaceIcon').innerHTML = placeIcon;
    
    let placeSpan = document.getElementById('stickySurahPlace');
    if (placeSpan) {
        placeSpan.innerHTML = `<i class="fas fa-map-marker-alt"></i> <span>${surahPlace}</span>`;
    }
    
    let ayahsContainer = document.getElementById('ayahsContainer');
    ayahsContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-pulse"></i> লোড হচ্ছে...</div>';
    
    setTimeout(async () => {
        let surahData = await getSurahData(surahId);
        displaySurah(surahData, highlightAyah);
        saveReadingProgress(surahId, surahData.name_bn, 1);
        isLoading = false;
    }, 200);
    
    closeSidebar();
}

async function getSurahData(surahId) {
    try {
        const response = await fetch(`data/surah-${surahId}.json`);
        if (response.ok) {
            return await response.json();
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
            let sajdahClass = isSajdahAyah(surahData.id, ayah.number) ? ' sajdah-ayah' : '';
            let sajdahBadge = '';
            
            if (isSajdahAyah(surahData.id, ayah.number)) {
                sajdahBadge = `<div class="sajdah-badge" data-surah="${surahData.id}" data-ayah="${ayah.number}">
                    <i class="fas fa-procedures"></i> সিজদা
                </div>`;
            }
            
            ayahsHtml += `<div class="ayah-card${highlightClass}${sajdahClass}" data-ayah="${ayah.number}">
                <div class="ayah-header">
                    <div class="ayah-number">${ayah.number}</div>
                    ${sajdahBadge}
                </div>
                <div class="ayah-arabic">${ayah.arabic}</div>
                <div class="ayah-translation">${ayah.translation}</div>
            </div>`;
        });
        ayahsContainer.innerHTML = ayahsHtml;
        
        // সিজদা বাটনে ক্লিক ইভেন্ট
        document.querySelectorAll('.sajdah-badge').forEach(badge => {
            badge.addEventListener('click', (e) => {
                e.stopPropagation();
                showSajdahNotification();
            });
        });
    } else {
        ayahsContainer.innerHTML = `<div class="loading-spinner">
            <i class="fas fa-info-circle"></i>
            <p>সূরা ${surahData.id} এর আয়াত লোড করা সম্ভব হয়নি</p>
            <p style="font-size:0.8rem">data/surah-${surahData.id}.json ফাইলটি যোগ করুন</p>
        </div>`;
    }
    
    updateFontSizeDisplay();
    
    if (highlightAyah) {
        document.querySelector(`.ayah-card[data-ayah="${highlightAyah}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// বিষয় অনুসন্ধান ফাংশন
async function searchInQuran(searchTerm) {
    let results = [];
    let term = searchTerm.toLowerCase().trim();
    
    if (term.length < 2) return results;
    
    for (let i = 1; i <= 114; i++) {
        try {
            const response = await fetch(`data/surah-${i}.json`);
            if (response.ok) {
                const surah = await response.json();
                if (surah.ayahs) {
                    for (let ayah of surah.ayahs) {
                        let arabicMatch = ayah.arabic.toLowerCase().includes(term);
                        let translationMatch = ayah.translation.toLowerCase().includes(term);
                        
                        if (arabicMatch || translationMatch) {
                            results.push({
                                surahId: i,
                                surahName: surah.name_bn,
                                surahNameAr: surah.name_ar,
                                ayahNum: ayah.number,
                                arabic: ayah.arabic,
                                translation: ayah.translation
                            });
                        }
                    }
                }
            }
        } catch(e) {}
        
        if (results.length > 50) break;
    }
    
    return results;
}

async function performTopicSearch() {
    let searchInput = document.getElementById('topicSearchInput');
    let searchTerm = searchInput.value.trim();
    
    if (searchTerm === "") {
        alert("অনুগ্রহ করে একটি বিষয় লিখুন");
        return;
    }
    
    let searchResults = document.getElementById('searchResults');
    let searchResultsList = document.getElementById('searchResultsList');
    let resultCount = document.getElementById('resultCount');
    
    searchResultsList.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-pulse"></i> অনুসন্ধান করা হচ্ছে...</div>';
    searchResults.style.display = 'flex';
    
    let results = await searchInQuran(searchTerm);
    
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
    } else {
        searchResultsList.innerHTML = `<div style="text-align:center;padding:20px;">
            <i class="fas fa-search" style="font-size:2rem;color:var(--text-gray)"></i>
            <p style="margin-top:10px;">"${searchTerm}" সম্পর্কে কোন আয়াত পাওয়া যায়নি</p>
        </div>`;
        if (resultCount) resultCount.innerText = `(০টি ফলাফল)`;
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

function initSajdahNotification() {
    let closeNotif = document.getElementById('closeSajdahNotif');
    if (closeNotif) {
        closeNotif.onclick = () => {
            document.getElementById('sajdahNotification').style.display = 'none';
        };
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
    initSajdahNotification();
    loadSurah(1);
});
