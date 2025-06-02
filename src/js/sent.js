document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Display user email
    document.getElementById('user-email').textContent = currentUser.email;

    // Load sent emails
    loadSentEmails();

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
    document.getElementById('compose-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const to = document.getElementById('compose-to').value;
        const subject = document.getElementById('compose-subject').value;
        const body = document.getElementById('compose-body').value;

        // Check if sending to external email
        if (to.includes('@')) {
            try {
                // Send email using server API
                const response = await fetch('http://localhost:3000/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        to,
                        subject,
                        body,
                        from: currentUser.email
                    })
                });

                const result = await response.json();
                if (!result.success) {
                    throw new Error(result.message);
                }

                // Save to sent folder
                saveToSentFolder(to, subject, body);
                showMessage('Email sent successfully!', 'success');
            } catch (error) {
                showMessage('Failed to send email: ' + error.message, 'error');
            }
        } else {
            // Handle internal emails
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const recipient = users.find(u => u.email === to);
            
            if (!recipient) {
                showMessage('Recipient not found!', 'error');
                return;
            }

            // Save to recipient's inbox
            saveToInbox(to, subject, body);
            // Save to sender's sent folder
            saveToSentFolder(to, subject, body);
            showMessage('Email sent successfully!', 'success');
        }

        modal.style.display = 'none';
        e.target.reset();
        loadSentEmails();
    });

    // Save Draft functionality
    document.getElementById('save-draft').addEventListener('click', () => {
        const to = document.getElementById('compose-to').value;
        const subject = document.getElementById('compose-subject').value;
        const body = document.getElementById('compose-body').value;

        saveToDrafts(to, subject, body);
        modal.style.display = 'none';
        showMessage('Draft saved successfully!', 'success');
    });
});

function loadSentEmails() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === currentUser.email);
    const sentEmails = user.sent || [];

    const container = document.getElementById('sent-emails');
    
    if (sentEmails.length === 0) {
        container.innerHTML = '<div class="no-emails">No sent emails</div>';
        return;
    }

    container.innerHTML = sentEmails.map((email, index) => `
        <div class="email" data-index="${index}">
            <div class="email-header">
                <span class="email-to">To: ${email.to}</span>
                <span class="email-date">${new Date(email.date).toLocaleString()}</span>
            </div>
            <div class="email-subject">${email.subject}</div>
            <div class="email-preview">${email.body.substring(0, 100)}...</div>
        </div>
    `).join('');
}

function saveToSentFolder(to, subject, body) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);

    const email = {
        to,
        subject,
        body,
        date: new Date().toISOString()
    };

    if (!users[userIndex].sent) {
        users[userIndex].sent = [];
    }

    users[userIndex].sent.unshift(email);
    localStorage.setItem('users', JSON.stringify(users));

    // Update current user
    currentUser.sent = users[userIndex].sent;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function showMessage(text, type) {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}