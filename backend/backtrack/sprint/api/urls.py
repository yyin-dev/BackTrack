from django.urls import path

app_name = "sprint"

from .views import (
    TaskInSprintView
)

urlpatterns = [
    path('', TaskInSprintView.as_view()),
]
