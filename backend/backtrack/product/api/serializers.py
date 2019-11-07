from rest_framework import serializers

from product.models import PBI
from sprint.api.serializers import TaskSerializer

class PBISerializer(serializers.ModelSerializer):
    """
    Serialize Task within PBI:
    https://www.django-rest-framework.org/api-guide/relations/#nested-relationships
    """
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = PBI
        fields = ["id", "title", "detail", "status", "sprint_no", "start_date", "story_point", "priority", "tasks"]