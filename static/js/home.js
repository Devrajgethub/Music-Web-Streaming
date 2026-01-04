// =====================================================
// HOME PAGE SPECIFIC JAVASCRIPT
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            
            if (query) {
                showNotification(`Searching for: ${query}`, 'success');
                // In a real application, you would perform a search
                console.log('Search query:', query);
            } else {
                showNotification('Please enter a search query', 'error');
            }
        });
    }
    
    // Category selection
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoryName = this.querySelector('.category-name').textContent;
            showNotification(`Selected category: ${categoryName}`, 'success');
            // In a real application, you would filter content by category
            console.log('Selected category:', categoryName);
        });
    });
    
    // Load featured content
    loadFeaturedContent();
});

// Load featured content
function loadFeaturedContent() {
    const featuredGrid = document.querySelector('.home-music-grid');
    if (!featuredGrid) return;
    
    // Sample data - in a real app, this would come from an API
    const featuredSongs = [
        { title: 'Summer Vibes', artist: 'DJ Mix', plays: '1.2K', image: 'https://picsum.photos/seed/featured1/300/300.jpg' },
        { title: 'Night Drive', artist: 'Chill Hop', plays: '856', image: 'https://picsum.photos/seed/featured2/300/300.jpg' },
        { title: 'Urban Beats', artist: 'Hip Hop', plays: '2.3K', image: 'https://picsum.photos/seed/featured3/300/300.jpg' },
        { title: 'Acoustic Sessions', artist: 'Indie Folk', plays: '542', image: 'https://picsum.photos/seed/featured4/300/300.jpg' },
        { title: 'Electronic Dreams', artist: 'Synth Wave', plays: '3.1K', image: 'https://picsum.photos/seed/featured5/300/300.jpg' },
        { title: 'Jazz Cafe', artist: 'Smooth Jazz', plays: '789', image: 'https://picsum.photos/seed/featured6/300/300.jpg' }
    ];
    
    // Create song cards
    featuredSongs.forEach(song => {
        const songCard = document.createElement('div');
        songCard.className = 'song-card';
        songCard.innerHTML = `
            <img src="${song.image}" alt="${song.title} cover">
            <div class="song-info">
                <h4>${song.title}</h4>
                <p>${song.artist} • ${song.plays} plays</p>
            </div>
            <div class="song-actions">
                <button class="btn-icon"><i class="fas fa-play"></i></button>
                <button class="btn-icon"><i class="fas fa-heart"></i></button>
                <button class="btn-icon"><i class="fas fa-plus"></i></button>
            </div>
        `;
        
        // Add event listeners to song actions
        const playBtn = songCard.querySelector('.fa-play').parentElement;
        const likeBtn = songCard.querySelector('.fa-heart').parentElement;
        const addBtn = songCard.querySelector('.fa-plus').parentElement;
        
        playBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-play')) {
                // Stop all other songs
                document.querySelectorAll('.btn-icon i.fa-pause').forEach(i => {
                    i.classList.remove('fa-pause');
                    i.classList.add('fa-play');
                });
                
                // Play this song
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                
                showNotification(`Now playing: ${song.title}`, 'success');
            } else if (icon.classList.contains('fa-pause')) {
                // Pause this song
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        });
        
        likeBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            icon.classList.toggle('fas');
            icon.classList.toggle('far');
            
            if (icon.classList.contains('fas')) {
                showNotification(`Added ${song.title} to favorites`, 'success');
            } else {
                showNotification(`Removed ${song.title} from favorites`, 'success');
            }
        });
        
        addBtn.addEventListener('click', function() {
            showNotification(`Added ${song.title} to playlist`, 'success');
            // In a real application, you would add the song to a playlist
        });
        
        featuredGrid.appendChild(songCard);
    });
}