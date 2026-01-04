from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.db.models import Q
from django.contrib.auth.models import User

from .models import Song, Podcast, Episode
from .forms import SongUploadForm, PodcastUploadForm, EpisodeUploadForm

# CORE VIEWS
def home(request):
    songs = Song.objects.all().order_by('-upload_date')
    podcasts = Podcast.objects.all().order_by('-created_at')
    
    import random
    users_with_songs = User.objects.filter(song__isnull=False).distinct()
    suggested_users = random.sample(list(users_with_songs), min(4, users_with_songs.count())) if users_with_songs else []
    
    context = {
        'songs': songs,
        'podcasts': podcasts,
        'suggested_users': suggested_users
    }
    return render(request, 'music/index.html', context)

@login_required
def upload_song(request):
    if request.method == 'POST':
        form = SongUploadForm(request.POST, request.FILES)
        if form.is_valid():
            song = form.save(commit=False)
            song.uploaded_by = request.user
            song.save()
            messages.success(request, 'Song uploaded successfully!')
            return redirect('music:home')
    else:
        form = SongUploadForm()
    return render(request, 'music/upload.html', {'form': form})

@login_required
def my_songs(request):
    songs = Song.objects.filter(uploaded_by=request.user)
    return render(request, 'music/my_songs.html', {'songs': songs})

def song_detail(request, pk):
    song = get_object_or_404(Song, pk=pk)
    
    is_following = False
    if request.user.is_authenticated and request.user != song.uploaded_by:
        is_following = request.user in song.uploaded_by.profile.followers.all()
    
    context = {
        'song': song,
        'is_following': is_following
    }
    return render(request, 'music/song_detail.html', context)

@login_required
def delete_song(request, pk):
    song = get_object_or_404(Song, pk=pk, uploaded_by=request.user)
    if request.method == 'POST':
        song.delete()
        messages.success(request, 'Song deleted successfully!')
        return redirect('music:my_songs')
    return render(request, 'music/delete_song.html', {'song': song})

# PODCAST VIEWS
@login_required
def upload_podcast(request):
    if request.method == 'POST':
        form = PodcastUploadForm(request.POST, request.FILES)
        if form.is_valid():
            podcast = form.save(commit=False)
            podcast.host = request.user
            podcast.save()
            messages.success(request, 'Podcast uploaded successfully!')
            return redirect('music:podcast_detail', pk=podcast.pk)
    else:
        form = PodcastUploadForm()
    return render(request, 'music/upload_podcast.html', {'form': form})

def podcast_detail(request, pk):
    podcast = get_object_or_404(Podcast, pk=pk)
    episodes = podcast.episodes.all().order_by('-published_date')
    
    is_following = False
    if request.user.is_authenticated and request.user != podcast.host:
        is_following = request.user in podcast.host.profile.followers.all()
    
    context = {
        'podcast': podcast,
        'episodes': episodes,
        'is_following': is_following
    }
    return render(request, 'music/podcast_detail.html', context)

@login_required
def upload_episode(request, podcast_pk):
    podcast = get_object_or_404(Podcast, pk=podcast_pk)
    
    if request.method == 'POST':
        form = EpisodeUploadForm(request.POST, request.FILES)
        if form.is_valid():
            episode = form.save(commit=False)
            episode.podcast = podcast
            episode.save()
            messages.success(request, 'Episode uploaded successfully!')
            return redirect('music:podcast_detail', pk=podcast.pk)
    else:
        form = EpisodeUploadForm()
    
    return render(request, 'music/upload_episode.html', {'form': form, 'podcast': podcast})

def episode_detail(request, pk):
    episode = get_object_or_404(Episode, pk=pk)
    
    context = {
        'episode': episode
    }
    return render(request, 'music/episode_detail.html', context)

@login_required
def delete_episode(request, pk):
    episode = get_object_or_404(Episode, pk=pk, podcast__host=request.user)
    if request.method == 'POST':
        podcast_pk = episode.podcast.pk
        episode.delete()
        messages.success(request, 'Episode deleted successfully!')
        return redirect('music:podcast_detail', pk=podcast_pk)
    return render(request, 'music/delete_episode.html', {'episode': episode})

def podcasts(request):
    podcasts = Podcast.objects.all().order_by('-created_at')
    return render(request, 'music/podcasts.html', {'podcasts': podcasts})

@login_required
def my_podcasts(request):
    podcasts = Podcast.objects.filter(host=request.user)
    return render(request, 'music/my_podcasts.html', {'podcasts': podcasts})

# SEARCH & PLAYER VIEWS
def search_results(request):
    query = request.GET.get('q')
    song_results = []
    user_results = []
    podcast_results = []
    
    if query:
        song_results = Song.objects.filter(
            Q(title__icontains=query) | 
            Q(artist__icontains=query) | 
            Q(genre__icontains=query)
        )
        
        user_results = User.objects.filter(
            Q(username__icontains=query) |
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query)
        )
        
        podcast_results = Podcast.objects.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query)
        )
    
    context = {
        'query': query,
        'songs': song_results,
        'users': user_results,
        'podcasts': podcast_results,
    }
    return render(request, 'music/search_results.html', context)

def discover(request):
    songs = Song.objects.all().order_by('-upload_date')
    podcasts = Podcast.objects.all().order_by('-created_at')
    return render(request, 'music/discover.html', {'songs': songs, 'podcasts': podcasts})

def increment_play_count(request, pk):
    """
    API endpoint to increment the play count of a song.
    Called via JavaScript (AJAX) when a song is played.
    """
    if request.method == 'POST':
        song = get_object_or_404(Song, pk=pk)
        song.play_count += 1
        song.save()
        
        # Return song data for the media player
        song_data = {
            'id': song.id,
            'title': song.title,
            'artist': song.artist,
            'album': song.album,
            'audio_url': song.audio_file.url,
            'cover_url': song.cover_image.url if song.cover_image else '/static/images/default-album-art.jpg',
            'duration': 0,  # You might want to add a duration field to your model
            'play_count': song.play_count,
            'current_time': 0,
            'is_playing': True,
            'playback_speed': 1.0
        }
        
        return JsonResponse({
            'success': True,
            'song': song_data
        })
    
    # Return an error if the request method is not POST
    return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)

def increment_episode_play_count(request, pk):
    """
    API endpoint to increment the play count of an episode.
    Called via JavaScript (AJAX) when an episode is played.
    """
    if request.method == 'POST':
        episode = get_object_or_404(Episode, pk=pk)
        episode.play_count += 1
        episode.save()
        
        # Return episode data for the media player
        episode_data = {
            'id': episode.id,
            'title': episode.title,
            'podcast': episode.podcast.title,
            'audio_url': episode.audio_file.url,
            'cover_url': episode.podcast.cover_image.url if episode.podcast.cover_image else '/static/images/default-album-art.jpg',
            'duration': 0,  # You might want to add a duration field to your model
            'play_count': episode.play_count,
            'current_time': 0,
            'is_playing': True,
            'playback_speed': 1.0
        }
        
        return JsonResponse({
            'success': True,
            'episode': episode_data
        })
    
    # Return an error if the request method is not POST
    return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)