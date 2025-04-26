# meet/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer

class MeetingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get meeting_id from URL
        self.meeting_id = self.scope['url_route']['kwargs']['meeting_id']
        self.room_group_name = f'meeting_{self.meeting_id}'

        # Join the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive WebSocket message from the client
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json['type']

        # Send message to room group
        if message_type == 'leave':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'meeting_left',
                    'message': f'Meeting {self.meeting_id} ended'
                }
            )

    # Receive message from room group
    async def meeting_left(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))
