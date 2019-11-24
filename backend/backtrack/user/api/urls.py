from django.urls import path

from .views import (
    UserListView,
    UserCreateView,
    UserLoginView
)

urlpatterns = [
    path('', UserListView.as_view()),
    path('signup/', UserCreateView.as_view()),
    path('login/', UserLoginView.as_view()),
]