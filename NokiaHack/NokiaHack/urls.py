# video_meet/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('meet/', include('meet.urls')),\
    path('home/', include('home.urls')),\
]