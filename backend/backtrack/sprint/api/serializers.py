from rest_framework import serializers

from sprint.models import Task

class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = ["id", "pbi", "name", "description", "status", "estimated_time", "pic"]