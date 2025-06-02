// Auth state management
let authToken = localStorage.getItem('authToken');
let currentUser = null;

// Crypto functions for secure credential storage
const crypto = {
    async generateKey(password, salt) {
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);
        const saltBuffer = encoder.encode(salt);
        
        const keyMaterial = await window.crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            { name: 'PBKDF2' },
            false,
            ['deriveBits', 'deriveKey']
        );
        
        return window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: saltBuffer,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );
    },

    async encrypt(data, key) {
        const encoder = new TextEncoder();
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        
        const encrypted = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            encoder.encode(JSON.stringify(data))
        );
        
        return {
            iv: Array.from(iv),
            data: Array.from(new Uint8Array(encrypted))
        };
    },

    async decrypt(encrypted, key) {
        const decoder = new TextDecoder();
        const decrypted = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: new Uint8Array(encrypted.iv) },
            key,
            new Uint8Array(encrypted.data)
        );
        
        return JSON.parse(decoder.decode(decrypted));
    },

    // Function to securely store credentials
    async storeCredentials(email, password, remember) {
        if (!remember) return;

        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const key = await this.generateKey(password, salt);
        
        const credentials = {
            email,
            password,
            timestamp: Date.now()
        };

        const encrypted = await this.encrypt(credentials, key);
        const data = {
            salt: Array.from(salt),
            encrypted
        };

        localStorage.setItem('secureCredentials', JSON.stringify(data));
    },

    // Function to retrieve stored credentials
    async retrieveCredentials() {
        const data = localStorage.getItem('secureCredentials');
        if (!data) return null;

        try {
            const { salt, encrypted } = JSON.parse(data);
            const key = await this.generateKey(encrypted.data.join(''), new Uint8Array(salt));
            const credentials = await this.decrypt(encrypted, key);

            // Check if credentials are not expired (30 days)
            if (Date.now() - credentials.timestamp > 30 * 24 * 60 * 60 * 1000) {
                localStorage.removeItem('secureCredentials');
                return null;
            }

            return credentials;
        } catch (error) {
            console.error('Failed to retrieve credentials:', error);
            localStorage.removeItem('secureCredentials');
            return null;
        }
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    let publicIP = '';
    let countryCode = '';
    
    // Fetch IP and location info
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        publicIP = data.ip;
        
        // Get country info
        const geoResponse = await fetch(`https://ipapi.co/${publicIP}/json/`);
        const geoData = await geoResponse.json();
        countryCode = geoData.country_code.toLowerCase();
        
        updateDomainPreview(countryCode);
    } catch (error) {
        console.error('Failed to fetch location:', error);
        updateDomainPreview('com');
    }

    // Check if user is already logged in
    if (authToken) {
        try {
            await fetchUserProfile();
            redirectToDashboard();
        } catch (error) {
            console.error('Session expired:', error);
            logout();
        }
    }

    // Username preview handling
    const usernameInput = document.getElementById('register-username');
    usernameInput?.addEventListener('input', (e) => {
        const username = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
        updateUsernamePreview(username);
    });

    // Generate and display password suggestions
    generatePasswordSuggestions();

    async function fetchUserProfile() {
        const response = await fetch('/api/auth/profile', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }
        
        currentUser = await response.json();
        return currentUser;
    }

    // Username input handler
    const registerName = document.getElementById('register-name');
    registerName?.addEventListener('input', (e) => {
        updateEmailPreview(e.target.value);
    });

    // Login form handler
    const loginForm = document.getElementById('login-form');
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const remember = document.getElementById('remember').checked;

        await attemptLogin(email, password, remember);
    });

    // Centralized login function    async function attemptLogin(email, password, remember) {
        try {
            // Check if the server is reachable first
            try {
                await fetch('/api/health');
            } catch (networkError) {
                throw new Error('Unable to connect to server. Please check your internet connection.');
            }

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                throw new Error('Server connection failed. Please try again.');
            }
            
            if (!response.ok) {
                throw new Error(data.msg || 'Login failed');

            // Store credentials securely if remember me is checked
            await crypto.storeCredentials(email, password, remember);

            // Store token and redirect
            localStorage.setItem('authToken', data.token);
            authToken = data.token;
            await fetchUserProfile();
            redirectToDashboard();
        } catch (error) {
            showError('login-error', error.message);
        }
    }

    // Registration form handler
    const registerForm = document.getElementById('register-form');
    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        if (password !== confirmPassword) {
            showError('register-error', 'Passwords do not match');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.msg || 'Registration failed');
            }

            // Store user data locally
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('localUserData', JSON.stringify({
                email: email,
                name: name,
                createdAt: new Date().toISOString(),
                isMainDevice: false,
                deviceId: generateDeviceId()
            }));
            authToken = data.token;

            // Automatically store credentials for new registrations
            await crypto.storeCredentials(email, password, true);
            
            // Show setup recommendation modal
            showSetupRecommendationModal(email, publicIP);
            
            await fetchUserProfile();
        } catch (error) {
            showError('register-error', error.message);
        }
    });

    // Try automatic login with stored credentials
    const storedCredentials = await crypto.retrieveCredentials();
    if (storedCredentials && !authToken) {
        const { email, password } = storedCredentials;
        await attemptLogin(email, password, true);
    }

    // Utility functions    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            errorElement.style.opacity = '0';
            errorElement.style.animation = 'fadeIn 0.3s ease forwards';
            
            // Clear the error after 5 seconds
            setTimeout(() => {
                errorElement.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    errorElement.style.display = 'none';
                }, 300);
            }, 5000);
        }
    }

    function redirectToDashboard() {
        window.location.href = '/inbox.html';
    }

    function logout() {
        localStorage.removeItem('authToken');
        authToken = null;
        currentUser = null;
        window.location.href = '/';
    }

    function updateDomainPreview(countryCode) {
        const domainPreview = document.getElementById('domain-preview');
        if (domainPreview) {
            domainPreview.textContent = `${publicIP}.${countryCode}`;
        }
    }

    function updateUsernamePreview(username) {
        const usernamePreview = document.getElementById('username-preview');
        if (usernamePreview) {
            usernamePreview.textContent = username || 'username';
        }
    }    function generatePasswordSuggestions() {
        const suggestions = document.getElementById('password-suggestions');
        if (!suggestions) return;

        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const special = '!@#$%^&*';
        
        function generateStrongPassword() {
            // Ensure at least one of each type
            let password = [
                lowercase[Math.floor(Math.random() * lowercase.length)],
                uppercase[Math.floor(Math.random() * uppercase.length)],
                numbers[Math.floor(Math.random() * numbers.length)],
                special[Math.floor(Math.random() * special.length)]
            ];

            // Add 8 more random characters
            const allChars = lowercase + uppercase + numbers + special;
            for (let i = 0; i < 8; i++) {
                password.push(allChars[Math.floor(Math.random() * allChars.length)]);
            }

            // Shuffle the password
            return password.sort(() => Math.random() - 0.5).join('');
        }        // Generiere passende Farben für Buttons auf weißem Hintergrund
        function generateDistinctColors(count) {
            const colors = [];
            
            // Basis-Farben (kühlere, moderne Farbtöne)
            const baseColors = [
                { h: 210, s: 85, l: 45 }, // Blau
                { h: 150, s: 85, l: 35 }, // Grün
                { h: 280, s: 85, l: 45 }  // Violett
            ];
            
            for (let i = 0; i < count; i++) {
                const color = baseColors[i];
                // Leichte Variation in Sättigung und Helligkeit für Interesse
                const saturation = color.s + (Math.random() * 10 - 5);
                const lightness = color.l + (Math.random() * 10 - 5);
                colors.push(`hsl(${color.h}, ${saturation}%, ${lightness}%)`);
            }
            
            return colors;
        }
        
        const distinctColors = generateDistinctColors(3);
          suggestions.innerHTML = Array.from({ length: 3 }, (_, index) => {
            const password = generateStrongPassword();
            return `
                <div class="password-suggestion" 
                     onclick="selectPassword('${password}')"
                     style="background: ${distinctColors[index]}; 
                            color: white; 
                            border: none;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            margin: 4px;
                            transition: transform 0.2s ease, box-shadow 0.2s ease;">
                    <i class="fas fa-key"></i>
                    ${password}
                </div>
            `;
        }).join('');
    }    // Password suggestion click handler
    window.selectPassword = function(password) {
        const passwordInput = document.getElementById('register-password');
        const confirmInput = document.getElementById('register-confirm-password');
        if (passwordInput) {
            passwordInput.value = password;
            if (confirmInput) {
                confirmInput.value = password;
            }
            updatePasswordStrength(password);
        }
    }    // Toggle password visibility
    document.addEventListener('click', function(e) {
        if (e.target.closest('.toggle-password')) {
            e.preventDefault();
            const btn = e.target.closest('.toggle-password');
            const container = btn.closest('.input-icon');
            const input = container.querySelector('input[type="password"], input[type="text"]');
            const icon = btn.querySelector('i');
            
            if (!input) return;
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        }
    });

    // Update password strength indicator
    const passwordInput = document.getElementById('register-password');
    passwordInput?.addEventListener('input', (e) => {
        const password = e.target.value;
        updatePasswordStrength(password);
    });

    function updatePasswordStrength(password) {
        const strengthIndicator = document.getElementById('password-strength');
        if (!strengthIndicator) return;

        const hasLetters = /[a-zA-Z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecials = /[^a-zA-Z0-9]/.test(password);
        const length = password.length;

        let strength = 'weak';
        if (length >= 8 && hasLetters && hasNumbers) {
            strength = 'medium';
        }
        if (length >= 10 && hasLetters && hasNumbers && hasSpecials) {
            strength = 'strong';
        }

        strengthIndicator.setAttribute('data-strength', strength);
    }

    // Tab switching logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Update button states
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.style.backgroundColor = 'rgba(74, 144, 226, 0.1)';
            });
            btn.classList.add('active');
            btn.style.backgroundColor = 'var(--primary-color)';
            
            // Hide all forms first
            forms.forEach(form => {
                form.style.display = 'none';
                form.classList.remove('active');
            });
            
            // Show the target form
            const targetForm = document.getElementById(`${targetTab}-form`);
            if (targetForm) {
                targetForm.style.display = 'block';
                // Use setTimeout to ensure display:block has taken effect
                setTimeout(() => {
                    targetForm.classList.add('active');
                }, 50);
            }
        });
    });

    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab-btn');
    const loginButton = document.querySelector('.tab-btn[data-tab="login"]');
    const registerButton = document.querySelector('.tab-btn[data-tab="register"]');

    // Update button text based on current tab
    const updateButtonText = () => {
        loginButton.innerHTML = loginForm.classList.contains('active') ? 
            `<i class="fas fa-user-plus"></i><span>Switch to Register</span>` :
            `<i class="fas fa-sign-in-alt"></i><span>Switch to Login</span>`;
        registerButton.innerHTML = registerForm.classList.contains('active') ? 
            `<i class="fas fa-sign-in-alt"></i><span>Switch to Login</span>` :
            `<i class="fas fa-user-plus"></i><span>Switch to Register</span>`;
    };

    // Initialize button text
    updateButtonText();

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Toggle form visibility
            if (tab.dataset.tab === 'login') {
                loginForm.classList.add('active');
                registerForm.classList.remove('active');
            } else {
                registerForm.classList.add('active');
                loginForm.classList.remove('active');
            }

            // Update button text after switching
            updateButtonText();
        });
    });

    const switchButton = document.querySelector('.tab-btn[data-tab="login"]');
    let isLoginView = true;

    // Initialize the UI
    loginForm.classList.add('active');
    registerForm.classList.remove('active');

    // Handle tab switching
    switchButton.addEventListener('click', () => {
        isLoginView = !isLoginView;
        
        if (isLoginView) {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
            switchButton.innerHTML = '<i class="fas fa-user-plus"></i><span>Switch to Register</span>';
        } else {
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
            switchButton.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>Switch to Login</span>';
        }
    });

    // Form switching functionality
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const switchButton = document.getElementById('form-switch');
    let isLoginView = true;

    // Handle form switching
    switchButton?.addEventListener('click', () => {
        isLoginView = !isLoginView;
        
        // Toggle form visibility with animation
        if (isLoginView) {
            registerForm.style.opacity = '0';
            registerForm.style.transform = 'translateY(20px)';
            setTimeout(() => {
                registerForm.classList.remove('active');
                loginForm.classList.add('active');
                loginForm.style.display = 'block';
                // Force reflow
                loginForm.offsetHeight;
                loginForm.style.opacity = '1';
                loginForm.style.transform = 'translateY(0)';
            }, 300);
            switchButton.innerHTML = '<i class="fas fa-user-plus"></i><span>Switch to Register</span>';
        } else {
            loginForm.style.opacity = '0';
            loginForm.style.transform = 'translateY(20px)';
            setTimeout(() => {
                loginForm.classList.remove('active');
                registerForm.classList.add('active');
                registerForm.style.display = 'block';
                // Force reflow
                registerForm.offsetHeight;
                registerForm.style.opacity = '1';
                registerForm.style.transform = 'translateY(0)';
            }, 300);
            switchButton.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>Switch to Login</span>';
        }
    });
});

