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
from django.contrib import admin
from django.urls import path

from app.views import (
    RecyclingStorageHistoryView,
    RecyclingStorageView,
    StorageCleanupOrderHistoryView,
    StorageCleanupOrderView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('storages/', RecyclingStorageView.as_view(), name='storages'),
    path(
        'storages/history/download/',
        RecyclingStorageHistoryView.as_view(),
        name='download-storage-history',
    ),
    path(
        'storages/<int:pk>/',
        RecyclingStorageView.as_view(),
        name='update_storages',
    ),
    path(
        'cleanup-orders/',
        StorageCleanupOrderView.as_view(),
        name='cleanup_orders',
    ),
    path(
        'cleanup-orders/history/download/',
        StorageCleanupOrderHistoryView.as_view(),
        name='download-cleanup-orders-history',
    ),
    path(
        'cleanup-orders/<int:pk>/',
        StorageCleanupOrderView.as_view(),
        name='update_cleanup_orders',
    ),
]
