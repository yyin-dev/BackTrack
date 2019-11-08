from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    UpdateAPIView)

from product.models import PBI, Sprint
from sprint.models import Task
from product.api.serializers import PBISerializer
from sprint.api.serializers import TaskSerializer

class TaskInSprintView(ListAPIView):
    """
    Returns all PBIs in latest sprint.
    """
    latest_sprint = Sprint.objects.order_by('-no').first()
    queryset = PBI.objects.filter(sprint_no=latest_sprint.no)
    serializer_class = PBISerializer

class addTask(APIView):
    def post(self, request):
        new_task = Task(pbi=request.data['pbi'],
                      name=request.data['name'],
                      description=request.data['description'],
                      status=request.data['status'],
                      estimated_time=request.data['estimated_time'],
                      pic=request.data['pic'])
        new_task.save()

        return Response(status=status.HTTP_204_NO_CONTENT)