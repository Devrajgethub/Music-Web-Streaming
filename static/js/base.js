/**
 * MusicStream Base JavaScript
 * Handles all common functionality across the application
 */

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize all app components
 */
function initializeApp() {
    initializeVideoBackground();
    initializeNavbar();
    initializeDropdowns();
    initializeAlerts();
    initializeProfileImages();
    initializeMusicGrid();
    initializeForms();
    initializeResponsiveBehavior();
    initializeScrollEffects();
    initializeTabSwitching();
    initializeSearch();
    initializeTooltips();
}

/**
 * Initialize video background with performance optimizations
 */
function initializeVideoBackground() {
    const video = document.getElementById('bg-video');
    if (video) {
        // Pause video when tab is not visible to save resources
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                video.pause();
            } else {
                video.play().catch(e => console.log('Video autoplay failed:', e));
            }
        });
        
        // Handle video loading errors
        video.addEventListener('error', function() {
            console.log('Video loading failed');
            // Fallback to static background
            document.querySelector('.video-container').style.background = 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)';
        });
        
        // Add loading state
        video.addEventListener('loadstart', function() {
            document.querySelector('.video-container').classList.add('loading');
        });
        
        video.addEventListener('canplay', function() {
            document.querySelector('.video-container').classList.remove('loading');
        });
    }
}

/**
 * Initialize navbar with scroll effects and glassmorphism
 */
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        // Initial state
        updateNavbarStyle(navbar, window.scrollY);
        
        // Update on scroll
        window.addEventListener('scroll', function() {
            updateNavbarStyle(navbar, window.scrollY);
        });
        
        // Add active state to current page link
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }
}

/**
 * Update navbar style based on scroll position
 */
function updateNavbarStyle(navbar, scrollY) {
    if (scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
        navbar.style.padding = '0.7rem 0';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.8)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        navbar.style.padding = '1rem 0';
    }
}

/**
 * Initialize dropdown menus with enhanced animations
 */
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    
    dropdowns.forEach(function(dropdown) {
        // Prevent dropdown from closing when clicking inside
        dropdown.addEventListener('click', function(e) {
            const dropdownMenu = this.nextElementSibling;
            if (dropdownMenu && dropdownMenu.classList.contains('show')) {
                e.stopPropagation();
            }
        });
        
        // Add animation to dropdown menu
        const dropdownMenu = dropdown.nextElementSibling;
        if (dropdownMenu) {
            dropdown.addEventListener('shown.bs.dropdown', function() {
                dropdownMenu.style.animation = 'fadeInDown 0.3s ease';
            });
        }
    });
}

/**
 * Initialize alerts with auto-dismiss functionality
 */
function initializeAlerts() {
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(function(alert) {
        // Auto-hide after 5 seconds
        const autoHideTimer = setTimeout(function() {
            fadeOut(alert);
        }, 5000);
        
        // Cancel auto-hide on hover
        alert.addEventListener('mouseenter', function() {
            clearTimeout(autoHideTimer);
        });
        
        // Resume auto-hide on mouse leave
        alert.addEventListener('mouseleave', function() {
            setTimeout(function() {
                fadeOut(alert);
            }, 2000);
        });
        
        // Handle manual close
        const closeBtn = alert.querySelector('.btn-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                fadeOut(alert);
            });
        }
    });
}

/**
 * Fade out element with animation
 */
function fadeOut(element) {
    element.style.transition = 'opacity 0.5s, transform 0.5s';
    element.style.opacity = '0';
    element.style.transform = 'translateY(-10px)';
    
    setTimeout(function() {
        element.remove();
    }, 500);
}

/**
 * Initialize profile image interactions
 */
function initializeProfileImages() {
    // Handle profile image uploads
    const changePhotoBtn = document.querySelector('.change-photo-btn');
    if (changePhotoBtn) {
        changePhotoBtn.addEventListener('click', function() {
            // Create a hidden file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    handleProfileImageUpload(file);
                }
            });
            
            fileInput.click();
        });
    }
    
    // Add hover effects to profile images
    const profileImages = document.querySelectorAll('.profile-page-image, .main-profile-image');
    profileImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

/**
 * Handle profile image upload
 */
