from django.urls import path

app_name = "sprint"

from .views import (
    SprintDetail,
    addTask,
    editTask,
    deleteTask
)

urlpatterns = [
    path('project-sprint/<projectid>/<sprintno>/', SprintDetail.as_view()),
    path('create/', addTask.as_view()),
    path('edit/', editTask.as_view()),
    path('<pk>/delete/', deleteTask.as_view()),

    
]
