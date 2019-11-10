from rest_framework import serializers

from product.models import PBI, Sprint
from sprint.api.serializers import TaskSerializer

class PBISerializerSprint(serializers.ModelSerializer):
    """
    PBI serializer used in Sprint Backlog page.
    https://www.django-rest-framework.org/api-guide/relations/#nested-relationships
    """
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = PBI
        fields = ["id", "title", "detail", "status", "start_date", "story_point", "priority", "tasks"]


class PBISerializerProduct(serializers.ModelSerializer):
    """
    PBI serializer used in Product Backlog page.
    https://stackoverflow.com/questions/14573102/how-do-i-include-related-model-fields-using-django-rest-framework
    https://www.django-rest-framework.org/api-guide/serializers/#specifying-nested-serialization
    """
    class Meta:
        model = PBI
        fields = ["id", "title", "detail", "status", "start_date", "story_point", "priority", "sprint"]
        depth = 1


class SprintSerializerProduct(serializers.ModelSerializer):
    """
    Sprint serializer used in Sprint Backlog page.
    """
    class Meta:
        model = Sprint
        fields = ["id", "no", "capacity"]


class SprintSerializerSprint(serializers.ModelSerializer):
    """
    Sprint serializer used in Product Backlog page.
    https://www.django-rest-framework.org/api-guide/relations/#nested-relationships
    """
    
    # PBIs belong to this sprint would also be serialized.
    pbis = PBISerializerSprint(many=True, read_only=True)

    class Meta:
        model = Sprint
        fields = ["id", "no", "capacity", "pbis", "status"]
