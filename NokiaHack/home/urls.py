# video_meet/urls.py

from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),  # Home page view
    path('admin/', admin.site.urls),
]