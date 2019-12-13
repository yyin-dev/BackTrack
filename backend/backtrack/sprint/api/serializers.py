from rest_framework import serializers

from sprint.models import Task
from user.api.serializers import UserSerializerSprint


class TaskSerializer(serializers.ModelSerializer):
    pic = UserSerializerSprint(many=False, read_only=False)
    class Meta:
        model = Task
        fields = ["id", "pbi", "name", "description", "status", "estimated_time", "pic"]