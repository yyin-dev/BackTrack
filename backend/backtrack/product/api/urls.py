from django.urls import path

from .views import (
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
    CreateSprint,
    CreateProject,
    UserProjects,
    ProjectPBIS)

urlpatterns = [
    path('create/', AddPBI.as_view()),
    path('move/', MovePBI.as_view()),
    path('movetosprint/', MoveToSprint.as_view()),
    path('createsprint/', CreateSprint.as_view()),
    path('createproject/', CreateProject.as_view()),

    path('projectofuser/<userid>/', UserProjects.as_view()),
    path('projectpbis/<projectid>/', ProjectPBIS.as_view()),

    # Note that <pk> url should be put lower than urls above
    path('<pk>/', PBIDetailView.as_view()),
    path('<pk>/update/', PBIUpdateView.as_view()),
    path('<pk>/delete/', DeletePBI.as_view()),
    path('<pk>/movebackPBI/', MovebackPBI.as_view()),
    path('<pk>/movetonextsprint/', MoveToNextSprint.as_view()),
    path('<pk>/movebackPBIaftersprint/', MovebackPBIAfterSprint.as_view()),
    path('<pk>/startsprint/', StartSprint.as_view()),
]
