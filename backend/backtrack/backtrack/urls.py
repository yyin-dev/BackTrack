from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # provided by Django REST framework
    path('product/api/', include('product.api.urls')),

    # provided by native Django
    path('product/', include('product.urls'))
]
