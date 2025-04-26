from django.shortcuts import render, redirect
from home.form import MeetingForm
from meet.models import Meeting

def index(request):
    meetings = Meeting.objects.all()  # Get all meetings

    # Handle form submission for creating a new meeting
    if request.method == 'POST':
        form = MeetingForm(request.POST)
        if form.is_valid():
            new_meeting = form.save(commit=False)
            new_meeting.host = request.user  # Set the host to the currently logged-in user
            new_meeting.save()
            return redirect('index')  # Redirect to the index page after the meeting is created
    else:
        form = MeetingForm()

    return render(request, 'home/index.html', {'meetings': meetings, 'form': form})

