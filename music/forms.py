# music/forms.py

from django import forms
from .models import Song, Podcast, Episode

# ऑडियो फाइलों को वैलिडेट करने के लिए एक कस्टम फंक्शन
def validate_audio_file(value):
    # स्वीकार किए जाने वाले ऑडियो फॉर्मेट
    valid_extensions = ['.mp3', '.wav', '.ogg', '.m4a', '.flac']
    import os
    ext = os.path.splitext(value.name)[1]  # फाइल का एक्सटेंशन निकालें
    if not ext.lower() in valid_extensions:
        raise forms.ValidationError('कृपया केवल ऑडियो फाइलें (mp3, wav, ogg, m4a, flac) अपलोड करें।')

class SongUploadForm(forms.ModelForm):
    class Meta:
        model = Song
        fields = ['title', 'artist', 'album', 'genre', 'audio_file', 'cover_image']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'artist': forms.TextInput(attrs={'class': 'form-control'}),
            'album': forms.TextInput(attrs={'class': 'form-control'}),
            'genre': forms.TextInput(attrs={'class': 'form-control'}),
            'audio_file': forms.FileInput(attrs={'class': 'form-control'}),
            'cover_image': forms.FileInput(attrs={'class': 'form-control'}),
        }

    # audio_file फील्ड के लिए वैलिडेटर जोड़ें
    def clean_audio_file(self):
        audio_file = self.cleaned_data.get('audio_file')
        if audio_file:
            validate_audio_file(audio_file)
        return audio_file

class PodcastUploadForm(forms.ModelForm):
    class Meta:
        model = Podcast
        fields = ['title', 'description', 'cover_image']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'cover_image': forms.FileInput(attrs={'class': 'form-control'}),
        }

class EpisodeUploadForm(forms.ModelForm):
    class Meta:
        model = Episode
        fields = ['title', 'description', 'audio_file']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'audio_file': forms.FileInput(attrs={'class': 'form-control'}),
        }

    # audio_file फील्ड के लिए वैलिडेटर जोड़ें
    def clean_audio_file(self):
        audio_file = self.cleaned_data.get('audio_file')
        if audio_file:
            validate_audio_file(audio_file)
        return audio_file