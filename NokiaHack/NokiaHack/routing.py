# video_meet/routing.py

from django.urls import re_path
from meet import consumers

websocket_urlpatterns = [
    re_path(r'ws/meet/(?P<meeting_id>\w+)/$', consumers.MeetingConsumer.as_asgi()),
]
