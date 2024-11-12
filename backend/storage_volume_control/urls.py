"""
URL configuration for storage_volume_control project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from app.views import RecyclingStorageView, StorageCleanupOrderView
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('storages/', RecyclingStorageView.as_view(), name='storages'),
    path(
        'cleanup-orders/',
        StorageCleanupOrderView.as_view(),
        name='cleanup_orders',
    ),
    path(
        'cleanup-orders/<int:pk>/',
        StorageCleanupOrderView.as_view(),
        name='update_cleanup_orders',
    ),
]
