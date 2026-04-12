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

function initSettingsPanel() {
    let settingsBtn = document.getElementById('settingsNavBtn');
    let mobileSettingsBtn = document.getElementById('mobileSettingsBtn');
    let settingsPanel = document.getElementById('settingsPanel');
    let closeSettings = document.getElementById('closeSettingsBtn');
    
    function openSettings() {
        settingsPanel.classList.toggle('open');
    }
    
    if (settingsBtn && settingsPanel) {
        settingsBtn.addEventListener('click', (e) => { e.stopPropagation(); openSettings(); });
    }
    if (mobileSettingsBtn && settingsPanel) {
        mobileSettingsBtn.addEventListener('click', (e) => { e.stopPropagation(); openSettings(); });
    }
    if (closeSettings && settingsPanel) {
        closeSettings.addEventListener('click', () => { settingsPanel.classList.remove('open'); });
    }
    
    document.addEventListener('click', (e) => {
        if (settingsPanel && settingsPanel.classList.contains('open')) {
            if (!settingsPanel.contains(e.target) && 
                e.target !== settingsBtn && 
                e.target !== mobileSettingsBtn &&
                !settingsBtn?.contains(e.target) &&
                !mobileSettingsBtn?.contains(e.target)) {
                settingsPanel.classList.remove('open');
            }
        }
    });
}

// মোর মেনু ফাংশন
function initMoreMenu() {
    const moreMenuBtn = document.getElementById('moreMenuBtn');
    const moreMenuPanel = document.getElementById('moreMenuPanel');
    const closeMoreMenu = document.getElementById('closeMoreMenuBtn');
    
    if (moreMenuBtn && moreMenuPanel) {
        moreMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            moreMenuPanel.classList.toggle('open');
        });
    }
    
    if (closeMoreMenu && moreMenuPanel) {
        closeMoreMenu.addEventListener('click', () => {
            moreMenuPanel.classList.remove('open');
        });
    }
    
    document.addEventListener('click', (e) => {
        if (moreMenuPanel && moreMenuPanel.classList.contains('open')) {
            if (!moreMenuPanel.contains(e.target) && e.target !== moreMenuBtn && !moreMenuBtn?.contains(e.target)) {
                moreMenuPanel.classList.remove('open');
            }
        }
    });
}

function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .nav-item').forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath) {
            item.classList.add('active');
        } else if (item.id !== 'moreMenuBtn') {
            item.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupThemeListeners();
    initSettingsPanel();
    initMoreMenu();
    setActiveNavLink();
});
