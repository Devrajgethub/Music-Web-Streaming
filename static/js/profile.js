document.addEventListener('DOMContentLoaded', function() {
    // Follow/Unfollow functionality
    const followBtn = document.querySelector('.follow-btn');
    if (followBtn) {
        followBtn.addEventListener('click', function() {
            const username = this.dataset.username;
            
            fetch(`/users/follow/${username}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json',
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (data.is_following) {
                        this.classList.remove('btn-outline-primary');
                        this.classList.add('btn-primary');
                        this.innerHTML = '<i class="fas fa-user-check"></i> Following';
                    } else {
                        this.classList.remove('btn-primary');
                        this.classList.add('btn-outline-primary');
                        this.innerHTML = '<i class="fas fa-user-plus"></i> Follow';
                    }
                    
                    // Update followers count
                    const followersCount = document.querySelector('.followers-count');
                    if (followersCount) {
                        followersCount.textContent = data.followers_count;
                    }
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
    
    // Profile image preview
    const profileImageInput = document.getElementById('profileImageInput');
    const imagePreview = document.getElementById('imagePreview');
    
    if (profileImageInput) {
        profileImageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `<img src="${e.target.result}" class="img-fluid rounded" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Save profile image
    const saveProfileImageBtn = document.getElementById('saveProfileImage');
    if (saveProfileImageBtn) {
        saveProfileImageBtn.addEventListener('click', function() {
            const form = document.getElementById('profileImageForm');
            const formData = new FormData(form);
            
            fetch('/users/upload-image/', { // Corrected URL based on urls.py
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update profile image on the page
                    const profileImage = document.querySelector('.profile-image');
                    if (profileImage) {
                        profileImage.src = data.image_url;
                    }
                    
                    // Close modal
                    const modalElement = document.getElementById('changePhotoModal');
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    modal.hide();
                    
                    // Reset form
                    form.reset();
                    imagePreview.innerHTML = '';
                    
                    // Show success message
                    if (window.MusicStream && window.MusicStream.showAlert) {
                        window.MusicStream.showAlert('Profile image updated successfully!', 'success');
                    } else {
                        alert('Profile image updated successfully!');
                    }
                } else {
                    alert('Error updating profile image: ' + (JSON.stringify(data.errors) || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while uploading the image.');
            });
        });
    }
});