function handleProfileImageUpload(file) {
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showAlert('File size must be less than 5MB', 'danger');
        return;
    }
    
    // Check file type
    if (!file.type.match('image.*')) {
        showAlert('Please select an image file', 'danger');
        return;
    }
    
    // Create FileReader to preview the image
    const reader = new FileReader();
    reader.onload = function(e) {
        // Update profile image preview
        const profileImages = document.querySelectorAll('.profile-page-image, .main-profile-image');
        profileImages.forEach(img => {
            img.src = e.target.result;
        });
        
        // Show success message
        showAlert('Profile image updated successfully', 'success');
        
        // Here you would typically upload the image to your server
        // uploadProfileImage(file);
    };
    
    reader.readAsDataURL(file);
}

/**
 * Initialize music grid interactions
 */
function initializeMusicGrid() {
    // Add hover effects to music cards
    const musicCards = document.querySelectorAll('.music-card, .song-card, .music-item');
    
    musicCards.forEach(card => {
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.btn')) {
                createRippleEffect(this, e);
            }
        });
        
        // Add preview on hover
        let hoverTimer;
        card.addEventListener('mouseenter', function() {
            // Delay preview to avoid triggering on quick mouse movements
            hoverTimer = setTimeout(() => {
                // Could implement audio preview here
                this.style.transform = 'translateY(-5px)';
            }, 300);
        });
        
        card.addEventListener('mouseleave', function() {
            clearTimeout(hoverTimer);
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add lazy loading to music images
    const musicImages = document.querySelectorAll('.music-card img, .song-card img, .music-item img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        musicImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/**
 * Create ripple effect on click
 */
function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/**
 * Initialize form enhancements
 */
function initializeForms() {
    // Add floating labels effect
    const formControls = document.querySelectorAll('.form-control');
    
    formControls.forEach(input => {
        // Check if input has value on load
        if (input.value) {
            input.classList.add('has-value');
        }
        
        // Add class on focus/blur
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });
    
    // Add validation feedback
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
}

/**
 * Initialize responsive behavior
 */
function initializeResponsiveBehavior() {
    // Handle mobile menu
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            const isClickInside = navbarToggler.contains(e.target) || navbarCollapse.contains(e.target);
            
            if (!isClickInside && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
        
        // Close mobile menu when navigating to a new page
        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) {
                    navbarToggler.click();
                }
            });
        });
    }
    
    // Adjust grid layout based on screen size
    adjustMusicGrid();
    window.addEventListener('resize', debounce(adjustMusicGrid, 250));
}

/**
 * Adjust music grid based on screen size
 */
function adjustMusicGrid() {
    const musicGrid = document.querySelector('.music-grid, .song-grid, .music-list');
    
    if (musicGrid) {
        if (window.innerWidth < 480) {
            musicGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else if (window.innerWidth < 768) {
            musicGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(140px, 1fr))';
        } else {
            musicGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(180px, 1fr))';
        }
    }
}

/**
 * Initialize scroll effects
 */
function initializeScrollEffects() {
    // Add parallax effect to video background
    const video = document.getElementById('bg-video');
    if (video) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            video.style.transform = `translate(-50%, -50%) translateY(${scrollY * 0.5}px)`;
        });
    }
    
    // Add fade-in animation to content elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    const elementsToObserve = document.querySelectorAll('.card, .music-card, .song-card, section');
    elementsToObserve.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Initialize tab switching functionality
 */
function initializeTabSwitching() {
    const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
    
    tabButtons.forEach(button => {
        button.addEventListener('shown.bs.tab', function(e) {
            // Store active tab in localStorage
            const tabId = e.target.id;
            localStorage.setItem('activeTab', tabId);
            
            // Trigger custom event for tab change
            const event = new CustomEvent('tabChanged', {
                detail: { tabId: tabId }
            });
            document.dispatchEvent(event);
        });
    });
    
    // Restore active tab from localStorage
    const activeTab = localStorage.getItem('activeTab');
    if (activeTab) {
        const tabButton = document.querySelector(`#${activeTab}`);
        if (tabButton) {
            const tab = new bootstrap.Tab(tabButton);
            tab.show();
        }
    }
}

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchInput = document.querySelector('#searchInput');
    if (searchInput) {
        const debouncedSearch = debounce(function(e) {
            const query = e.target.value;
            if (query.length > 2) {
                performSearch(query);
            } else {
                clearSearchResults();
            }
        }, 300);
        
        searchInput.addEventListener('input', debouncedSearch);
    }
}

