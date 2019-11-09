from django.urls import path

app_name = "product"

from .views import (
    PBIListView,
    PBIDetailView,
    PBIUpdateView,
    addPBI,
    deletePBI,
    movePBI,
    moveToSprint,
    movebackPBI,
    moveToNextSprint,
    movebackPBIAfterSprint,
    getPBIInfo,)

urlpatterns = [
    path('', PBIListView.as_view()),
    path('create/', addPBI.as_view()),
    path('move/', movePBI.as_view()),
    path('movetosprint/', moveToSprint.as_view()),
    path('<pk>/', PBIDetailView.as_view()),
    path('<pk>/update/', PBIUpdateView.as_view()),
    path('<pk>/delete/', deletePBI.as_view()),
    path('<pk>/movebackPBI/', movebackPBI.as_view()),
<<<<<<< HEAD
<<<<<<< HEAD
    path('<pk>/movetonextsprint/', moveToNextSprint.as_view()),
    path('<pk>/movebackPBIaftersprint/', movebackPBIAfterSprint.as_view()),
    path('<pk>/getPBIInfo/', getPBIInfo.as_view()),
=======
    # path('<pk>/getPBIInfo/', getPBIInfo.as_view()),
>>>>>>> forget to delete useless code
=======
    # path('<pk>/getPBIInfo/', getPBIInfo.as_view()),
>>>>>>> c87b95608bfe70384e817410d482e0a64924ac7b
]
