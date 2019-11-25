from django.contrib import admin

from .models import PBI, Sprint, Project

# Register your models here.
admin.site.register(PBI)
admin.site.register(Sprint)
admin.site.register(Project)