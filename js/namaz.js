// নামাজের সময়সূচি
const prayerSchedule = [
    { 
        id: "fajr",
        nameBn: "ফজর", 
        nameAr: "صلاة الفجر", 
        icon: "fa-cloud-moon",
        start: "05:00 AM", 
        end: "06:15 AM",
        virtue: "ফজরের নামাজ জাহান্নামের আগুন থেকে রক্ষা করে"
    },
    { 
        id: "dhuhr",
        nameBn: "যোহর", 
        nameAr: "صلاة الظهر", 
        icon: "fa-sun",
        start: "12:30 PM", 
        end: "03:45 PM",
        virtue: "যোহরের নামাজ জান্নাতের দরজা খুলে দেয়"
    },
    { 
        id: "asr",
        nameBn: "আসর", 
        nameAr: "صلاة العصر", 
        icon: "fa-cloud-sun",
        start: "04:00 PM", 
        end: "05:45 PM",
        virtue: "আসরের নামাজ আমলনামায় নূর বৃদ্ধি করে"
    },
    { 
        id: "maghrib",
        nameBn: "মাগরিব", 
        nameAr: "صلاة المغرب", 
        icon: "fa-moon",
        start: "06:15 PM", 
        end: "07:15 PM",
        virtue: "মাগরিবের নামাজ গুনাহ মাফের কারণ"
    },
    { 
        id: "isha",
        nameBn: "এশা", 
        nameAr: "صلاة العشاء", 
        icon: "fa-stars",
        start: "07:45 PM", 
        end: "11:59 PM",
        virtue: "এশার নামাজ সারা রাত ইবাদতের সমান"
    }
];

