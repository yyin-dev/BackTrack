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
    StartProject,
    EndProject,
    ProjectPBIS,
    ProjectById,
    InviteMembers,
    CancelMember)

urlpatterns = [
    path('create/', AddPBI.as_view()),
    path('move/', MovePBI.as_view()),
    path('movetosprint/', MoveToSprint.as_view()),
    path('createsprint/', CreateSprint.as_view()),
    path('createproject/', CreateProject.as_view()),

    path('projectofuser/<userid>/', UserProjects.as_view()),
    path('projectbyid/<projectid>/', ProjectById.as_view()),

    path('projectpbis/<projectid>/', ProjectPBIS.as_view()),

    path('invitemembers/', InviteMembers.as_view()),
    path('cancelmember/', CancelMember.as_view()),
    path('startproject/', StartProject.as_view()),
     path('endproject/', EndProject.as_view()),


    # Note that <pk> url should be put lower than urls above
    path('<pk>/', PBIDetailView.as_view()),
    path('<pk>/update/', PBIUpdateView.as_view()),
    path('<pk>/delete/', DeletePBI.as_view()),
    path('<pk>/movebackPBI/', MovebackPBI.as_view()),
    path('<pk>/movetonextsprint/', MoveToNextSprint.as_view()),
    path('<pk>/movebackPBIaftersprint/', MovebackPBIAfterSprint.as_view()),
    path('<pk>/startsprint/', StartSprint.as_view()),
]
