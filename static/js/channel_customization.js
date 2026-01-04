document.addEventListener('DOMContentLoaded', function() {
    // Banner upload
    const bannerInput = document.getElementById('banner-input');
    const bannerUploadTrigger = document.getElementById('banner-upload-trigger');
    const bannerUploadArea = document.getElementById('banner-upload-area');
    
    bannerUploadTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        bannerInput.click();
    });
    
    bannerUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    bannerUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });
    
    bannerUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            bannerInput.files = e.dataTransfer.files;
            handleBannerUpload(e.dataTransfer.files[0]);
        }
    });
    
    bannerInput.addEventListener('change', function() {
        if (this.files.length) {
            handleBannerUpload(this.files[0]);
        }
    });
    
    function handleBannerUpload(file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const bannerPreview = document.querySelector('.banner-placeholder img');
                const previewBanner = document.querySelector('.preview-banner img');
                
                if (bannerPreview) {
                    bannerPreview.src = e.target.result;
                } else {
                    const bannerDiv = document.querySelector('.banner-placeholder');
                    bannerDiv.innerHTML = `<img src="${e.target.result}" alt="Channel Banner" class="w-100">`;
                }
                
                if (previewBanner) {
                    previewBanner.src = e.target.result;
                } else {
                    const previewDiv = document.querySelector('.preview-banner');
                    previewDiv.innerHTML = `<img src="${e.target.result}" alt="Banner" class="w-100">`;
                }
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Profile picture upload
    const profilePicInput = document.getElementById('profile-pic-input');
    const changeProfilePicBtn = document.getElementById('change-profile-pic');
    const removeProfilePicBtn = document.getElementById('remove-profile-pic');
    
    changeProfilePicBtn.addEventListener('click', function() {
        profilePicInput.click();
    });
    
    removeProfilePicBtn.addEventListener('click', function() {
        const profilePicDisplay = document.querySelector('.profile-pic-display');
        const previewProfilePic = document.querySelector('.preview-profile-pic img');
        
        if (profilePicDisplay) {
            profilePicDisplay.outerHTML = `
                <div class="profile-pic-placeholder rounded-circle d-flex align-items-center justify-content-center profile-pic-display">
                    <i class="fas fa-user fa-2x"></i>
                </div>
            `;
        }
        
        if (previewProfilePic) {
            previewProfilePic.outerHTML = `
                <div class="preview-profile-pic-placeholder rounded-circle d-flex align-items-center justify-content-center">
                    <i class="fas fa-user"></i>
                </div>
            `;
        }
    });
    
    profilePicInput.addEventListener('change', function() {
        if (this.files.length) {
            const file = this.files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const profilePicDisplay = document.querySelector('.profile-pic-display');
                    const previewProfilePic = document.querySelector('.preview-profile-pic img');
                    
                    if (profilePicDisplay) {
                        profilePicDisplay.outerHTML = `<img src="${e.target.result}" alt="Profile Picture" class="rounded-circle profile-pic-display">`;
                    }
                    
                    if (previewProfilePic) {
                        previewProfilePic.src = e.target.result;
                    } else {
                        const previewDiv = document.querySelector('.preview-profile-pic');
                        previewDiv.innerHTML = `<img src="${e.target.result}" alt="Profile" class="rounded-circle">`;
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    });
    
    // Channel name and handle
    const channelNameInput = document.getElementById('channel-name');
    const channelHandleInput = document.getElementById('channel-handle');
    const handlePreview = document.getElementById('handle-preview');
    const previewName = document.getElementById('preview-name');
    const previewHandle = document.getElementById('preview-handle');
    
    channelNameInput.addEventListener('input', function() {
        previewName.textContent = this.value || 'Channel Name';
    });
    
    channelHandleInput.addEventListener('input', function() {
        const handle = this.value || 'handle';
        handlePreview.textContent = handle;
        previewHandle.textContent = handle;
    });
    
    // Channel description
    const channelDescription = document.getElementById('channel-description');
    const previewDescription = document.getElementById('preview-description');
    
    channelDescription.addEventListener('input', function() {
        previewDescription.textContent = this.value || 'No description provided.';
    });
    
    // Music genre
    const musicGenre = document.getElementById('music-genre');
    const previewGenre = document.getElementById('preview-genre');
    
    musicGenre.addEventListener('change', function() {
        if (this.value) {
            previewGenre.textContent = this.options[this.selectedIndex].text;
            previewGenre.style.display = 'inline-block';
        } else {
            previewGenre.style.display = 'none';
        }
    });
    
    // Links management
    const linksContainer = document.getElementById('links-container');
    const addLinkBtn = document.getElementById('add-link');
    
    addLinkBtn.addEventListener('click', function() {
        const linkItem = document.createElement('div');
        linkItem.className = 'link-item d-flex mb-3';
        linkItem.innerHTML = `
            <input type="text" class="form-control me-2" placeholder="Title">
            <input type="url" class="form-control me-2" placeholder="Link">
            <button type="button" class="btn btn-outline-danger remove-link">
                <i class="fas fa-trash"></i>
            </button>
        `;
        linksContainer.appendChild(linkItem);
        
        // Add event listener to the new remove button
        linkItem.querySelector('.remove-link').addEventListener('click', function() {
            linkItem.remove();
        });
    });
    
    // Event delegation for existing remove buttons
    linksContainer.addEventListener('click', function(e) {
        if (e.target.closest('.remove-link')) {
            e.target.closest('.link-item').remove();
        }
    });
    
    // Copy channel URL
    const copyChannelUrlBtn = document.getElementById('copy-channel-url');
    
    copyChannelUrlBtn.addEventListener('click', function() {
        const channelUrl = this.previousElementSibling.value;
        navigator.clipboard.writeText(channelUrl).then(function() {
            const originalHTML = copyChannelUrlBtn.innerHTML;
            copyChannelUrlBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(function() {
                copyChannelUrlBtn.innerHTML = originalHTML;
            }, 2000);
        });
    });
    
    // Music player customization
    const playerTheme = document.getElementById('player-theme');
    const playerAccent = document.getElementById('player-accent');
    
    // Create player preview if not exists
    if (!document.querySelector('.player-theme-preview')) {
        const playerPreview = document.createElement('div');
        playerPreview.className = 'player-theme-preview dark';
        playerPreview.innerHTML = `
            <div class="player-info">
                <div class="song-title">Sample Song</div>
                <div class="artist-name">Sample Artist</div>
            </div>
            <div class="player-controls">
                <i class="fas fa-backward"></i>
                <i class="fas fa-play"></i>
                <i class="fas fa-forward"></i>
            </div>
        `;
        
        const playerSection = document.querySelector('.card-body');
        playerSection.appendChild(playerPreview);
    }
    
    const playerPreview = document.querySelector('.player-theme-preview');
    
    playerTheme.addEventListener('change', function() {
        playerPreview.className = `player-theme-preview ${this.value}`;
    });
    
    playerAccent.addEventListener('input', function() {
        playerPreview.style.borderLeft = `4px solid ${this.value}`;
    });
});