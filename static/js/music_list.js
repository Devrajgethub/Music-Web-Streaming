document.addEventListener('DOMContentLoaded', function() {
    const playButtons = document.querySelectorAll('.btn-play-pause');
    
    // Listen for play button clicks
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const mediaId = this.dataset.songId; // Keeping data-song-id for backward compatibility
            const mediaType = this.dataset.mediaType || 'song';
            
            if (!window.mediaPlayer) {
                console.error('Media Player not found');
                return;
            }

            // Check if currently playing this media
            if (window.mediaPlayer.currentMediaId == mediaId && window.mediaPlayer.currentMediaType === mediaType) {
                if (window.mediaPlayer.isPlaying) {
                    window.mediaPlayer.pause();
                } else {
                    window.mediaPlayer.play();
                }
            } else {
                // Play new media
                if (mediaType === 'podcast') {
                    window.mediaPlayer.playPodcast(mediaId);
                } else {
                    window.mediaPlayer.playSong(mediaId);
                }
            }
        });
    });

    // Listen for media events to update UI
    window.addEventListener('media:play', (e) => updatePlayButtons(e.detail));
    window.addEventListener('media:pause', (e) => updatePlayButtons(e.detail));
    window.addEventListener('media:stop', (e) => updatePlayButtons(e.detail));
    window.addEventListener('media:load', (e) => updatePlayButtons(e.detail));

    function updatePlayButtons(detail) {
        const { mediaId, mediaType, isPlaying } = detail;
        
        playButtons.forEach(button => {
            const buttonMediaId = button.dataset.songId;
            const buttonMediaType = button.dataset.mediaType || 'song';
            const icon = button.querySelector('i');
            
            if (buttonMediaType === mediaType && buttonMediaId == mediaId) {
                if (isPlaying) {
                    icon.classList.remove('fa-play');
                    icon.classList.add('fa-pause');
                } else {
                    icon.classList.remove('fa-pause');
                    icon.classList.add('fa-play');
                }
            } else {
                // Reset other buttons
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        });
    }
});
