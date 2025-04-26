import random
import string
from django.db import models
from django.contrib.auth.models import User

class Meeting(models.Model):
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    meeting_id = models.CharField(max_length=100, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=200)

    def generate_meeting_id(self):
        """Generate a unique meeting ID using random letters and numbers."""
        length = 8  # Customize the length as needed
        meeting_id = ''.join(random.choices(string.ascii_letters + string.digits, k=length))

        # Ensure uniqueness by checking if the generated meeting_id already exists
        while Meeting.objects.filter(meeting_id=meeting_id).exists():
            meeting_id = ''.join(random.choices(string.ascii_letters + string.digits, k=length))

        return meeting_id

    def save(self, *args, **kwargs):
        """Override save method to auto-generate meeting_id before saving."""
        if not self.meeting_id:
            self.meeting_id = self.generate_meeting_id()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title