// Background image handling
document.addEventListener('DOMContentLoaded', () => {
    const uploadButtons = document.querySelectorAll('.upload-bg');
    
    uploadButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Create a hidden file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/webp'; // Only accept WebP images
            fileInput.style.display = 'none';
            
            // Add file input to document and trigger click
            document.body.appendChild(fileInput);
            fileInput.click();
            
            // Handle file selection
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                // Validate file type
                if (file.type !== 'image/webp') {
                    alert('Please select a WebP image file. Other formats are not supported.');
                    return;
                }
                
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('Image file is too large. Maximum size is 5MB.');
                    return;
                }
                
                try {
                    const target = button.dataset.target; // 'login' or 'app'
                    const fileName = `custom-${Date.now()}.webp`;
                    
                    // Here you would typically upload the file to your server
                    // For now, we'll just update the UI
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        // Create new preview
                        const bgSelector = document.getElementById(`${target}-bg-selector`);
                        const previews = bgSelector.querySelectorAll('.bg-preview');
                        
                        // Remove current selection
                        previews.forEach(p => p.classList.remove('current'));
                        
                        // Create new preview element
                        const newPreview = document.createElement('div');
                        newPreview.className = 'bg-preview current';
                        newPreview.dataset.bg = fileName;
                        
                        newPreview.innerHTML = `
                            <img src="${e.target.result}" alt="Custom Background">
                            <span class="bg-label">Custom</span>
                        `;
                        
                        // Add before the upload button
                        button.parentNode.insertBefore(newPreview, button);
                        
                        // Update CSS variable
                        document.documentElement.style.setProperty(
                            `--${target}-bg`,
                            `url(${e.target.result})`
                        );
                    };
                    reader.readAsDataURL(file);
                    
                } catch (error) {
                    console.error('Error handling file:', error);
                    alert('There was an error processing your image. Please try again.');
                }
                
                // Clean up
                document.body.removeChild(fileInput);
            });
        });
    });
    
    // Handle background selection
    document.querySelectorAll('.background-selector').forEach(selector => {
        selector.addEventListener('click', (e) => {
            const preview = e.target.closest('.bg-preview');
            if (!preview) return;
            
            // Update selection
            const allPreviews = selector.querySelectorAll('.bg-preview');
            allPreviews.forEach(p => p.classList.remove('current'));
            preview.classList.add('current');
            
            // Update background
            const target = selector.id.replace('-bg-selector', '');
            const bgPath = preview.dataset.bg;
            document.documentElement.style.setProperty(
                `--${target}-bg`,
                `url(/backgrounds/${target}/${bgPath})`
            );
        });
    });
});
