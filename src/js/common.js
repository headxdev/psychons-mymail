<aside class="sidebar">n() {
    <div class="account-switcher">t-btn').addEventListener('click', () => {
        <div class="current-account" id="current-account">
            <img src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp" alt="Account" class="account-avatar">
            <span class="account-email"></span>
            <i class="fas fa-chevron-down"></i>
        </div>etElementById('settings-btn').addEventListener('click', () => {
        <div class="account-list" id="account-list">
            <!-- Will be populated dynamically -->
        </div>
    </div>ly user settings on page load
    applyUserSettings();
    <button id="compose-btn" class="compose-btn">
        <i class="fas fa-plus"></i> New Email
    </button>Notification(message, type = 'info') {
    const notification = document.createElement('div');
    <div class="sidebar-section">ification ${type}`;
        <h3 class="section-title">Main</h3>
        <nav class="folder-nav">tification);
            <ul>
                <li> {
                    <a href="inbox.html" class="nav-link" data-page="inbox">
                        <i class="fas fa-inbox"></i> Inbox
                        <span class="badge">0</span>
                    </a>
                </li>tings() {
                <li>r = JSON.parse(localStorage.getItem('currentUser'));
                    <a href="sent.html" class="nav-link" data-page="sent">
                        <i class="fas fa-paper-plane"></i> Sentr.settings;
                    </a>tElement.setAttribute('data-theme', theme);
                </li>eme(colorScheme);
                <li>y.setAttribute('data-display', emailDisplay);
                    <a href="drafts.html" class="nav-link" data-page="drafts">
                        <i class="fas fa-file"></i> Drafts
                    </a>
                </li>g */
            </ul>
        </nav>rem;
    </div>-bottom: 1px solid var(--border-color);
    display: flex;
    <div class="sidebar-section">
        <h3 class="section-title">Labels</h3>
        <nav class="folder-nav">
            <ul>all 0.3s ease;
                <li>--surface-color);
                    <a href="starred.html" class="nav-link" data-page="starred">
                        <i class="fas fa-star"></i> Starred
                    </a>
                </li>74, 144, 226, 0.05);
                <li>
                    <a href="important.html" class="nav-link" data-page="important">
                        <i class="fas fa-exclamation"></i> Important
                    </a>
                </li>74, 144, 226, 0.02);
            </ul>
        </nav>
    </div>tent {
    flex: 1;
    <div class="sidebar-section">
        <h3 class="section-title">Other</h3>
        <nav class="folder-nav">
            <ul>m: 0.5rem;
                <li>
                    <a href="spam.html" class="nav-link" data-page="spam">
                        <i class="fas fa-ban"></i> Spam
                    </a>
                </li>;
                <li>
                    <a href="trash.html" class="nav-link" data-page="trash">
                        <i class="fas fa-trash"></i> Trash
                    </a>
                </li>;
            </ul>
        </nav>
    </div>    </div>    </div>/* Notification styling */styling */
</aside>    z-index: 1000;r {
}   background: var(--error-color);
}
.notification.error {
    background: var(--error-color);
}   background: var(--success-color);
}
.notification.success {
    background: var(--success-color);Loaded', () => {
}   const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;r settings
    }oadUserSettings();

    // Load user settings
    loadUserSettings();torAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
    // Theme toggleheme = btn.dataset.theme;
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            updateUserSetting('theme', theme);
            applyTheme(theme);
        });r scheme
    });ument.getElementById('color-scheme').addEventListener('change', (e) => {
        updateUserSetting('colorScheme', e.target.value);
    // Color schemecheme(e.target.value);
    document.getElementById('color-scheme').addEventListener('change', (e) => {
        updateUserSetting('colorScheme', e.target.value);
        applyColorScheme(e.target.value);
    });ument.getElementById('language').addEventListener('change', (e) => {
        updateUserSetting('language', e.target.value);
    // Languagenguage(e.target.value);
    document.getElementById('language').addEventListener('change', (e) => {
        updateUserSetting('language', e.target.value);
        applyLanguage(e.target.value);
    });ument.getElementById('email-display').addEventListener('change', (e) => {
        updateUserSetting('emailDisplay', e.target.value);
    // Email displaysplay(e.target.value);
    document.getElementById('email-display').addEventListener('change', (e) => {
        updateUserSetting('emailDisplay', e.target.value);
        applyEmailDisplay(e.target.value);
    });ument.getElementById('notifications').addEventListener('change', (e) => {
        updateUserSetting('notifications', e.target.checked);
    // Notifications.checked) {
    document.getElementById('notifications').addEventListener('change', (e) => {
        updateUserSetting('notifications', e.target.checked);
        if (e.target.checked) {
            requestNotificationPermission();
        }ck button
    });ument.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = 'inbox.html';
    // Back button
    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = 'inbox.html';
    });n loadUserSettings() {
}); const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const settings = currentUser.settings || getDefaultSettings();
function loadUserSettings() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const settings = currentUser.settings || getDefaultSettings();
    applyColorScheme(settings.colorScheme);
    // Apply settingstings.language);
    applyTheme(settings.theme);emailDisplay);
    applyColorScheme(settings.colorScheme);
    applyLanguage(settings.language);
    applyEmailDisplay(settings.emailDisplay);ttings.theme}"]`).classList.add('active');
    document.getElementById('color-scheme').value = settings.colorScheme;
    // Update UIElementById('language').value = settings.language;
    document.querySelector(`[data-theme="${settings.theme}"]`).classList.add('active');
    document.getElementById('color-scheme').value = settings.colorScheme;ions;
    document.getElementById('language').value = settings.language;
    document.getElementById('email-display').value = settings.emailDisplay;
    document.getElementById('notifications').checked = settings.notifications;
}   const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
function updateUserSettings(settings) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');mail);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.settings = settings;
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    users[userIndex].settings = settings;ringify(users));
    currentUser.settings = settings;r', JSON.stringify(currentUser));
}
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}   const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const settings = currentUser.settings || getDefaultSettings();
function updateUserSetting(key, value) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const settings = currentUser.settings || getDefaultSettings();
    settings[key] = value;
    updateUserSettings(settings);
}   return {
        theme: 'light',
function getDefaultSettings() {
    return {uage: 'en',
        theme: 'light',comfortable',
        colorScheme: 'blue',
        language: 'en',
        emailDisplay: 'comfortable',
        notifications: false
    };on applyTheme(theme) {
}   document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-btn').forEach(btn => {
function applyTheme(theme) {('active', btn.dataset.theme === theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });n applyColorScheme(scheme) {
}   const colors = {
        blue: { primary: '#4a90e2', secondary: '#357abd' },
function applyColorScheme(scheme) {, secondary: '#27ae60' },
    const colors = {imary: '#9b59b6', secondary: '#8e44ad' },
        blue: { primary: '#4a90e2', secondary: '#357abd' },}
        green: { primary: '#2ecc71', secondary: '#27ae60' },
        purple: { primary: '#9b59b6', secondary: '#8e44ad' },
        orange: { primary: '#e67e22', secondary: '#d35400' }lor', colors[scheme].primary);
    };cument.documentElement.style.setProperty('--secondary-color', colors[scheme].secondary);
}
    document.documentElement.style.setProperty('--primary-color', colors[scheme].primary);
    document.documentElement.style.setProperty('--secondary-color', colors[scheme].secondary);
}   try {
        const permission = await Notification.requestPermission();
async function requestNotificationPermission() {
    try {   updateUserSetting('notifications', false);
        const permission = await Notification.requestPermission();se;
        if (permission !== 'granted') {
            updateUserSetting('notifications', false);
            document.getElementById('notifications').checked = false;
        }pdateUserSetting('notifications', false);
    } catch (error) {lementById('notifications').checked = false;
        console.error('Notification permission error:', error);
        updateUserSetting('notifications', false);        document.getElementById('notifications').checked = false;    }}

function setupAccountSwitcher() {
    const currentAccount = document.getElementById('current-account');
    const accountList = document.getElementById('account-list');
    const loggedInUsers = JSON.parse(localStorage.getItem('loggedInUsers') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Update current account display
    currentAccount.querySelector('.account-email').textContent = currentUser.email;

    // Populate account list
    accountList.innerHTML = loggedInUsers.map(user => `
        <div class="account-item ${user.email === currentUser.email ? 'active' : ''}" 
             data-email="${user.email}">
            <img src="https://www.gravatar.com/avatar/${md5(user.email)}?d=mp" 
                 alt="${user.email}" 
                 class="account-avatar">
            <span class="account-email">${user.email}</span>
            ${user.email === currentUser.email ? 
                '<i class="fas fa-check"></i>' : ''}
        </div>
    `).join('');

    // Toggle account list
    currentAccount.addEventListener('click', () => {
        accountList.classList.toggle('active');
    });

    // Switch account
    accountList.addEventListener('click', (e) => {
        const accountItem = e.target.closest('.account-item');
        if (!accountItem) return;

        const email = accountItem.dataset.email;
        const user = loggedInUsers.find(u => u.email === email);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.reload();
        }
    });

    // Close account list when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.account-switcher')) {
            accountList.classList.remove('active');
        }
    });
}

// Add support for multiple logged-in users
function addLoggedInUser(user) {
    const loggedInUsers = JSON.parse(localStorage.getItem('loggedInUsers') || '[]');
    
    // Check if user already exists
    if (!loggedInUsers.some(u => u.email === user.email)) {
        loggedInUsers.push(user);
        localStorage.setItem('loggedInUsers', JSON.stringify(loggedInUsers));
    }
}

// Handle logout
function logout() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loggedInUsers = JSON.parse(localStorage.getItem('loggedInUsers') || '[]');
    
    // Remove user from logged in users
    const updatedUsers = loggedInUsers.filter(u => u.email !== currentUser.email);
    localStorage.setItem('loggedInUsers', JSON.stringify(updatedUsers));
    
    // If there are other logged in users, switch to the first one
    if (updatedUsers.length > 0) {
        localStorage.setItem('currentUser', JSON.stringify(updatedUsers[0]));
        window.location.reload();
    } else {
        // Otherwise, redirect to login
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}