function generateDeviceId() {
        return 'device_' + Math.random().toString(36).substr(2, 9);
    }

    function showSetupRecommendationModal(email, ip) {
        const modal = document.createElement('div');
        modal.className = 'setup-modal';
        modal.innerHTML = `
            <div class="setup-modal-content">
                <h2>Important Setup Recommendation</h2>
                <p>To ensure the best experience with Psychon's MyMail, we recommend:</p>
                
                <div class="setup-steps">
                    <div class="setup-step">
                        <i class="fas fa-desktop"></i>
                        <h3>Make this your main email device</h3>
                        <p>Current IP: ${ip}</p>
                        <button class="btn-primary set-main-device">Set as Main Device</button>
                    </div>

                    <div class="setup-step">
                        <i class="fas fa-network-wired"></i>
                        <h3>Configure Static IP</h3>
                        <p>Configure your router to always assign this IP to this device</p>
                        <div class="router-links">
                            <h4>Router Setup Guides:</h4>
                            <a href="https://www.speedport.de/hilfe/article/ip-reservation" target="_blank">
                                <i class="fas fa-router"></i> Speedport Router
                            </a>
                            <a href="https://fritz.box/help/ip-reservation" target="_blank">
                                <i class="fas fa-router"></i> FRITZ!Box
                            </a>
                            <a href="https://www.tp-link.com/support/ip-reservation" target="_blank">
                                <i class="fas fa-router"></i> TP-Link
                            </a>
                            <a href="https://kb.netgear.com/ip-reservation" target="_blank">
                                <i class="fas fa-router"></i> Netgear
                            </a>
                        </div>
                    </div>
                </div>

                <div class="setup-actions">
                    <button class="btn-secondary setup-later">Remind me Later</button>
                    <button class="btn-primary setup-done">Done</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event handlers
        modal.querySelector('.set-main-device').addEventListener('click', () => {
            const userData = JSON.parse(localStorage.getItem('localUserData'));
            userData.isMainDevice = true;
            localStorage.setItem('localUserData', JSON.stringify(userData));
            modal.querySelector('.set-main-device').textContent = '✓ Set as Main Device';
            modal.querySelector('.set-main-device').disabled = true;
        });

        modal.querySelector('.setup-later').addEventListener('click', () => {
            modal.remove();
            redirectToDashboard();
        });

        modal.querySelector('.setup-done').addEventListener('click', () => {
            modal.remove();
            redirectToDashboard();
        });
    }