from django.urls import path

from .views import (
    UserListView,
    UserSignup,
    UserLoginView,
    AddUserToProject,
)

urlpatterns = [
    path('', UserListView.as_view()),
    path('signup/', UserSignup.as_view()),
    path('login/', UserLoginView.as_view()),
    path('addusertoproject/', AddUserToProject.as_view()),
]