from django.urls import path

app_name = "sprint"

from .views import (
    TaskInSprintView,
    addTask,
    deleteTask
)

urlpatterns = [
    path('', TaskInSprintView.as_view()),
    path('create/', addTask.as_view()),
    path('<pk>/delete/', deleteTask.as_view())
]
