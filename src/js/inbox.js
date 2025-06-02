document.addEventListener('DOMContentLoaded', async () => {
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
        window.location.href = 'index.html';
        return;
    }

    try {
        // Fetch user profile
        const profileResponse = await fetch('/api/auth/profile', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!profileResponse.ok) {
            throw new Error('Failed to fetch profile');
        }
        
        const currentUser = await profileResponse.json();
        document.getElementById('user-email').textContent = currentUser.email;

        // Fetch inbox emails
        await loadEmails();
    } catch (error) {
        console.error('Session error:', error);
        logout();
    }

    // Logout handler
    document.getElementById('logout-btn').addEventListener('click', logout);

    function logout() {
        localStorage.removeItem('authToken');
        window.location.href = 'index.html';
    }

    // Compose modal handling
    const modal = document.getElementById('compose-modal');
    const composeBtn = document.getElementById('compose-btn');
    const closeBtn = document.querySelector('.close-btn');

    composeBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Handle compose form submission
    document.getElementById('compose-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = {
            to: document.getElementById('compose-to').value,
            subject: document.getElementById('compose-subject').value,
            body: document.getElementById('compose-body').value,
            from: currentUser.email,
            date: new Date().toISOString(),
            read: false
        };

        // Save to local storage
        saveEmail(email);
        modal.style.display = 'none';
        e.target.reset();
        loadEmails();
    });

    // Load emails on page load
    loadEmails();

    // Handle navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active class from all links
            document.querySelectorAll('.nav-link').forEach(l => 
                l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
        });
    });

    // Handle settings button
    document.getElementById('settings-btn').addEventListener('click', () => {
        window.location.href = 'settings.html';
    });

    // Update active link based on current page
    const currentPage = document.body.dataset.page;
    const activeLink = document.querySelector(`.nav-link[data-page="${currentPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
});

// Email handling functions
async function loadEmails() {
    const authToken = localStorage.getItem('authToken');
    try {
        const response = await fetch('/api/email/inbox', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch emails');
        }
        
        const emails = await response.json();
        displayEmails(emails);
    } catch (error) {
        console.error('Error loading emails:', error);
        showError('Failed to load emails');
    }
}

function displayEmails(emails) {
    const emailList = document.getElementById('email-list');
    emailList.innerHTML = '';

    if (emails.length === 0) {
        emailList.innerHTML = '<div class="no-emails">No emails in your inbox</div>';
        return;
    }

    emails.forEach(email => {
        const emailElement = createEmailElement(email);
        emailList.appendChild(emailElement);
    });
}

function createEmailElement(email) {
    const div = document.createElement('div');
    div.className = `email-item ${email.read ? 'read' : 'unread'}`;
    div.innerHTML = `
        <div class="email-actions">
            <input type="checkbox" class="email-checkbox">
            <button class="star-btn ${email.starred ? 'starred' : ''}">
                <i class="fas fa-star"></i>
            </button>
        </div>
        <div class="email-content" data-email-id="${email.id}">
            <div class="email-sender">${escapeHtml(email.from)}</div>
            <div class="email-subject">${escapeHtml(email.subject)}</div>
            <div class="email-preview">${escapeHtml(email.text.substring(0, 100))}...</div>
        </div>
        <div class="email-date">${formatDate(email.date)}</div>
    `;

    // Add event listeners
    const starBtn = div.querySelector('.star-btn');
    starBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleStar(email.id);
    });

    const emailContent = div.querySelector('.email-content');
    emailContent.addEventListener('click', () => openEmail(email.id));

    return div;
}

async function toggleStar(emailId) {
    const authToken = localStorage.getItem('authToken');
    try {
        const response = await fetch(`/api/email/${emailId}/star`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to update star status');
        }
        
        await loadEmails(); // Refresh the email list
    } catch (error) {
        console.error('Error toggling star:', error);
        showError('Failed to update star status');
    }
}

async function openEmail(emailId) {
    const authToken = localStorage.getItem('authToken');
    try {
        // Mark as read
        await fetch(`/api/email/${emailId}/read`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        // Refresh emails to update read status
        await loadEmails();
        
        // TODO: Implement email detail view
    } catch (error) {
        console.error('Error opening email:', error);
        showError('Failed to open email');
    }
}

// Compose email handling
const composeModal = document.getElementById('compose-modal');
const composeBtn = document.getElementById('compose-btn');
const closeBtn = document.querySelector('.close-btn');
const composeForm = document.getElementById('compose-form');

composeBtn.addEventListener('click', () => {
    composeModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    composeModal.style.display = 'none';
});

composeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const to = document.getElementById('compose-to').value;
    const subject = document.getElementById('compose-subject').value;
    const content = document.getElementById('compose-content').value;

    try {
        const response = await fetch('/api/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                to,
                subject,
                text: content,
                html: content // You might want to add an HTML editor later
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to send email');
        }
        
        composeModal.style.display = 'none';
        composeForm.reset();
        showSuccess('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        showError('Failed to send email');
    }
});

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showError(message) {
    // Implement error notification
    alert(message); // Replace with better UI
}

function showSuccess(message) {
    // Implement success notification
    alert(message); // Replace with better UI
}