// সময়কে মিনিটে কনভার্ট
function timeToMinutes(timeStr) {
    let [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    else if (modifier === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
}

// বর্তমান সময় মিনিটে
function getCurrentMinutes() {
    let now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

// নামাজের স্ট্যাটাস
function getStatus(prayerStart, prayerEnd, currentMins) {
    let startMins = timeToMinutes(prayerStart);
    let endMins = timeToMinutes(prayerEnd);
    if (currentMins >= startMins && currentMins < endMins) return "active";
    else if (currentMins >= endMins) return "ended";
    else return "upcoming";
}

// পরবর্তী নামাজ
function getNextPrayer() {
    let currentMins = getCurrentMinutes();
    for (let prayer of prayerSchedule) {
        if (currentMins < timeToMinutes(prayer.start)) return prayer;
    }
    return prayerSchedule[0];
}

// নামাজের তালিকা রেন্ডার
function renderPrayers() {
    let currentMins = getCurrentMinutes();
    let container = document.getElementById("prayerTimesList");
    if (!container) return;
    container.innerHTML = "";
    
    prayerSchedule.forEach(p => {
        let status = getStatus(p.start, p.end, currentMins);
        let statusText = "", statusClass = "";
        if (status === "active") { statusText = "চলমান"; statusClass = "status-active"; }
        else if (status === "ended") { statusText = "সময় শেষ"; statusClass = "status-ended"; }
        else { statusText = "বাকি"; statusClass = "status-upcoming"; }
        
        container.innerHTML += `
            <div class="prayer-card ${p.id}">
                <div class="prayer-info">
                    <div class="prayer-icon">
                        <i class="fas ${p.icon}"></i>
                    </div>
                    <div class="prayer-details">
                        <div class="prayer-name">
                            <span class="prayer-name-bn">${p.nameBn}</span>
                            <span class="prayer-name-ar">${p.nameAr}</span>
                        </div>
                        <div class="prayer-times">
                            <span><i class="fas fa-play-circle"></i> শুরু: ${p.start}</span>
                            <span><i class="fas fa-stop-circle"></i> শেষ: ${p.end}</span>
                        </div>
                        <div class="prayer-virtue">
                            <small><i class="fas fa-leaf"></i> ${p.virtue}</small>
                        </div>
                    </div>
                </div>
                <div class="status-badge ${statusClass}">${statusText}</div>
            </div>
        `;
    });
}

// কাউন্টডাউন স্টার্ট
function startCountdown() {
    setInterval(() => {
        const nextPrayer = getNextPrayer();
        if (nextPrayer) {
            document.getElementById('nextPrayerName').innerHTML = `${nextPrayer.nameBn} <span style="font-family:'Uthman Taha Naskh';">(${nextPrayer.nameAr})</span>`;
            
            let now = new Date();
            let [time, modifier] = nextPrayer.start.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (modifier === 'PM' && hours !== 12) hours += 12;
            else if (modifier === 'AM' && hours === 12) hours = 0;
            
            let prayerTime = new Date();
            prayerTime.setHours(hours, minutes, 0, 0);
            if (prayerTime < now) prayerTime.setDate(prayerTime.getDate() + 1);
            
            let diff = prayerTime - now;
            let hoursLeft = Math.floor(diff / (1000 * 60 * 60));
            let minutesLeft = Math.floor((diff % 3600000) / 60000);
            let secondsLeft = Math.floor((diff % 60000) / 1000);
            
            document.getElementById('countdownTimer').innerHTML = `${hoursLeft.toString().padStart(2,'0')}:${minutesLeft.toString().padStart(2,'0')}:${secondsLeft.toString().padStart(2,'0')}`;
        }
        renderPrayers();
    }, 1000);
}

// লাইভ ঘড়ি
function updateClock() {
    let now = new Date();
    let clockDiv = document.getElementById("liveClock");
    if (clockDiv) {
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        clockDiv.innerHTML = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')} ${ampm}`;
    }
}

// আজকের তারিখ
function updateDate() {
    let dateDiv = document.getElementById("todayDate");
    if (dateDiv) {
        let now = new Date();
        let banglaDate = now.toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        dateDiv.innerHTML = `<i class="fas fa-calendar-alt"></i> ${banglaDate}`;
    }
}

// থিম ফাংশন
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        if (btn.dataset.theme === savedTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function setupThemeListeners() {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            
            if (theme === 'dark') {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            
            localStorage.setItem('theme', theme);
            
            document.querySelectorAll('.theme-btn').forEach(b => {
                if (b.dataset.theme === theme) {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });
            
            showToast(theme === 'dark' ? '🌙 ডার্ক মোড সক্রিয়' : '☀️ লাইট মোড সক্রিয়', 'success');
        });
    });
}

function showToast(message, type = 'info') {
    const oldToasts = document.querySelectorAll('.toast');
    oldToasts.forEach(toast => toast.remove());
    
    let toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// সেটিংস প্যানেল
function initSettingsPanel() {
    let settingsBtn = document.getElementById('settingsNavBtn');
    let settingsPanel = document.getElementById('settingsPanel');
    let closeSettings = document.getElementById('closeSettingsBtn');
    let reminderBtn = document.getElementById('enableReminderBtn');
    
    if (settingsBtn && settingsPanel) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsPanel.classList.toggle('open');
        });
    }
    
    if (closeSettings && settingsPanel) {
        closeSettings.addEventListener('click', () => {
            settingsPanel.classList.remove('open');
        });
    }
    
    if (reminderBtn) {
        reminderBtn.addEventListener('click', () => {
            if (Notification.permission === 'granted') {
                showToast('রিমাইন্ডার ইতিমধ্যে সক্রিয় আছে!', 'success');
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        showToast('নামাজের রিমাইন্ডার সক্রিয়!', 'success');
                    }
                });
            }
        });
    }
    
    document.addEventListener('click', (e) => {
        if (settingsPanel && settingsPanel.classList.contains('open')) {
            if (!settingsPanel.contains(e.target) && e.target !== settingsBtn && !settingsBtn?.contains(e.target)) {
                settingsPanel.classList.remove('open');
            }
        }
    });
}

// নোটিফিকেশন চেক
function checkAndNotify() {
    if (Notification.permission === 'granted') {
        const nextPrayer = getNextPrayer();
        const now = new Date();
        const [time, modifier] = nextPrayer.start.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours !== 12) hours += 12;
        else if (modifier === 'AM' && hours === 12) hours = 0;
        
        let prayerTime = new Date();
        prayerTime.setHours(hours, minutes, 0, 0);
        
        const diff = prayerTime - now;
        if (diff <= 300000 && diff > 0 && !localStorage.getItem(`notified_${nextPrayer.id}`)) {
            new Notification(`📿 ${nextPrayer.nameBn} নামাজের সময়`, {
                body: `${nextPrayer.nameBn} নামাজ শুরু হতে ৫ মিনিট বাকি!`,
                icon: 'https://cdn-icons-png.flaticon.com/512/3061/3061553.png'
            });
            localStorage.setItem(`notified_${nextPrayer.id}`, 'true');
            setTimeout(() => {
                localStorage.removeItem(`notified_${nextPrayer.id}`);
            }, 86400000);
        }
    }
}

// পেজ লোড হলে সব ফাংশন চালু
document.addEventListener('DOMContentLoaded', () => {
    renderPrayers();
    startCountdown();
    updateClock();
    updateDate();
    initTheme();
    setupThemeListeners();
    initSettingsPanel();
    setInterval(updateClock, 1000);
    setInterval(checkAndNotify, 60000);
    
    if (Notification.permission === 'default') {
        setTimeout(() => {
            Notification.requestPermission();
        }, 5000);
    }
});