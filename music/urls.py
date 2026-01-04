from django.urls import path
from . import views

app_name = 'music'

urlpatterns = [
    path('', views.home, name='home'),
    path('discover/', views.discover, name='discover'),
    path('upload/', views.upload_song, name='upload_song'),
    path('my-songs/', views.my_songs, name='my_songs'),
    path('song/<int:pk>/', views.song_detail, name='song_detail'),
    path('song/<int:pk>/delete/', views.delete_song, name='delete_song'),
    path('song/<int:pk>/play/', views.increment_play_count, name='increment_play_count'),
    path('search/', views.search_results, name='search_results'),
    
    # Podcast URLs
    path('podcasts/', views.podcasts, name='podcasts'),
    path('podcasts/upload/', views.upload_podcast, name='upload_podcast'),
    path('podcasts/my/', views.my_podcasts, name='my_podcasts'),
    path('podcast/<int:pk>/', views.podcast_detail, name='podcast_detail'),
    path('podcast/<int:podcast_pk>/episode/upload/', views.upload_episode, name='upload_episode'),
    path('episode/<int:pk>/', views.episode_detail, name='episode_detail'),
    path('episode/<int:pk>/delete/', views.delete_episode, name='delete_episode'),
    path('episode/<int:pk>/play/', views.increment_episode_play_count, name='increment_episode_play_count'),
]