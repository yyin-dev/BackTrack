from rest_framework import serializers

from user.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "role", "projects"]

class UserSerializerSprint(serializers.ModelSerializer):
    """
    User serializer used in Sprint Backlog page.
    """
    class Meta:
        model = User
        fields = ["id", "username"]