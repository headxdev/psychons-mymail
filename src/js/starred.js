document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    loadStarredEmails();
});

function loadStarredEmails() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const starredEmails = currentUser.starred || [];
    const container = document.getElementById('starred-container');

    if (starredEmails.length === 0) {
        container.innerHTML = '<div class="no-emails">No starred emails</div>';
        return;
    }

    container.innerHTML = starredEmails.map((email, index) => `
        <div class="email starred" data-index="${index}">
            <div class="email-header">
                <span class="email-from">${email.from}</span>
                <button class="star-btn active">
                    <i class="fas fa-star"></i>
                </button>
            </div>
            <div class="email-subject">${email.subject}</div>
            <div class="email-preview">${email.body.substring(0, 100)}...</div>
            <div class="email-date">${new Date(email.date).toLocaleString()}</div>
        </div>
    `).join('');

    // Add star toggle handlers
    document.querySelectorAll('.star-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const emailIndex = e.target.closest('.starred').dataset.index;
            unstarEmail(emailIndex);
        });
    });
}

function unstarEmail(index) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const email = currentUser.starred[index];
    
    // Remove from starred
    currentUser.starred.splice(index, 1);
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    users[userIndex] = currentUser;
    localStorage.setItem('users', JSON.stringify(users));

    // Reload starred emails
    loadStarredEmails();
}