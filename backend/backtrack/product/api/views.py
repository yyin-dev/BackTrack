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
    UpdateAPIView)

from product.models import PBI, Sprint
from .serializers import PBISerializerProduct


class PBIListView(ListAPIView):
    queryset = PBI.objects.all()
    serializer_class = PBISerializerProduct


class PBIDetailView(RetrieveAPIView):
    queryset = PBI.objects.all()
    serializer_class = PBISerializerProduct


class PBIUpdateView(UpdateAPIView):
    queryset = PBI.objects.all()
    serializer_class = PBISerializerProduct


class moveToSprint(APIView):
    """
    Set the sprint_no of the selected PBI to the latest Sprint
    """
    def post(self, request):
        id = request.data["id"]
        cur_pbi = PBI.objects.get(id=id)

        # Try to get current Sprint object
        latest_sprint = Sprint.objects.order_by('-no').first()

        if not latest_sprint:
            spr = Sprint.objects.create(no=1)
            spr.save()
            cur_pbi.sprint = spr
        else:
            cur_pbi.sprint = latest_sprint

        cur_pbi.status = "In Progress"
        cur_pbi.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

class moveToNextSprint(APIView):
    """
    Create a new Sprint.
    Set the sprint_no of the selected PBI to the latest Sprint
    """
    def post(self, request, pk):
        id = request.data["id"]
        newTitle = request.data["newTitle"]
        newStoryPoint = request.data["newStoryPoint"]
        newCapacity = request.data["sprintCapacity"]

        cur_pbi = PBI.objects.get(id=id)
        cur_pbi.title = newTitle
        cur_pbi.story_point = newStoryPoint
        cur_pbi.status = "To Do"

        newSprintNo = cur_pbi.sprint.no + 1
        newSprint = Sprint.objects.create(no=newSprintNo, capacity=newCapacity)
        newSprint.save()
        cur_pbi.sprint = newSprint
        cur_pbi.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class addPBI(APIView):
    def post(self, request):
        new_pbi = PBI(title=request.data['title'],
                      detail=request.data['detail'],
                      story_point=request.data['story_point'],

                      # Default values
                      status="To Do",
                      start_date="2019-01-01",
                      priority=0)
        new_pbi.save()

        # update the priority
        for pbi in PBI.objects.all():
            pbi.priority += 1
            pbi.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class deletePBI(APIView):
    def delete(self, request, pk):
        cur_pbi = PBI.objects.get(id=pk)
        current_priority = cur_pbi.priority
        cur_pbi.delete()

        # update the priority
        for pbi in PBI.objects.filter(priority__gt=current_priority):
            pbi.priority -= 1
            pbi.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class movebackPBI(APIView):
    def post(self, request, pk):
        cur_pbi = PBI.objects.get(id=pk)
        cur_pbi.status = "To Do"
        cur_pbi.sprint = None
        cur_pbi.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    
class movebackPBIAfterSprint(APIView):
    def post(self, request, pk):
        id = request.data["id"]
        newTitle = request.data["newTitle"]
        newStoryPoint = request.data["newStoryPoint"]

        cur_pbi = PBI.objects.get(id=id)
        cur_pbi.title = newTitle
        cur_pbi.story_point = newStoryPoint
        cur_pbi.status = "To Do"

        cur_pbi.sprint = None
        cur_pbi.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class getPBIInfo(APIView):
        def post(self, request, pk):
            # print(request.data)

            queryset = PBI.objects.get(title=pk)
            serializer_class = PBISerializerProduct
            # return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(queryset)


class movePBI(APIView):
    def post(self, request):
        print(request.data)
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

        return Response(status=status.HTTP_204_NO_CONTENT)
