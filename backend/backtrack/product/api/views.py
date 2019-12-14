"""
References:
https://stackoverflow.com/questions/26445450/how-to-delete-an-object-using-django-rest-framework
https://www.django-rest-framework.org/api-guide/views/#api-policy-implementation-methods

Define the method you want to handle. Request would contain the json of the
request sent by axios. Other remaining arguments would be the parameter in url
in urls.py.

Views responding to GET can use Generic View from Django REST framework, while
others responding to POST and DELETE needs customized operation. Writing views
in Django REST framwork is similar to writing views in Django directly. In this
way, we can move all urls matching and views to /api.
"""

from django.db.models import F  
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    UpdateAPIView,)

from product.models import PBI, Sprint, Project
from user.models import User
from .serializers import PBISerializerProduct, ProjectSerializer
from user.api.serializers import UserSerializer

class InviteMembers(APIView):
    def get(self, request):
        queryset = User.objects.all()
        serializer_class = UserSerializer


class CancelMember(APIView):
    def post(self, request):
        userid = request.data['user_id']
        projectid = request.data['project_id']
        user = User.objects.get(id=userid)

        user.quit_project(projectid)

        return Response(status=status.HTTP_204_NO_CONTENT)


class UserProjects(APIView):
    def get(self, request, userid):
        user = User.objects.get(id=userid)
        projects = user.get_projects()
        serialized = ProjectSerializer(projects, many=True).data

        return Response(data=serialized, status=status.HTTP_202_ACCEPTED)


class ProjectById(APIView):
    def get(self, request, projectid):
        project = Project.objects.get(id=projectid)
        serialized = ProjectSerializer(project).data

        return Response(data=serialized, status=status.HTTP_202_ACCEPTED)


class ProjectPBIS(APIView):
    def get(self, request, projectid):
        project = Project.objects.get(id=projectid)
        pbis = project.get_pbis().order_by(F('priority').asc(nulls_last=True))
        serialized = PBISerializerProduct(pbis, many=True).data

        return Response(data=serialized, status=status.HTTP_202_ACCEPTED)


class PBIDetailView(RetrieveAPIView):
    queryset = PBI.objects.all()
    serializer_class = PBISerializerProduct


class PBIUpdateView(UpdateAPIView):
    queryset = PBI.objects.all()
    serializer_class = PBISerializerProduct


class MoveToSprint(APIView):
    def post(self, request):
        pbiid = request.data["pbiid"]
        projectid = request.data["projectid"]
        sprintno = request.data["sprintno"]

        cur_pbi = PBI.objects.get(id=pbiid)
        cur_project = Project.objects.get(id=projectid)
        sprint = Sprint.objects.get(no=sprintno, project=cur_project)

        cur_pbi.move_to_sprint(sprint)        

        return Response(status=status.HTTP_202_ACCEPTED)


class MovePBI(APIView):
    def post(self, request):
        priority = int(request.data['priority'])
        project = Project.objects.get(id=request.data['projectId'])
        option = request.data['option']

        pbi = PBI.objects.filter(project=project, priority=priority)[0]
        pbi.move(option)

        return Response(status=status.HTTP_202_ACCEPTED)


class AddPBI(APIView):
    def post(self, request):
        parentProject = Project.objects.get(id=request.data['projectId'])

        new_pbi = PBI(title=request.data['title'],
                      detail=request.data['detail'],
                      story_point=request.data['story_point'],
                      project=parentProject,
                      # Default values
                      status="To Do",
                      start_date="2019-01-01",
                      priority=0)
        new_pbi.save()

        # update the priority
        for pbi in PBI.objects.filter(project=parentProject):
            pbi.priority += 1
            pbi.save()

        return Response(status=status.HTTP_201_CREATED)


class DeletePBI(APIView):
    def delete(self, request, pk):
        cur_pbi = PBI.objects.get(id=pk)
        cur_pbi.delete_and_update_priority()

        return Response(status=status.HTTP_202_ACCEPTED)


class MovebackPBI(APIView):
    def post(self, request, pk):
        newStatus = request.data["newStatus"]

        cur_pbi = PBI.objects.get(id=pk)
        cur_pbi.move_back_during_sprint(newStatus)
        cur_pbi.save()
        return Response(status=status.HTTP_202_ACCEPTED)


class MoveToNextSprint(APIView):
    """
    Assumption: the new sprint has already been created.

    Set the sprint_no of the selected PBI to the latest Sprint.
    """
    def post(self, request, pk):
        id = request.data["id"]
        newTitle = request.data["newTitle"]
        newStoryPoint = request.data["newStoryPoint"]
        project_id = request.data["projectId"]

        cur_pbi = PBI.objects.get(id=id)
        project = Project.objects.get(id=project_id)
        cur_pbi.move_to_next_sprint(newTitle,newStoryPoint,"In Progress",project)

        return Response(status=status.HTTP_202_ACCEPTED)


class MovebackPBIAfterSprint(APIView):
    def post(self, request, pk):
        id = request.data["id"]
        newTitle = request.data["newTitle"]
        newStoryPoint = request.data["newStoryPoint"]
        newStatus = request.data["newStatus"]

        cur_pbi = PBI.objects.get(id=id)
        cur_pbi.move_back_at_sprint_end(newTitle, newStoryPoint, newStatus)

        return Response(status=status.HTTP_202_ACCEPTED)


class StartSprint(APIView):
    def post(self, request, pk):
        sprint = Sprint.objects.get(pk=pk)
        sprint.start()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CreateSprint(APIView):
    def post(self, request):
        # https://stackoverflow.com/questions/844591/how-to-do-select-max-in-django/844614
        from django.db.models import Max
        currNo = request.data["sprintno"]
        currProj = Project.objects.get(id=request.data["projectid"])
        cap = request.data["sprintCapacity"]

        newSprint = Sprint.objects.create(no=currNo, capacity=cap, status="Created",project=currProj)
        newSprint.save()
        return Response(status=status.HTTP_201_CREATED)


class CreateProject(APIView):
    def post(self, request):
        name = request.data['project_name']
        desc = request.data['project_description']
        user_data = request.data['user']

        user = User.objects.get(username=user_data['username'])
        user.create_project(name, desc)

        return Response(status=status.HTTP_201_CREATED)


class StartProject(APIView):
    def post(self, request):
        project = Project.objects.get(id=request.data['project_id'])
        project.start()
        return Response(status=status.HTTP_201_CREATED)


class EndProject(APIView):
    def post(self, request):
        user = User.objects.get(id=request.data['user_id'])
        project = Project.objects.get(id=request.data['project_id'])
        project.end(user)

        return Response(status=status.HTTP_201_CREATED)
