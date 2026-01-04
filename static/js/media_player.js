/**
 * Professional Media Player - Spotify Style
 * Complete music and podcast streaming solution
 */

class MediaPlayer {
    constructor() {
        this.audioElement = null;
        this.currentMediaType = null; // 'song' या 'podcast'
        this.currentMediaId = null;
        this.isPlaying = false;
        this.currentSpeed = 1.0;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = 0.7;
        this.isMuted = false;
        this.isRepeat = false;
        this.isShuffle = false;
        this.updateInterval = null;
        this.queue = [];
        this.currentQueueIndex = 0;
        this.lyrics = null;
        this.visualizer = null;
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('🎵 Initializing Professional Media Player...');
        
        // Create audio element
        this.audioElement = new Audio();
        this.audioElement.preload = 'metadata';
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Set up UI controls
        this.setupUIControls();
        
        // Load saved settings
        this.loadSettings();
        
        // Initialize visualizer
        this.initVisualizer();
        
        // Initialize keyboard shortcuts
        this.initKeyboardShortcuts();
        
        // Initialize queue
        this.initQueue();
        
        console.log('✅ Media Player initialized successfully');
    }

    setupEventListeners() {
        // Audio element events
        this.audioElement.addEventListener('timeupdate', this.updateProgress.bind(this));
        this.audioElement.addEventListener('loadedmetadata', this.onMetadataLoaded.bind(this));
        this.audioElement.addEventListener('ended', this.onMediaEnded.bind(this));
        this.audioElement.addEventListener('error', this.onMediaError.bind(this));
        this.audioElement.addEventListener('loadstart', this.onLoadStart.bind(this));
        this.audioElement.addEventListener('canplay', this.onCanPlay.bind(this));
        this.audioElement.addEventListener('waiting', this.onWaiting.bind(this));
        this.audioElement.addEventListener('playing', this.onPlaying.bind(this));
        this.audioElement.addEventListener('pause', this.onPause.bind(this));
        this.audioElement.addEventListener('seeking', this.onSeeking.bind(this));
        this.audioElement.addEventListener('seeked', this.onSeeked.bind(this));
        this.audioElement.addEventListener('volumechange', this.onVolumeChange.bind(this));
        
        // Window events
        window.addEventListener('beforeunload', this.saveSettings.bind(this));
        window.addEventListener('online', this.onOnline.bind(this));
        window.addEventListener('offline', this.onOffline.bind(this));
        
        // Document visibility change
        document.addEventListener('visibilitychange', this.onVisibilityChange.bind(this));
    }

