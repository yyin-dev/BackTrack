from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('product/api/', include('product.api.urls')),
    path('sprint/api/', include('sprint.api.urls')),
    path('user/api/', include('user.api.urls')),
]