/**
 * Perform search request
 */
function performSearch(query) {
    const resultsContainer = document.querySelector('#searchResults');
    if (resultsContainer) {
        showLoadingSpinner(resultsContainer);
        
        makeAjaxRequest(`/api/search?q=${encodeURIComponent(query)}`, 'GET', null, 
            function(response) {
                displaySearchResults(response.results);
            },
            function(error) {
                resultsContainer.innerHTML = '<p class="text-danger">Search failed. Please try again.</p>';
            }
        );
    }
}

/**
 * Display search results
 */
function displaySearchResults(results) {
    const resultsContainer = document.querySelector('#searchResults');
    if (!resultsContainer) return;
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="text-muted">No results found.</p>';
        return;
    }
    
    let html = '<div class="search-results-list">';
    results.forEach(function(item) {
        const badgeClass = item.type === 'music' ? 'music-badge' : 'podcast-badge';
        const icon = item.type === 'music' ? 'fa-music' : 'fa-podcast';
        
        html += `
            <div class="search-result-item p-3 border-bottom">
                <div class="d-flex align-items-center">
                    <i class="fas ${icon} me-3"></i>
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${item.title}</h6>
                        <small class="text-muted">${item.artist || item.author}</small>
                    </div>
                    <span class="media-type-badge ${badgeClass}">${item.type}</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    resultsContainer.innerHTML = html;
}

/**
 * Clear search results
 */
function clearSearchResults() {
    const resultsContainer = document.querySelector('#searchResults');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }
}

/**
 * Initialize tooltips
 */
function initializeTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Show alert message
 */
function showAlert(message, type = 'info') {
    const alertContainer = document.querySelector('.content-wrapper');
    if (!alertContainer) return;
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at the beginning of the container
    alertContainer.insertBefore(alert, alertContainer.firstChild);
    
    // Initialize the alert
    initializeAlerts();
}

/**
 * Show loading spinner in an element
 */
function showLoadingSpinner(element) {
    element.innerHTML = '<div class="loading-spinner"></div>';
}

/**
 * Debounce function to limit API calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Make AJAX request with error handling
 */
function makeAjaxRequest(url, method, data, callback, errorCallback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                callback(response);
            } catch (e) {
                console.error('Invalid JSON response:', e);
                if (errorCallback) errorCallback('Invalid response');
            }
        } else {
            if (errorCallback) errorCallback(`Request failed: ${xhr.status}`);
        }
    };
    
    xhr.onerror = function() {
        if (errorCallback) errorCallback('Network error');
    };
    
    xhr.send(JSON.stringify(data));
}

/**
 * Format duration in seconds to MM:SS format
 */
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Export functions for use in other files
window.MusicStream = {
    showAlert,
    makeAjaxRequest,
    formatDuration,
    debounce,
    createRippleEffect,
    handleProfileImageUpload,
    showLoadingSpinner,
    fadeOut,
    getCookie
};

/**
 * Get cookie by name
 */
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

/**
 * Initialize Media Player
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 Initializing MusicStream...');
    
    if (typeof MediaPlayer !== 'undefined') {
        if (typeof window.mediaPlayer === 'undefined') {
            window.mediaPlayer = new MediaPlayer();
            console.log('✅ MusicStream ready!');
        }
    } else {
        console.warn('⚠️ MediaPlayer class not found. Player will not be initialized.');
        // Create a simple fallback media player
        window.mediaPlayer = {
            showNotification: function(message, type) {
                // Create a simple notification
                var notification = document.createElement('div');
                notification.className = 'alert alert-' + (type || 'info') + ' position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.style.zIndex = '9999';
                notification.textContent = message;
                document.body.appendChild(notification);
                
                // Remove after 3 seconds
                setTimeout(function() {
                    notification.remove();
                }, 3000);
            }
        };
    }
});