    setupUIControls() {
        // Progress bar
        const progressBar = document.getElementById('media-progress-bar');
        if (progressBar) {
            progressBar.addEventListener('click', this.seekTo.bind(this));
            progressBar.addEventListener('mousemove', this.onProgressBarHover.bind(this));
            progressBar.addEventListener('mouseleave', this.onProgressBarLeave.bind(this));
        }
        
        // Queue panel close button
        const queueCloseBtn = document.getElementById('media-queue-close');
        if (queueCloseBtn) {
            queueCloseBtn.addEventListener('click', () => {
                const queuePanel = document.getElementById('media-queue-panel');
                if (queuePanel) queuePanel.classList.remove('open');
            });
        }

        // Volume slider drag functionality
        const volumeSlider = document.getElementById('media-volume-slider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', this.onVolumeChange.bind(this));
            
            // Drag functionality for custom slider div
            let isDragging = false;
            
            volumeSlider.addEventListener('mousedown', (e) => {
                isDragging = true;
                this.handleVolumeDrag(e, volumeSlider);
            });
            
            document.addEventListener('mouseup', () => isDragging = false);
            
            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    this.handleVolumeDrag(e, volumeSlider);
                }
            });
        }
        
        // Control buttons
        this.setupControlButtons();
        
        // Speed controls
        this.setupSpeedControls();
        
        // Queue controls
        this.setupQueueControls();
        
        // Initialize tooltips
        this.initTooltips();
    }

    setupControlButtons() {
        const controls = [
            { id: 'media-play-btn', action: () => this.play() },
            { id: 'media-pause-btn', action: () => this.pause() },
            { id: 'media-stop-btn', action: () => this.stop() },
            { id: 'media-prev-btn', action: () => this.playPrevious() },
            { id: 'media-next-btn', action: () => this.playNext() },
            { id: 'media-rewind-btn', action: () => this.rewind(10) },
            { id: 'media-forward-btn', action: () => this.forward(10) },
            { id: 'media-shuffle-btn', action: () => this.toggleShuffle() },
            { id: 'media-repeat-btn', action: () => this.toggleRepeat() },
            { id: 'media-mute-btn', action: () => this.toggleMute() },
            { id: 'media-queue-btn', action: () => this.toggleQueue() },
            { id: 'media-fullscreen-btn', action: () => this.toggleFullscreen() },
            { id: 'media-device-btn', action: () => this.showDeviceSelector() }
        ];

        controls.forEach(control => {
            const element = document.getElementById(control.id);
            if (element) {
                element.addEventListener('click', control.action);
            }
        });
    }

    setupSpeedControls() {
        const speedButtons = document.querySelectorAll('.media-speed-btn');
        speedButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const speed = parseFloat(btn.dataset.speed);
                this.setPlaybackSpeed(speed);
            });
        });
    }

    setupQueueControls() {
        const queueItems = document.querySelectorAll('.media-queue-item');
        queueItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.playFromQueue(index);
            });
        });
    }

    // Music Controls
    async playSong(songId) {
        try {
            this.showLoadingState();
            
            const response = await fetch(`/music/song/${songId}/play/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.getCSRFToken(),
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentMediaType = 'song';
                this.currentMediaId = songId;
                await this.loadMedia(data.song);
                await this.play();
                this.updateUI();
                this.showNotification(`Now playing: ${data.song.title}`, 'success');
                return data;
            } else {
                throw new Error(data.message || 'Failed to play song');
            }
        } catch (error) {
            console.error('Error playing song:', error);
            this.showNotification(error.message, 'error');
            this.hideLoadingState();
            return { success: false, message: error.message };
        }
    }

    async pauseSong() {
        try {
            const response = await fetch('/users/music/song/pause/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.getCSRFToken(),
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                await this.pause();
                this.updateUI();
            } else {
                throw new Error(data.message || 'Failed to pause song');
            }
            
            return data;
        } catch (error) {
            console.error('Error pausing song:', error);
            this.showNotification(error.message, 'error');
            return { success: false, message: error.message };
        }
    }

    async resumeSong() {
        try {
            const response = await fetch('/users/music/song/resume/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.getCSRFToken(),
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                await this.play();
                this.updateUI();
            } else {
                throw new Error(data.message || 'Failed to resume song');
            }
            
            return data;
        } catch (error) {
            console.error('Error resuming song:', error);
            this.showNotification(error.message, 'error');
            return { success: false, message: error.message };
        }
    }

    async stopSong() {
        try {
            const response = await fetch('/users/music/song/stop/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.getCSRFToken(),
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                await this.stop();
                this.updateUI();
            } else {
                throw new Error(data.message || 'Failed to stop song');
            }
            
            return data;
        } catch (error) {
            console.error('Error stopping song:', error);
            this.showNotification(error.message, 'error');
            return { success: false, message: error.message };
        }
    }

    async forwardSong(seconds = 10) {
        try {
            const response = await fetch(`/users/music/song/forward/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.getCSRFToken(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ seconds })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentTime = data.current_time;
                this.audioElement.currentTime = this.currentTime;
                this.updateProgress();
            } else {
                throw new Error(data.message || 'Failed to forward song');
            }
            
            return data;
        } catch (error) {
            console.error('Error forwarding song:', error);
            this.showNotification(error.message, 'error');
            return { success: false, message: error.message };
        }
    }

    async rewindSong(seconds = 10) {
        try {
            const response = await fetch(`/users/music/song/rewind/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.getCSRFToken(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ seconds })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentTime = data.current_time;
                this.audioElement.currentTime = this.currentTime;
                this.updateProgress();
            } else {
                throw new Error(data.message || 'Failed to rewind song');
            }
            
            return data;
        } catch (error) {
            console.error('Error rewinding song:', error);
            this.showNotification(error.message, 'error');
            return { success: false, message: error.message };
        }
    }

    async changeSongSpeed(speed) {
        try {
            const response = await fetch('/users/music/song/speed/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.getCSRFToken(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ speed })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentSpeed = speed;
                this.audioElement.playbackRate = speed;
                this.updateSpeedUI();
            } else {
                throw new Error(data.message || 'Failed to change song speed');
            }
            
            return data;
        } catch (error) {
            console.error('Error changing song speed:', error);
            this.showNotification(error.message, 'error');
            return { success: false, message: error.message };
        }
    }

    // Podcast Controls (similar to song controls)
    async playPodcast(episodeId) {
        try {
            this.showLoadingState();
            
            const response = await fetch(`/users/podcast/episode/${episodeId}/play/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.getCSRFToken(),
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentMediaType = 'podcast';
                this.currentMediaId = episodeId;
                await this.loadMedia(data.episode);
                await this.play();
                this.updateUI();
                this.showNotification(`Now playing: ${data.episode.title}`, 'success');
                return data;
            } else {
                throw new Error(data.message || 'Failed to play podcast');
            }
        } catch (error) {
            console.error('Error playing podcast:', error);
            this.showNotification(error.message, 'error');
            this.hideLoadingState();
            return { success: false, message: error.message };
        }
    }

    // Generic Media Player Functions
    async loadMedia(media) {
        try {
            // Load audio
            this.audioElement.src = media.audio_url;
            
            // Update media info
            this.updateMediaInfo(media);
            
            // Set playback properties
            this.currentTime = media.current_time || 0;
            this.duration = media.duration || 0;
            this.currentSpeed = media.playback_speed || 1.0;
            this.isPlaying = media.is_playing || false;
            
            // Apply settings
            this.audioElement.currentTime = this.currentTime;
            this.audioElement.playbackRate = this.currentSpeed;
            this.audioElement.volume = this.volume;
            
            // Load lyrics if available
            if (media.lyrics) {
                this.lyrics = media.lyrics;
                this.updateLyricsDisplay();
            }
            
            // Update queue
            this.updateQueue(media);
            
            // Start visualizer
            if (this.visualizer) {
                this.visualizer.start();
            }
            
            this.dispatchMediaEvent('load', { media });
            
        } catch (error) {
            console.error('Error loading media:', error);
            throw error;
        }
    }

    async play() {
        try {
            await this.audioElement.play();
            this.isPlaying = true;
            this.startProgressUpdate();
            this.updateUI();
            
            // Update play count
            this.updatePlayCount();
            
            // Start visualizer
            if (this.visualizer) {
                this.visualizer.start();
            }
            
            this.dispatchMediaEvent('play');
            
        } catch (error) {
            console.error('Error playing media:', error);
            this.showNotification('Failed to play media', 'error');
        }
    }

    async pause() {
        try {
            this.audioElement.pause();
            this.isPlaying = false;
            this.stopProgressUpdate();
            this.updateUI();
            
            // Stop visualizer
            if (this.visualizer) {
                this.visualizer.stop();
            }
            
            this.dispatchMediaEvent('pause');
            
        } catch (error) {
            console.error('Error pausing media:', error);
        }
    }

    async stop() {
        try {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            this.currentTime = 0;
            this.isPlaying = false;
            this.stopProgressUpdate();
            this.updateProgress();
            this.updateUI();
            
            // Stop visualizer
            if (this.visualizer) {
                this.visualizer.stop();
            }
            
            this.dispatchMediaEvent('stop');
            
        } catch (error) {
            console.error('Error stopping media:', error);
        }
    }

    async seekTo(event) {
        try {
            if (!this.audioElement.src || this.duration === 0) return;
            
            const progressBar = event.currentTarget;
            const clickPosition = event.offsetX / progressBar.offsetWidth;
            const seekTime = clickPosition * this.duration;
            
            this.audioElement.currentTime = seekTime;
            this.currentTime = seekTime;
            this.updateProgress();
            
            // Sync with server
            await this.syncProgressWithServer();
            
        } catch (error) {
            console.error('Error seeking:', error);
        }
    }

    // Queue Management
    initQueue() {
        this.queue = [];
        this.currentQueueIndex = 0;
    }

    updateQueue(media) {
        // Add to queue if not already present
        const exists = this.queue.find(item => item.id === media.id);
        if (!exists) {
            this.queue.push(media);
            this.updateQueueUI();
        }
    }

    async playFromQueue(index) {
        try {
            if (index < 0 || index >= this.queue.length) return;
            
            this.currentQueueIndex = index;
            const media = this.queue[index];
            
            if (this.currentMediaType === 'song') {
                await this.playSong(media.id);
            } else if (this.currentMediaType === 'podcast') {
                await this.playPodcast(media.id);
            }
            
        } catch (error) {
            console.error('Error playing from queue:', error);
        }
    }

    async playNext() {
        try {
            if (this.isShuffle) {
                // Play random track
                const randomIndex = Math.floor(Math.random() * this.queue.length);
                await this.playFromQueue(randomIndex);
            } else {
                // Play next track
                const nextIndex = this.currentQueueIndex + 1;
                if (nextIndex < this.queue.length) {
                    await this.playFromQueue(nextIndex);
                } else if (this.isRepeat) {
                    await this.playFromQueue(0);
                }
            }
        } catch (error) {
            console.error('Error playing next:', error);
        }
    }

    async playPrevious() {
        try {
            const prevIndex = this.currentQueueIndex - 1;
            if (prevIndex >= 0) {
                await this.playFromQueue(prevIndex);
            } else if (this.isRepeat) {
                await this.playFromQueue(this.queue.length - 1);
            }
        } catch (error) {
            console.error('Error playing previous:', error);
        }
    }

    // UI Update Functions
    updateProgress() {
        try {
            if (!this.audioElement) return;
            this.currentTime = this.audioElement.currentTime || 0;
            if (!isNaN(this.audioElement.duration)) {
                this.duration = this.audioElement.duration;
            }
            this.updateProgressBar();
            this.updateTimeDisplay();
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    }

    updateUI() {
        this.updatePlayPauseButton();
        this.updateControlButtons();
        this.updateProgressBar();
        this.updateTimeDisplay();
        this.updateVolumeDisplay();
        this.updateSpeedUI();
        this.updateQueueUI();
        this.updateMediaInfo();
    }

    updatePlayPauseButton() {
        const playBtn = document.getElementById('media-play-btn');
        const pauseBtn = document.getElementById('media-pause-btn');
        
        if (playBtn && pauseBtn) {
            if (this.isPlaying) {
                playBtn.style.display = 'none';
                pauseBtn.style.display = 'flex';
            } else {
                playBtn.style.display = 'flex';
                pauseBtn.style.display = 'none';
            }
        }
    }

    updateControlButtons() {
        // Update repeat button
        const repeatBtn = document.getElementById('media-repeat-btn');
        if (repeatBtn) {
            repeatBtn.classList.toggle('active', this.isRepeat);
            repeatBtn.setAttribute('title', this.isRepeat ? 'Repeat On' : 'Repeat Off');
        }
        
        // Update shuffle button
        const shuffleBtn = document.getElementById('media-shuffle-btn');
        if (shuffleBtn) {
            shuffleBtn.classList.toggle('active', this.isShuffle);
            shuffleBtn.setAttribute('title', this.isShuffle ? 'Shuffle On' : 'Shuffle Off');
        }
        
        // Update mute button
        const muteBtn = document.getElementById('media-mute-btn');
        if (muteBtn) {
            muteBtn.classList.toggle('active', this.isMuted);
            muteBtn.setAttribute('title', this.isMuted ? 'Unmute' : 'Mute');
        }
    }

    updateProgressBar() {
        const progressBar = document.getElementById('media-progress');
        if (progressBar && this.duration > 0) {
            const progress = (this.currentTime / this.duration) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    updateTimeDisplay() {
        const currentTimeElement = document.getElementById('media-current-time');
        const durationElement = document.getElementById('media-duration');
        
        if (currentTimeElement) {
            currentTimeElement.textContent = this.formatTime(this.currentTime);
        }
        
        if (durationElement) {
            durationElement.textContent = this.formatTime(this.duration);
        }
    }

    updateVolumeDisplay() {
        const volumeSlider = document.getElementById('media-volume-slider');
        const volumeLevel = document.getElementById('media-volume-level');
        
        if (volumeSlider) {
            volumeSlider.value = this.volume * 100;
        }
        
        if (volumeLevel) {
            volumeLevel.style.width = `${this.volume * 100}%`;
        }
    }

    updateSpeedUI() {
        const speedElement = document.getElementById('media-speed');
        const speedButtons = document.querySelectorAll('.media-speed-btn');
        
        if (speedElement) {
            speedElement.textContent = `${this.currentSpeed}x`;
        }
        
        speedButtons.forEach(btn => {
            const speed = parseFloat(btn.dataset.speed);
            btn.classList.toggle('active', Math.abs(speed - this.currentSpeed) < 0.01);
        });
    }

    updateQueueUI() {
        const queueItems = document.querySelectorAll('.media-queue-item');
        queueItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentQueueIndex);
        });
    }

    updateMediaInfo(media = null) {
        const titleElement = document.getElementById('media-title');
        const artistElement = document.getElementById('media-artist');
        const coverElement = document.getElementById('media-cover');
        
        if (media) {
            if (titleElement) titleElement.textContent = media.title;
            if (artistElement) {
                artistElement.textContent = this.currentMediaType === 'song' ? 
                    media.artist : media.podcast;
            }
            if (coverElement) {
                coverElement.src = media.cover_url || '/static/images/default-album-art.jpg';
            }
        }
    }

    // Event Handlers
    onMetadataLoaded() {
        this.duration = this.audioElement.duration;
        this.updateUI();
    }

    onMediaEnded() {
        this.isPlaying = false;
        this.updateUI();
        
        // Auto-play next media
        this.playNext();
    }

    onMediaError(error) {
        console.error('Media error:', error);
        this.showNotification('Error loading media', 'error');
        this.hideLoadingState();
    }

    onLoadStart() {
        this.showLoadingState();
    }

    onCanPlay() {
        this.hideLoadingState();
    }

    onWaiting() {
        this.showLoadingState();
    }

    onPlaying() {
        this.hideLoadingState();
    }

    onPause() {
        this.hideLoadingState();
    }

    onSeeking() {
        this.showLoadingState();
    }

    onSeeked() {
        this.hideLoadingState();
    }

    onVolumeChange() {
        this.volume = this.audioElement.volume;
        this.isMuted = this.audioElement.muted;
        this.updateVolumeDisplay();
    }

    handleVolumeDrag(e, slider) {
        const rect = slider.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        slider.style.setProperty('--volume-percent', percent);
        this.setVolume(percent);
    }

    onOnline() {
        this.showNotification('Connection restored', 'success');
    }

    onOffline() {
        this.showNotification('Connection lost', 'warning');
    }

    onVisibilityChange() {
        if (document.hidden) {
            // Pause when tab is not visible
            if (this.isPlaying) {
                this.wasPlaying = true;
                this.pause();
            }
        } else {
            // Resume when tab becomes visible
            if (this.wasPlaying) {
                this.play();
                this.wasPlaying = false;
            }
        }
    }

    onProgressBarHover(event) {
        // Show time tooltip on hover
        const progressBar = event.currentTarget;
        const hoverTime = (event.offsetX / progressBar.offsetWidth) * this.duration;
        
        // Create or update tooltip
        let tooltip = document.getElementById('progress-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'progress-tooltip';
            tooltip.className = 'progress-tooltip';
            document.body.appendChild(tooltip);
        }
        
        tooltip.textContent = this.formatTime(hoverTime);
        tooltip.style.left = `${event.pageX}px`;
        tooltip.style.top = `${event.pageY - 30}px`;
        tooltip.style.display = 'block';
    }

    onProgressBarLeave() {
        const tooltip = document.getElementById('progress-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    // Progress Update
    startProgressUpdate() {
        this.stopProgressUpdate();
        this.updateInterval = setInterval(() => {
            if (this.isPlaying) {
                this.currentTime = this.audioElement.currentTime;
                this.updateProgress();
                this.updateTimeDisplay();
                
                // Sync with server periodically
                if (Math.floor(this.currentTime) % 10 === 0) {
                    this.syncProgressWithServer();
                }
            }
        }, 1000);
    }

    stopProgressUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // Server Sync
    async syncProgressWithServer() {
        try {
            const endpoint = this.currentMediaType === 'song' ? 
                '/users/music/song/sync/' : '/users/podcast/episode/sync/';
            
            await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.getCSRFToken(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    current_time: this.currentTime,
                    playback_speed: this.currentSpeed
                })
            });
        } catch (error) {
            console.error('Error syncing progress:', error);
        }
    }

    async updatePlayCount() {
        try {
            const endpoint = this.currentMediaType === 'song' ? 
                `/music/song/${this.currentMediaId}/play/` : 
                `/music/episode/${this.currentMediaId}/play/`;
            
            await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.getCSRFToken(),
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Error updating play count:', error);
        }
    }

    // Settings Management
    loadSettings() {
        try {
            const settings = localStorage.getItem('mediaPlayerSettings');
            if (settings) {
                const parsed = JSON.parse(settings);
                this.volume = parsed.volume || 0.7;
                this.currentSpeed = parsed.speed || 1.0;
                this.isRepeat = parsed.repeat || false;
                this.isShuffle = parsed.shuffle || false;
                this.isMuted = parsed.muted || false;
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    saveSettings() {
        try {
            const settings = {
                volume: this.volume,
                speed: this.currentSpeed,
                repeat: this.isRepeat,
                shuffle: this.isShuffle,
                muted: this.isMuted
            };
            localStorage.setItem('mediaPlayerSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    // Visualizer
    initVisualizer() {
        try {
            // Initialize Web Audio API for visualizer
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.source = this.audioContext.createMediaElementSource(this.audioElement);
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            this.visualizer = {
                start: () => {
                    // Start visualizer animation
                    this.visualizerCanvas = document.getElementById('visualizer-canvas');
                    if (this.visualizerCanvas) {
                        this.visualizerContext = this.visualizerCanvas.getContext('2d');
                        this.visualizerAnimation();
                    }
                },
                stop: () => {
                    // Stop visualizer animation
                    if (this.visualizerAnimationId) {
                        cancelAnimationFrame(this.visualizerAnimationId);
                    }
                }
            };
        } catch (error) {
            console.error('Error initializing visualizer:', error);
        }
    }

    visualizerAnimation() {
        if (!this.visualizerCanvas || !this.visualizerContext) return;
        
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);
        
        this.visualizerContext.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.visualizerContext.fillRect(0, 0, this.visualizerCanvas.width, this.visualizerCanvas.height);
        
        const barWidth = (this.visualizerCanvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            
            const r = barHeight + (25 * (i / bufferLength));
            const g = 250 * (i / bufferLength);
            const b = 50;
            
            this.visualizerContext.fillStyle = `rgb(${r}, ${g}, ${b})`;
            this.visualizerContext.fillRect(x, this.visualizerCanvas.height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
        
        this.visualizerAnimationId = requestAnimationFrame(() => this.visualizerAnimation());
    }

    // Keyboard Shortcuts
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Only handle shortcuts when not typing in input fields
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch (event.code) {
                case 'Space':
                    event.preventDefault();
                    if (this.isPlaying) {
                        this.pause();
                    } else {
                        this.play();
                    }
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    this.forward(10);
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    this.rewind(10);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    this.setVolume(Math.min(1, this.volume + 0.1));
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    this.setVolume(Math.max(0, this.volume - 0.1));
                    break;
                case 'KeyN':
                    event.preventDefault();
                    this.playNext();
                    break;
                case 'KeyP':
                    event.preventDefault();
                    this.playPrevious();
                    break;
                case 'KeyM':
                    event.preventDefault();
                    this.toggleMute();
                    break;
                case 'KeyR':
                    event.preventDefault();
                    this.toggleRepeat();
                    break;
                case 'KeyS':
                    event.preventDefault();
                    this.toggleShuffle();
                    break;
                case 'KeyF':
                    event.preventDefault();
                    this.toggleFullscreen();
                    break;
            }
        });
    }

    // Control Functions
    async setVolume(volume) {
        try {
            this.volume = Math.max(0, Math.min(1, volume));
            this.audioElement.volume = this.volume;
            this.isMuted = this.volume === 0;
            this.updateVolumeDisplay();
            this.saveSettings();
        } catch (error) {
            console.error('Error setting volume:', error);
        }
    }

    async setPlaybackSpeed(speed) {
        try {
            this.currentSpeed = Math.max(0.5, Math.min(2.0, speed));
            this.audioElement.playbackRate = this.currentSpeed;
            this.updateSpeedUI();
            this.saveSettings();
            
            // Sync with server
            if (this.currentMediaType === 'song') {
                await this.changeSongSpeed(this.currentSpeed);
            } else {
                await this.changePodcastSpeed(this.currentSpeed);
            }
        } catch (error) {
            console.error('Error setting playback speed:', error);
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.audioElement.muted = this.isMuted;
        this.updateVolumeDisplay();
        this.saveSettings();
    }

    toggleRepeat() {
        this.isRepeat = !this.isRepeat;
        this.updateControlButtons();
        this.saveSettings();
    }

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.updateControlButtons();
        this.saveSettings();
    }

    toggleQueue() {
        const queuePanel = document.getElementById('media-queue-panel');
        if (queuePanel) {
            queuePanel.classList.toggle('open');
        }
    }

    toggleFullscreen() {
        const mediaPlayer = document.getElementById('media-player-footer');
        if (mediaPlayer) {
            mediaPlayer.classList.toggle('fullscreen');
        }
    }

    showDeviceSelector() {
        // Show device selection modal
        this.showNotification('Device selector not implemented yet', 'info');
    }

    // Utility Functions
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    getCSRFToken() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                return decodeURIComponent(value);
            }
        }
        return '';
    }

    showLoadingState() {
        const mediaPlayer = document.getElementById('media-player-footer');
        if (mediaPlayer) {
            mediaPlayer.classList.add('loading');
        }
    }

    hideLoadingState() {
        const mediaPlayer = document.getElementById('media-player-footer');
        if (mediaPlayer) {
            mediaPlayer.classList.remove('loading');
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.media-player-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `media-player-notification alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 80px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }

    dispatchMediaEvent(eventName, detail = {}) {
        const event = new CustomEvent(`media:${eventName}`, {
            detail: {
                ...detail,
                mediaId: this.currentMediaId,
                mediaType: this.currentMediaType,
                isPlaying: this.isPlaying
            },
            bubbles: true
        });
        window.dispatchEvent(event);
    }

    initTooltips() {
        // Initialize Bootstrap tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Public API
    async play() {
        if (this.currentMediaType === 'song') {
            return await this.resumeSong();
        } else if (this.currentMediaType === 'podcast') {
            return await this.resumePodcast();
        }
    }

    async pause() {
        if (this.currentMediaType === 'song') {
            return await this.pauseSong();
        } else if (this.currentMediaType === 'podcast') {
            return await this.pausePodcast();
        }
    }

    async stop() {
        if (this.currentMediaType === 'song') {
            return await this.stopSong();
        } else if (this.currentMediaType === 'podcast') {
            return await this.stopPodcast();
        }
    }

    async forward(seconds = 10) {
        if (this.currentMediaType === 'song') {
            return await this.forwardSong(seconds);
        } else if (this.currentMediaType === 'podcast') {
            return await this.forwardPodcast(seconds);
        }
    }

    async rewind(seconds = 10) {
        if (this.currentMediaType === 'song') {
            return await this.rewindSong(seconds);
        } else if (this.currentMediaType === 'podcast') {
            return await this.rewindPodcast(seconds);
        }
    }

    // Destroy method
    destroy() {
        // Clean up event listeners
        this.audioElement.removeEventListener('timeupdate', this.updateProgress);
        this.audioElement.removeEventListener('loadedmetadata', this.onMetadataLoaded);
        this.audioElement.removeEventListener('ended', this.onMediaEnded);
        
        // Stop intervals
        this.stopProgressUpdate();
        
        // Clean up visualizer
        if (this.visualizer) {
            this.visualizer.stop();
        }
        
        // Remove from global scope
        delete window.mediaPlayer;
    }
}

// Initialize the media player when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 DOM loaded, initializing Professional Media Player...');
    
    // Create global media player instance
    if (typeof window.mediaPlayer === 'undefined') {
        window.mediaPlayer = new MediaPlayer();
        console.log('✅ Professional Media Player ready!');
    }
    
    // Make it globally available
    window.MediaPlayer = MediaPlayer;
    
    // UI Event Listeners (moved from inline script)
    // Queue panel close button
    const queueCloseBtn = document.getElementById('media-queue-close');
    if (queueCloseBtn) {
        queueCloseBtn.addEventListener('click', function() {
            const queuePanel = document.getElementById('media-queue-panel');
            if (queuePanel) {
                queuePanel.classList.remove('open');
            }
        });
    }

    // Volume slider drag functionality
    const volumeSlider = document.getElementById('media-volume-slider');
    if (volumeSlider) {
        let isDragging = false;
        
        volumeSlider.addEventListener('mousedown', () => isDragging = true);
        document.addEventListener('mouseup', () => isDragging = false);
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const rect = volumeSlider.getBoundingClientRect();
                const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                volumeSlider.style.setProperty('--volume-percent', percent);
                
                if (window.mediaPlayer) {
                    window.mediaPlayer.setVolume(percent);
                }
            }
        });
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MediaPlayer;
}
