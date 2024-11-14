from rest_framework import serializers

from app.models import (
    RecyclingStorage,
    RecyclingStorageHistory,
    StorageCleanupOrder,
)


class RecyclingStorageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecyclingStorage
        fields = ['id', 'name', 'description', 'capacity']

    def save(self, *argrs, **kwargs):
        recycling_storage = super().save(*argrs, **kwargs)

        order_pending = StorageCleanupOrder.objects.filter(
            recycling_storage=recycling_storage,
            approved_at__isnull=True,
        ).exists()

        if not order_pending:
            recycling_storage.create_cleanup_order()

        RecyclingStorageHistory.objects.create(
            recycling_storage=recycling_storage,
            capacity=recycling_storage.capacity,
        )
        return recycling_storage

    def validate_capacity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                'Capacity must be greater than 0'
            )

        if value > 100:
            raise serializers.ValidationError('Capacity must be less than 100')
        return value


class StorageCleanupOrderSerializer(serializers.ModelSerializer):
    recycling_storage_name = serializers.SerializerMethodField()

    class Meta:
        model = StorageCleanupOrder
        fields = [
            'id',
            'description',
            'current_capacity',
            'approved_at',
            'recycling_storage_name',
        ]

    def get_recycling_storage_name(self, obj):
        return obj.recycling_storage.name if obj.recycling_storage else None


class StorageCleanupOrderApprovedSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorageCleanupOrder
        fields = ['approved_at']

    def save(self, *argrs, **kwargs):
        order = super().save(*argrs, **kwargs)
        order.close()
        return order
