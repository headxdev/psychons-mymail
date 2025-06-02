:root {t.addEventListener('DOMContentLoaded', () => {
    --primary-color: #4a90e2;t.getElementById('login-form');
    --secondary-color: #2ecc71;nt.getElementById('register-form');
    --error-color: #e74c3c;t.querySelectorAll('.tab-btn');
    --success-color: #27ae60;
    --bg-color: #f5f5f5;h animation
    --text-color: #333; => {
}       btn.addEventListener('click', () => {
            // Remove active class from all tabs and forms
* {         tabBtns.forEach(b => b.classList.remove('active'));
    margin: 0;cument.querySelectorAll('.auth-form').forEach(form => {
    padding: 0; form.classList.remove('active');
    box-sizing: border-box;display = 'none';
    transition: all 0.3s ease;
}
            // Add active class to clicked tab
body {      btn.classList.add('active');
    font-family: 'Segoe UI', sans-serif;
    background: var(--bg-color);m with animation
    min-height: 100vh;ctedForm = document.getElementById(`${btn.dataset.tab}-form`);
}           selectedForm.style.display = 'block';
            setTimeout(() => selectedForm.classList.add('active'), 50);
header {});
    background: var(--primary-color);
    padding: 1rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}   registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
header nav h1 {
    color: white;e = document.getElementById('register-name').value.trim();
    text-align: center;ocument.getElementById('register-email').value.trim();
    font-size: 2rem;rd = document.getElementById('register-password').value;
}       const confirm = document.getElementById('register-confirm').value;

.auth-container {tion
    max-width: 500px;!email || !password || !confirm) {
    margin: 2rem auto;e('All fields are required!', 'error');
    padding: 2rem;;
}       }

.auth-box {(password !== confirm) {
    background: white;e('Passwords do not match!', 'error');
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    overflow: hidden;
    transform: translateY(0); 6) {
    transition: transform 0.3s ease;st be at least 6 characters!', 'error');
}           return;
        }
.auth-box:hover {
    transform: translateY(-5px); initialize empty array
}       const users = JSON.parse(localStorage.getItem('users') || '[]');
        
.tabs { // Check if email already exists
    display: flex;some(user => user.email === email)) {
    border-bottom: 2px solid #eee;eady registered!', 'error');
}           return;
        }
.tab-btn {
    flex: 1;dd new user
    padding: 1rem;({
    border: none;
    background: none;
    font-size: 1.1rem;
    cursor: pointer;],
    position: relative;
    overflow: hidden;: new Date().toISOString()
}       });

.tab-btn::after {age.setItem('users', JSON.stringify(users));
    content: '';age('Registration successful!', 'success');
    position: absolute;
    bottom: 0;ar form
    left: 50%;erForm.reset();
    width: 0;
    height: 3px;h to login tab after short delay
    background: var(--primary-color);
    transition: all 0.3s ease;ctor('[data-tab="login"]').click();
    transform: translateX(-50%);
}   });

