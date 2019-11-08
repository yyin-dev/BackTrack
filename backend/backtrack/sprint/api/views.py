from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    UpdateAPIView)

from product.models import PBI, Sprint
from sprint.models import Task
from product.api.serializers import PBISerializerSprint, SprintSerializerSprint
from sprint.api.serializers import TaskSerializer

class TaskInSprintView(ListAPIView):
    """
    Returns all PBIs in latest sprint.
    
    The return value is an list containing ONE SINGLE sprint object. The reason
    is that we used ListAPIView and a list is expected.
    """
    queryset = Sprint.objects.none()
    sprints = Sprint.objects.order_by('-no')
    latest_sprint = None
    if sprints:
        latest_sprint = sprints.first()
        queryset = Sprint.objects.filter(no=latest_sprint.no)

    serializer_class = SprintSerializerSprint

class addTask(APIView):
    def post(self, request):
        pbi_object = PBI.objects.get(id=request.data['pbi'])
        new_task = Task(pbi=pbi_object,
                      name=request.data['name'],
                      description=request.data['description'],
                      status=request.data['status'],
                      estimated_time=request.data['estimated_time'],
                      pic=request.data['pic'])
        new_task.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

class editTask(APIView):
    def post(self, request):
        task = Task.objects.get(id=request.data['id'])
        task.name = request.data['name']
        task.description = request.data['description']
        task.status = request.data['status']
        task.estimated_time = request.data['estimated_time']
        task.pic = request.data['pic']
        task.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

class deleteTask(APIView):
    def delete(self, request, pk):
        cur_task = Task.objects.get(id=pk)
        cur_task.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)