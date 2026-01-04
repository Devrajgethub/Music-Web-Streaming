from django.contrib import admin
from .models import Song, Podcast  # यहाँ Podcast को भी import करें

# Song के लिए पहले से ही आपका कोड है
@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ['title', 'artist', 'album', 'genre', 'uploaded_by', 'upload_date', 'play_count']
    list_filter = ['genre', 'upload_date', 'uploaded_by']
    search_fields = ['title', 'artist', 'album']
    readonly_fields = ['upload_date', 'play_count']


# Podcast के लिए सरलीकृत कोड
@admin.register(Podcast)
class PodcastAdmin(admin.ModelAdmin):
    # केवल बुनियादी फील्ड्स का उपयोग करें
    list_display = ('title',)  # केवल title फील्ड का उपयोग करें, जो हर मॉडल में होता है
    
    # केवल title में सर्च करें
    search_fields = ('title',)
    
    # कोई readonly_fields नहीं
    # readonly_fields = ()  # इसे कमेंट कर दिया है
    
    # कोई list_filter नहीं
    # list_filter = ()  # इसे कमेंट कर दिया है