.tab-btn.active::after {
    width: 100%;dEventListener('submit', (e) => {
}       e.preventDefault();

.tab-btn[data-tab="login"].active {lementById('login-email').value.trim();
    color: var(--primary-color);t.getElementById('login-password').value;
}
        if (!email || !password) {
.tab-btn[data-tab="register"].active {both email and password!', 'error');
    color: var(--secondary-color);
}       }

.auth-form {t users = JSON.parse(localStorage.getItem('users') || '[]');
    display: none; = users.find(u => u.email === email && u.password === password);
    padding: 2rem;
    opacity: 0;r) {
    transform: translateY(20px);uccessful!', 'success');
}           localStorage.setItem('currentUser', JSON.stringify(user));
            
.auth-form.active {rect to inbox after success message
    display: block;out(() => {
    animation: slideIn 0.5s forwards;= 'inbox.html';
}           }, 1000);
        } else {
@keyframes slideIn {age('Invalid email or password!', 'error');
    to {}
        opacity: 1;
        transform: translateY(0);
    }unction showMessage(text, type) {
}       // Remove existing messages
        const existingMessage = document.querySelector('.message');
.form-group {xistingMessage) {
    margin-bottom: 1.5rem;e.remove();
}       }

.form-group label {ge = document.createElement('div');
    display: block;ssName = `message ${type}`;
    margin-bottom: 0.5rem;t = text;
    color: var(--text-color);
}       document.querySelector('.auth-container').appendChild(message);
        
.form-group input {ove message after 3 seconds
    width: 100%;ut(() => {
    padding: 0.8rem;style.opacity = '0';
    border: 2px solid #eee;> message.remove(), 300);
    border-radius: 5px;
    font-size: 1rem;
    transition: all 0.3s ease;}#login-form input:focus {    border-color: var(--primary-color);    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);}#register-form input:focus {    border-color: var(--secondary-color);    box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1);}.btn-primary {    width: 100%;    padding: 1rem;    border: none;    border-radius: 5px;    font-size: 1.1rem;    font-weight: bold;    cursor: pointer;    transition: all 0.3s ease;}#login-form .btn-primary {    background: var(--primary-color);    color: white;}#login-form .btn-primary:hover {    background: #357abd;    transform: translateY(-2px);}#register-form .btn-primary {    background: var(--secondary-color);    color: white;}#register-form .btn-primary:hover {    background: #27ae60;    transform: translateY(-2px);}.message {    padding: 1rem;    margin-top: 1rem;    border-radius: 5px;    text-align: center;    animation: fadeIn 0.3s ease;}@keyframes fadeIn {    from { opacity: 0; transform: translateY(-10px); }    to { opacity: 1; transform: translateY(0); }}.message.error {    background: var(--error-color);    color: white;}.message.success {    background: var(--success-color);    color: white;}footer {    text-align: center;    padding: 1rem;    color: #666;    margin-top: 2rem;}/* Email inbox styles */.email-container {    display: flex;    height: calc(100vh - 60px);}.sidebar {    width: 200px;    background: white;    padding: 1rem;    border-right: 1px solid #eee;}.email-list {    flex: 1;    padding: 1rem;    overflow-y: auto;}.email {    background: white;    padding: 1rem;    margin-bottom: 1rem;    border-radius: 5px;    cursor: pointer;}function setupEmailSuggestions() {
    const emailInput = document.getElementById('login-email');
    const suggestionsContainer = document.getElementById('email-suggestions');
    
    // Sample suggestions (you can modify these)
    const suggestions = [
        'info',
        'admin',
        'support',
        'contact',
        'mail'
    ];

    emailInput.addEventListener('focus', () => {
        const publicIP = localStorage.getItem('publicIP') || '0.0.0.0';
        const suggestionElements = suggestions.map(suggestion => {
            const email = `${suggestion}@${publicIP}.de`;
            return `
                <div class="suggestion-item" data-email="${email}">
                    <span>${email}</span>
                    <i class="fas fa-copy copy-icon"></i>
                </div>
            `;
        }).join('');

        suggestionsContainer.innerHTML = suggestionElements;
        suggestionsContainer.classList.add('active');
    });

    emailInput.addEventListener('blur', () => {
        // Delay hiding suggestions to allow for clicking
        setTimeout(() => {
            suggestionsContainer.classList.remove('active');
        }, 200);
    });

    // Handle suggestion clicks
    suggestionsContainer.addEventListener('click', (e) => {
        const suggestionItem = e.target.closest('.suggestion-item');
        if (!suggestionItem) return;

        const email = suggestionItem.dataset.email;
        
        // Fill input
        emailInput.value = email.split('@')[0];
        
        // Copy to clipboard
        navigator.clipboard.writeText(email).then(() => {
            showCopiedTooltip(e);
        });
    });
}

function showCopiedTooltip(event) {
    const tooltip = document.createElement('div');
    tooltip.className = 'copied-tooltip';
    tooltip.textContent = 'Copied to clipboard!';
    
    // Position tooltip near the click
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY - 30}px`;
    
    document.body.appendChild(tooltip);
    
    // Remove tooltip after animation
    setTimeout(() => tooltip.remove(), 1500);
}

// Call setupEmailSuggestions in your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    // ...existing code...
    setupEmailSuggestions();
});