let currentCount = 0, currentType = 'subhanallah', history = [];
const tasbihTypes = {
    subhanallah: { arabic: "سُبْحَانَ اللَّهِ", bangla: "সুবহানাল্লাহ" },
    alhamdulillah: { arabic: "الْحَمْدُ لِلَّهِ", bangla: "আলহামদুলিল্লাহ" },
    allahuakbar: { arabic: "اللَّهُ أَكْبَرُ", bangla: "আল্লাহু আকবার" }
};

function loadData() {
    if (localStorage.getItem('tasbihCount')) currentCount = parseInt(localStorage.getItem('tasbihCount'));
    if (localStorage.getItem('tasbihType')) currentType = localStorage.getItem('tasbihType');
    if (localStorage.getItem('tasbihHistory')) history = JSON.parse(localStorage.getItem('tasbihHistory'));
    updateDisplay();
    updateHistory();
}

function saveData() {
    localStorage.setItem('tasbihCount', currentCount);
    localStorage.setItem('tasbihType', currentType);
    localStorage.setItem('tasbihHistory', JSON.stringify(history.slice(-20)));
}

function updateDisplay() {
    let numSpan = document.getElementById('tasbihNumber');
    let labelDiv = document.getElementById('tasbihLabel');
    if (numSpan) numSpan.innerText = currentCount;
    if (labelDiv) {
        let type = tasbihTypes[currentType];
        labelDiv.innerHTML = `${type.arabic}<br><span style="font-size:0.8rem">${type.bangla}</span>`;
    }
}

function addCount() {
    currentCount++;
    updateDisplay();
    saveData();
    if (currentCount === 33 || currentCount === 99 || currentCount === 100) {
        showToast(`🎉 ${currentCount} বার পূর্ণ হয়েছে!`, 'success');
    }
}

function resetCount() {
    if (currentCount > 0) {
        history.unshift({ type: currentType, count: currentCount, date: new Date().toLocaleString() });
        currentCount = 0;
        updateDisplay();
        saveData();
        updateHistory();
        showToast('তাসবিহ রিসেট করা হয়েছে', 'info');
    }
}

function updateHistory() {
    let container = document.getElementById('historyList');
    if (!container) return;
    if (history.length === 0) { 
        container.innerHTML = '<p class="empty">কোনো ইতিহাস নেই</p>'; 
        return; 
    }
    container.innerHTML = history.slice(0, 10).map(h => `<div class="history-item"><span>${tasbihTypes[h.type].bangla}</span><span>${h.count} বার</span><span>${h.date}</span></div>`).join('');
}

function setPresetCount(count) { 
    currentCount = count; 
    updateDisplay(); 
    saveData(); 
    showToast(`${count} বার সেট করা হয়েছে`, 'info'); 
}

function changeType(type) { 
    currentType = type; 
    updateDisplay(); 
    saveData(); 
    document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active')); 
    let activeBtn = document.querySelector(`.type-btn[data-type="${type}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    showToast(`${tasbihTypes[type].bangla} নির্বাচিত`, 'info');
}

let countBtn = document.getElementById('countBtn');
let resetBtn = document.getElementById('resetBtn');
if (countBtn) countBtn.addEventListener('click', addCount);
if (resetBtn) resetBtn.addEventListener('click', resetCount);

document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => setPresetCount(parseInt(btn.dataset.count)));
});
document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => changeType(btn.dataset.type));
});

loadData();