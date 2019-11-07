from rest_framework import serializers

from product.models import PBI

class PBISerializer(serializers.ModelSerializer):
    class Meta:
        model = PBI
        fields = '__all__'