# from django.http import HttpResponse
# from django.shortcuts import render
# from django.http import HttpResponseRedirect
# from django.urls import reverse
# #from .models import Flight, Passenger
# # Create your views here.
# def index(request):
#     return render(request, "flights/index.html", {"flights": Flight.objects.all()})

# def room(request):
#     return render(request, ) # should render a google meet.

# # def flight(request, flight_id):
# #     flight = Flight.objects.get(id=flight_id)
# #     return render(request, "flights/flight.html", {"flight": flight, "passengers": flight.passengers.all(), "non_passengers": Passenger.objects.exclude(flights=flight).all()})

# # def book(request, flight_id):
# #     if request.method == "POST":
# #         flight = Flight.objects.get(pk=flight_id)
# #         passenger = Passenger.objects.get(pk=int(request.POST["passenger"]))
# #         passenger.flights.add(flight)
# #         return HttpResponseRedirect(reverse("flight", args=(flight.id,)))

from django.shortcuts import render, get_object_or_404
from .models import Meeting

def meeting_room(request, meeting_id):
    meeting = get_object_or_404(Meeting, meeting_id=meeting_id)
    return render(request, 'meet/room.html', {'meeting': meeting})

