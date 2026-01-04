document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const searchInput = document.getElementById('search-input');
    
    function filterPodcasts() {
        const category = categoryFilter.value;
        const sort = sortFilter.value;
        const search = searchInput.value.toLowerCase();
        
        // This would typically make an AJAX call to filter podcasts
        // For now, we'll just reload the page with query parameters
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (sort) params.append('sort', sort);
        if (search) params.append('search', search);
        
        const url = `${window.location.pathname}?${params.toString()}`;
        window.location.href = url;
    }
    
    if (categoryFilter) categoryFilter.addEventListener('change', filterPodcasts);
    if (sortFilter) sortFilter.addEventListener('change', filterPodcasts);
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                filterPodcasts();
            }
        });
    }
});
