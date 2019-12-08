from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    UpdateAPIView)

from product.models import PBI, Sprint, Project
from sprint.models import Task
from user.models import User
from product.api.serializers import PBISerializerSprint, SprintSerializerSprint
from sprint.api.serializers import TaskSerializer

class SprintDetail(APIView):
    """
    Problem of caching for queryset:
    https://stackoverflow.com/questions/47479080/problems-with-cache-queryset-django-rest-framework
    https://www.django-rest-framework.org/api-guide/generic-views/
    https://www.django-rest-framework.org/api-guide/filtering/#filtering
    """
    serializer_class = SprintSerializerSprint

    def get(self, request, projectid, sprintno):
        project = Project.objects.get(pk=projectid)

        latest_sprint = project.get_latest_sprint()
        data = SprintSerializerSprint(latest_sprint).data

        return Response(data=data, status=status.HTTP_202_ACCEPTED)


class addTask(APIView):
    def post(self, request):
        pbi_object = PBI.objects.get(id=request.data['pbi'])
        new_task = Task(pbi=pbi_object,
                      name=request.data['name'],
                      description=request.data['description'],
                      status=request.data['status'],
                      estimated_time=request.data['estimated_time'],
                      pic=None)
        new_task.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class editTask(APIView):
    def post(self, request):
        task = Task.objects.get(id=request.data['id'])
        task.name = request.data['name']
        task.description = request.data['description']
        task.status = request.data['status']
        task.estimated_time = request.data['estimated_time']
        pic = User.objects.get(username=request.data['pic'])
        # task.pic = pic
        # task.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

class deleteTask(APIView):
    def delete(self, request, pk):
        cur_task = Task.objects.get(id=pk)
        cur_task.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)