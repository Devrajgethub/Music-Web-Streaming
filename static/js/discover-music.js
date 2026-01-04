document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 Discover Music script loaded');

    // Initialize Filters
    const genreFilter = document.getElementById('genreFilter');
    const moodFilter = document.getElementById('moodFilter');
    const sortFilter = document.getElementById('sortFilter');

    function updateFilters() {
        const genre = genreFilter ? genreFilter.value : '';
        const mood = moodFilter ? moodFilter.value : '';
        const sort = sortFilter ? sortFilter.value : 'newest';

        const params = new URLSearchParams(window.location.search);
        if (genre) params.set('genre', genre); else params.delete('genre');
        if (mood) params.set('mood', mood); else params.delete('mood');
        if (sort) params.set('sort', sort); else params.delete('sort');

        // Reload with new params
        window.location.href = `${window.location.pathname}?${params.toString()}`;
    }

    if (genreFilter) genreFilter.addEventListener('change', updateFilters);
    if (moodFilter) moodFilter.addEventListener('change', updateFilters);
    if (sortFilter) sortFilter.addEventListener('change', updateFilters);

    // Initialize Play Buttons
    const playButtons = document.querySelectorAll('.btn-play-pause');
    
    playButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const songId = this.dataset.songId;
            const mediaType = this.dataset.mediaType || 'song';

            if (!window.mediaPlayer) {
                console.error('MediaPlayer not initialized');
                return;
            }

            // If currently playing this song, toggle pause
            if (window.mediaPlayer.currentMediaId == songId && window.mediaPlayer.isPlaying) {
                window.mediaPlayer.pause();
                updatePlayButtonState(this, false);
            } else if (window.mediaPlayer.currentMediaId == songId && !window.mediaPlayer.isPlaying) {
                window.mediaPlayer.play();
                updatePlayButtonState(this, true);
            } else {
                // Play new song
                if (mediaType === 'song') {
                    window.mediaPlayer.playSong(songId);
                } else {
                    // Assuming podcast support might be similar
                    console.log('Playing podcast episode not yet fully supported in discover script');
                }
                
                // Reset all other buttons
                playButtons.forEach(b => updatePlayButtonState(b, false));
                updatePlayButtonState(this, true);
            }
        });
    });

    // Listen for global media events to update UI state
    window.addEventListener('media:play', (e) => {
        const btn = document.querySelector(`.btn-play-pause[data-song-id="${e.detail.mediaId}"]`);
        if (btn) updatePlayButtonState(btn, true);
    });

    window.addEventListener('media:pause', (e) => {
        const btn = document.querySelector(`.btn-play-pause[data-song-id="${e.detail.mediaId}"]`);
        if (btn) updatePlayButtonState(btn, false);
    });

    function updatePlayButtonState(btn, isPlaying) {
        const icon = btn.querySelector('i');
        if (isPlaying) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            btn.classList.add('playing');
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            btn.classList.remove('playing');
        }
    }
    
    // Set initial filter states from URL
    const params = new URLSearchParams(window.location.search);
    if (genreFilter && params.has('genre')) genreFilter.value = params.get('genre');
    if (moodFilter && params.has('mood')) moodFilter.value = params.get('mood');
    if (sortFilter && params.has('sort')) sortFilter.value = params.get('sort');
});
