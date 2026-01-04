# users/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import Profile, Notification  # <-- IMPORTANT: Import Notification model here

# This inline form allows you to edit the Profile directly from the User admin page
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'

# This customizes the default User admin page to include the Profile inline form
class CustomUserAdmin(UserAdmin):
    inlines = (ProfileInline,)

# --- Register the models with the Django admin site ---

# 1. Unregister the default User admin
admin.site.unregister(User)

# 2. Register our custom User admin that includes the Profile
admin.site.register(User, CustomUserAdmin)

# 3. Register the Notification model so it appears in the admin panel
admin.site.register(Notification)