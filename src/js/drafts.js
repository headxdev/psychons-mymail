document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    loadDrafts();

    // Delete all drafts
    document.getElementById('delete-all').addEventListener('click', () => {
        if (confirm('Delete all drafts?')) {
            clearDrafts();
            loadDrafts();
        }
    });
});

function loadDrafts() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const drafts = currentUser.drafts || [];
    const container = document.getElementById('drafts-container');

    if (drafts.length === 0) {
        container.innerHTML = '<div class="no-emails">No drafts found</div>';
        return;
    }

    container.innerHTML = drafts.map((draft, index) => `
        <div class="email draft" data-index="${index}">
            <div class="email-header">
                <span class="email-to">To: ${draft.to || 'No recipient'}</span>
                <span class="email-date">Last edited: ${new Date(draft.lastEdited).toLocaleString()}</span>
            </div>
            <div class="email-subject">${draft.subject || 'No subject'}</div>
            <div class="email-preview">${draft.body.substring(0, 100) || 'No content'}...</div>
            <div class="draft-actions">
                <button class="btn-primary edit-draft">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-danger delete-draft">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');

    // Add click handlers for draft actions
    attachDraftHandlers();
}

function attachDraftHandlers() {
    document.querySelectorAll('.edit-draft').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const draftIndex = e.target.closest('.draft').dataset.index;
            editDraft(draftIndex);
        });
    });

    document.querySelectorAll('.delete-draft').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const draftIndex = e.target.closest('.draft').dataset.index;
            deleteDraft(draftIndex);
        });
    });
}

function editDraft(index) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const draft = currentUser.drafts[index];
    
    // Open compose modal with draft content
    const composeModal = document.getElementById('compose-modal');
    document.getElementById('compose-to').value = draft.to || '';
    document.getElementById('compose-subject').value = draft.subject || '';
    document.getElementById('compose-body').value = draft.body || '';
    
    composeModal.style.display = 'block';
}

function deleteDraft(index) {
    if (!confirm('Delete this draft?')) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.drafts.splice(index, 1);
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    users[userIndex] = currentUser;
    localStorage.setItem('users', JSON.stringify(users));

    // Reload drafts
    loadDrafts();
}

function clearDrafts() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.drafts = [];
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    users[userIndex] = currentUser;
    localStorage.setItem('users', JSON.stringify(users));
}