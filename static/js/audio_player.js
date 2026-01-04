let currentAudio = null;
let currentSongId = null;
let currentPlayButton = null;

document.addEventListener('DOMContentLoaded', function() {
    const playButtons = document.querySelectorAll('.play-btn, .btn-play-pause');
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const currentSongText = document.getElementById('currentSong');
    const closePlayer = document.getElementById('closePlayer');

    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const songId = this.dataset.songId;
            const audioUrl = this.dataset.audioUrl;
            const songTitle = this.closest('.card-body, .music-track-item').querySelector('.card-title, .track-title').textContent;
            const thisButtonIcon = this.querySelector('i');
            
            if (currentSongId === songId && currentAudio && !currentAudio.paused) {
                // Pause current song
                currentAudio.pause();
                thisButtonIcon.classList.remove('fa-pause');
                thisButtonIcon.classList.add('fa-play');
            } else {
                // Play new song or resume current
                if (currentSongId !== songId) {
                    // Reset previous button
                    if (currentPlayButton) {
                        currentPlayButton.classList.remove('fa-pause');
                        currentPlayButton.classList.add('fa-play');
                    }

                    // New song
                    if (currentAudio) {
                        currentAudio.pause();
                    }
                    
                    currentAudio = new Audio(audioUrl);
                    currentSongId = songId;
                    currentSongText.textContent = `Now playing: ${songTitle}`;
                    currentPlayButton = thisButtonIcon;
                    
                    // Increment play count (API call)
                    fetch(`/music/song/${songId}/play/`, {
                        method: 'POST',
                        headers: {
                            'X-CSRFToken': getCookie('csrftoken'),
                            'Content-Type': 'application/json',
                        }
                    });
                    
                    currentAudio.addEventListener('timeupdate', function() {
                        const progress = (this.currentTime / this.duration) * 100;
                        progressBar.style.width = progress + '%';
                    });
                    
                    currentAudio.addEventListener('ended', function() {
                        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                        progressBar.style.width = '0%';
                        if(currentPlayButton) {
                            currentPlayButton.classList.remove('fa-pause');
                            currentPlayButton.classList.add('fa-play');
                        }
                    });
                }
                
                currentAudio.play();
                thisButtonIcon.classList.remove('fa-play');
                thisButtonIcon.classList.add('fa-pause');
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                audioPlayer.style.display = 'block';
            }
        });
    });

    // Player controls ke liye event listeners
    playPauseBtn.addEventListener('click', function() {
        if (currentAudio) {
            if (currentAudio.paused) {
                currentAudio.play();
                this.innerHTML = '<i class="fas fa-pause"></i>';
                if(currentPlayButton) {
                    currentPlayButton.classList.remove('fa-play');
                    currentPlayButton.classList.add('fa-pause');
                }
            } else {
                currentAudio.pause();
                this.innerHTML = '<i class="fas fa-play"></i>';
                if(currentPlayButton) {
                    currentPlayButton.classList.remove('fa-pause');
                    currentPlayButton.classList.add('fa-play');
                }
            }
        }
    });

    closePlayer.addEventListener('click', function() {
        if (currentAudio) {
            currentAudio.pause();
        }
        audioPlayer.style.display = 'none';
        currentSongId = null;
        if(currentPlayButton) {
            currentPlayButton.classList.remove('fa-pause');
            currentPlayButton.classList.add('fa-play');
        }
    });
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}