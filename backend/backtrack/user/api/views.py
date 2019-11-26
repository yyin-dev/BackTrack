from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    UpdateAPIView,
    CreateAPIView)

from user.models import User
from product.models import Project
from .serializers import UserSerializer


class UserListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserSignup(APIView):
    def post(self, request):
        new_user = User.objects.create()
        new_user.username = request.data['username']
        new_user.password = request.data['password']
        if request.data['role'] == "Scrum Master":
            new_user.role = "Scrum Master"
        else:
            new_user.role = "Developer"
 
        new_user.save()
        return Response(status = status.HTTP_201_CREATED)

class UserLoginView(APIView):
    def post(self, request):
        # Need to use try/except block, otherwise you get:
        # user.models.User.DoesNotExist: User matching query does not exist.
        try:      
            possible_match = User.objects.get(username=request.data["username"])
        except User.DoesNotExist:
            possible_match = None

        if possible_match and possible_match.password == request.data["password"]:
            # https://www.django-rest-framework.org/api-guide/serializers/
            serialized = UserSerializer(possible_match).data
            return Response(data=serialized, status = status.HTTP_202_ACCEPTED)
        
        return Response(status = status.HTTP_401_UNAUTHORIZED)

class AddUserToProject(APIView):
    def post(self, request):
        user = User.objects.get(username=request.data['new_member_name'])
        project = Project.objects.get(name=request.data['project_name'])
        user.projects.add(project)
        user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
