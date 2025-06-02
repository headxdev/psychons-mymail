document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    loadTrash();

    // Empty trash handler
    document.getElementById('empty-trash').addEventListener('click', () => {
        if (confirm('Empty trash? This action cannot be undone.')) {
            emptyTrash();
            loadTrash();
        }
    });
});

function loadTrash() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const trashedEmails = currentUser.trash || [];
    const container = document.getElementById('trash-container');

    if (trashedEmails.length === 0) {
        container.innerHTML = '<div class="no-emails">Trash is empty</div>';
        return;
    }

    container.innerHTML = trashedEmails.map((email, index) => `
        <div class="email trashed" data-index="${index}">
            <div class="email-header">
                <span class="email-from">${email.from}</span>
                <div class="trash-actions">
                    <button class="btn-secondary restore-email">
                        <i class="fas fa-undo"></i> Restore
                    </button>
                    <button class="btn-danger delete-forever">
                        <i class="fas fa-trash"></i> Delete Forever
                    </button>
                </div>
            </div>
            <div class="email-subject">${email.subject}</div>
            <div class="email-preview">${email.body.substring(0, 100)}...</div>
            <div class="email-date">Deleted: ${new Date(email.deletedAt).toLocaleString()}</div>
        </div>
    `).join('');

    // Add restore and delete handlers
    attachTrashHandlers();
}

function attachTrashHandlers() {
    document.querySelectorAll('.restore-email').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const emailIndex = e.target.closest('.trashed').dataset.index;
            restoreEmail(emailIndex);
        });
    });

    document.querySelectorAll('.delete-forever').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const emailIndex = e.target.closest('.trashed').dataset.index;
            deleteForever(emailIndex);
        });
    });
}

function restoreEmail(index) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const email = currentUser.trash[index];
    
    // Remove from trash and add back to original folder
    currentUser.trash.splice(index, 1);
    if (!currentUser[email.originalFolder]) {
        currentUser[email.originalFolder] = [];
    }
    currentUser[email.originalFolder].unshift(email);
    
    updateUserData(currentUser);
    loadTrash();
}

function deleteForever(index) {
    if (!confirm('Delete this email forever? This action cannot be undone.')) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.trash.splice(index, 1);
    
    updateUserData(currentUser);
    loadTrash();
}

function emptyTrash() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.trash = [];
    
    updateUserData(currentUser);
}

function updateUserData(currentUser) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    users[userIndex] = currentUser;
    localStorage.setItem('users', JSON.stringify(users));
}