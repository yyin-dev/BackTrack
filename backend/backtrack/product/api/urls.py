from django.urls import path

from .views import (
    PBIListView,
    PBIDetailView,
    PBIUpdateView,
    AddPBI,
    DeletePBI,
    MovePBI,
    MoveToSprint,
    MovebackPBI,
    MoveToNextSprint,
    MovebackPBIAfterSprint,
    StartSprint,
    CreateSprint,)

urlpatterns = [
    path('', PBIListView.as_view()),
    path('create/', AddPBI.as_view()),
    path('move/', MovePBI.as_view()),
    path('movetosprint/', MoveToSprint.as_view()),
    path('createsprint/', CreateSprint.as_view()),

    # Note that <pk> url should be put lower than urls above
    path('<pk>/', PBIDetailView.as_view()),
    path('<pk>/update/', PBIUpdateView.as_view()),
    path('<pk>/delete/', DeletePBI.as_view()),
    path('<pk>/movebackPBI/', MovebackPBI.as_view()),
    path('<pk>/movetonextsprint/', MoveToNextSprint.as_view()),
    path('<pk>/movebackPBIaftersprint/', MovebackPBIAfterSprint.as_view()),
    path('<pk>/startsprint/', StartSprint.as_view()),
]
