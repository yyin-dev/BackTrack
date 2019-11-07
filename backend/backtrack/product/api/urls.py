from django.urls import path

app_name = "product"

from .views import (
    PBIListView,
    PBIDetailView,
    PBIUpdateView,
    addPBI,
    deletePBI,
    movePBI)

urlpatterns = [
    path('', PBIListView.as_view()),
    path('create/', addPBI.as_view()),
    path('move/', movePBI.as_view()),
    path('<pk>/', PBIDetailView.as_view()),
    path('<pk>/update/', PBIUpdateView.as_view()),
    path('<pk>/delete/', deletePBI.as_view())
]
