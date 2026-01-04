document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const genreFilter = document.getElementById('genre-filter');
    const sortFilter = document.getElementById('sort-filter');
    const searchInput = document.getElementById('search-input');
    
    function filterSongs() {
        const genre = genreFilter ? genreFilter.value : '';
        const sort = sortFilter ? sortFilter.value : '';
        const search = searchInput ? searchInput.value.toLowerCase() : '';
        
        const params = new URLSearchParams(window.location.search);
        if (genre) params.set('genre', genre); else params.delete('genre');
        if (sort) params.set('sort', sort); else params.delete('sort');
        if (search) params.set('search', search); else params.delete('search');
        
        const url = `${window.location.pathname}?${params.toString()}`;
        window.location.href = url;
    }
    
    if (genreFilter) genreFilter.addEventListener('change', filterSongs);
    if (sortFilter) sortFilter.addEventListener('change', filterSongs);
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                filterSongs();
            }
        });
    }
});
