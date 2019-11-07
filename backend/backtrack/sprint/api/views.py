from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    UpdateAPIView)

from product.models import PBI, Sprint
from product.api.serializers import PBISerializer


class TaskInSprintView(ListAPIView):
    latest_sprint = Sprint.objects.order_by('-no').first()
    queryset = PBI.objects.filter(sprint_no=latest_sprint.no)
    serializer_class = PBISerializer

