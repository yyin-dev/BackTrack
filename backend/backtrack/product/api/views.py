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
        user.projects.remove(projectid)
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserProjects(APIView):
    def get(self, request, userid):
        user = User.objects.get(id=userid)
        projects = user.projects.all()
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
        pbis = project.pbis.all()
        serialized = PBISerializerProduct(pbis, many=True).data

        return Response(data=serialized, status=status.HTTP_202_ACCEPTED)


class PBIDetailView(RetrieveAPIView):
    queryset = PBI.objects.all()
    serializer_class = PBISerializerProduct


class PBIUpdateView(UpdateAPIView):
    queryset = PBI.objects.all()
    serializer_class = PBISerializerProduct


class MoveToSprint(APIView):
    """
    Set the sprint_no of the selected PBI to the latest Sprint
    """
    def post(self, request):
        pbiid = request.data["pbiid"]
        projectid = request.data["projectid"]
        sprintno = request.data["sprintno"]

        cur_pbi = PBI.objects.get(id=pbiid)
        cur_project = Project.objects.get(id=projectid)

        # Try to get current Sprint object
        sprint = Sprint.objects.get(no=sprintno, project=cur_project)

        cur_pbi.sprint = sprint

        cur_pbi.status = "In Progress"
        cur_pbi.save()

        return Response(status=status.HTTP_202_ACCEPTED)


class MovePBI(APIView):
    def post(self, request):
        priority = int(request.data['priority'])
        target1 = PBI.objects.get(priority=priority)

        if request.data['option'] == 'up':
            if priority == 1:
                return Response(status=status.HTTP_204_NO_CONTENT)

            target2 = PBI.objects.get(priority=priority-1)
        elif request.data['option'] == 'down':
            if priority == len(PBI.objects.all()):
                return Response(status=status.HTTP_204_NO_CONTENT)

            target2 = PBI.objects.get(priority=priority+1)

        temp = target1.priority
        target1.priority = target2.priority
        target2.priority = temp

        target1.save()
        target2.save()

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
        for pbi in PBI.objects.all():
            pbi.priority += 1
            pbi.save()

        return Response(status=status.HTTP_201_CREATED)


class DeletePBI(APIView):
    def delete(self, request, pk):
        cur_pbi = PBI.objects.get(id=pk)
        current_priority = cur_pbi.priority
        cur_pbi.delete()

        # update the priority
        for pbi in PBI.objects.filter(priority__gt=current_priority):
            pbi.priority -= 1
            pbi.save()

        return Response(status=status.HTTP_202_ACCEPTED)


class MovebackPBI(APIView):
    def post(self, request, pk):
        newStatus = request.data["newStatus"]

        cur_pbi = PBI.objects.get(id=pk)
        cur_pbi.status = newStatus
        cur_pbi.sprint = None

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

        cur_pbi = PBI.objects.get(id=id)
        cur_pbi.title = newTitle
        cur_pbi.story_point = newStoryPoint
        cur_pbi.status = "To Do"

        prev_sprint_no = cur_pbi.sprint.no
        new_sprint_no = prev_sprint_no + 1
        new_sprint = Sprint.objects.get(no=new_sprint_no)
        cur_pbi.sprint = new_sprint
        cur_pbi.save()

        return Response(status=status.HTTP_202_ACCEPTED)


class MovebackPBIAfterSprint(APIView):
    def post(self, request, pk):
        id = request.data["id"]
        newTitle = request.data["newTitle"]
        newStoryPoint = request.data["newStoryPoint"]
        newStatus = request.data["newStatus"]

        cur_pbi = PBI.objects.get(id=id)
        cur_pbi.title = newTitle
        cur_pbi.story_point = newStoryPoint
        cur_pbi.status = newStatus
        print(newStatus)

        # newStatus == "Unfinished": unfinished task, set Sprint to None
        # newStatus == "Done"      : finished task, Sprint unchanged
        if newStatus == "Unfinished":
            cur_pbi.sprint = None
        cur_pbi.save()
        return Response(status=status.HTTP_202_ACCEPTED)


class StartSprint(APIView):
    def post(self, request, pk):
        sprint = Sprint.objects.get(pk=pk)
        sprint.status = "Started"
        sprint.save()

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
        newProject = Project.objects.create(name=name, description=desc)

        user_data = request.data['user']
        user = User.objects.get(username=user_data['username'])
        user.role = "Product Owner"
        user.projects.add(newProject)

        newProject.save()
        user.save()

        return Response(status=status.HTTP_201_CREATED)

class StartProject(APIView):
    def post(self, request):
        project = Project.objects.get(id=request.data['project_id'])
        project.started = True
        project.save()
        newSprint = Sprint.objects.create(no=1, capacity=10, status="Created", project=project)
        newSprint.save()
        return Response(status=status.HTTP_201_CREATED)


class EndProject(APIView):
    def post(self, request):
        user = User.objects.get(id=request.data['user_id'])
        user.role = "Developer"
        user.save()
        project = Project.objects.get(id=request.data['project_id'])
        project.delete()
        return Response(status=status.HTTP_201_CREATED)
