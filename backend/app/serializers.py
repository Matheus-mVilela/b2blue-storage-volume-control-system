from rest_framework import serializers
from app.models import RecyclingStorage, StorageCleanupOrder


class RecyclingStorageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecyclingStorage
        fields = ['id', 'name', 'description', 'capacity']

    def save(self, *argrs, **kwargs):
        recycling_storage = super().save(*argrs, **kwargs)
        recycling_storage.create_cleanup_order()
        return recycling_storage


class StorageCleanupOrderSerializer(serializers.ModelSerializer):
    recycling_storage_name = serializers.SerializerMethodField()

    class Meta:
        model = StorageCleanupOrder
        fields = [
            'id',
            'description',
            'current_capacity',
            'approved_at',
            'recycling_storage_name'
            ]

    def get_recycling_storage_name(self, obj):
        return obj.recycling_storage.name if obj.recycling_storage else None


class StorageCleanupOrderApprovedSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorageCleanupOrder
        fields = ['approved_at']
