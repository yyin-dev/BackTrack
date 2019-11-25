from django.urls import path

from .views import (
    UserListView,
    UserSignup,
    UserLoginView
)

urlpatterns = [
    path('', UserListView.as_view()),
    path('signup/', UserSignup.as_view()),
    path('login/', UserLoginView.as_view()),
]