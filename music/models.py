from django.db import models
from django.contrib.auth.models import User

class Song(models.Model):
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    album = models.CharField(max_length=200, blank=True)
    genre = models.CharField(max_length=100, blank=True)
    audio_file = models.FileField(upload_to='songs/')
    cover_image = models.ImageField(upload_to='covers/', blank=True, null=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    upload_date = models.DateTimeField(auto_now_add=True)
    play_count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.title} - {self.artist}"

    class Meta:
        ordering = ['-upload_date']

class Podcast(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    cover_image = models.ImageField(upload_to='podcast_covers/', blank=True, null=True)
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']

class Episode(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    audio_file = models.FileField(upload_to='episodes/')
    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE, related_name='episodes')
    published_date = models.DateTimeField(auto_now_add=True)
    play_count = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.podcast.title} - {self.title}"
    
    class Meta:
        ordering = ['-published_date']