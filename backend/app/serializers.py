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
    recycling_storage_name = serializers.CharField(
        source='recycling_storage.name', read_only=True
    )
    storage_id = serializers.IntegerField(
        source='recycling_storage.id', read_only=True
    )

    class Meta:
        model = StorageCleanupOrder
        fields = [
            'id',
            'description',
            'current_capacity',
            'approved_at',
            'storage_id',
            'recycling_storage_name',
        ]


class StorageCleanupOrderApprovedSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorageCleanupOrder
        fields = ['approved_at']

    def save(self, *argrs, **kwargs):
        order = super().save(*argrs, **kwargs)
        order.close()
        return order


class RecyclingStorageHistorySerializer(serializers.ModelSerializer):
    storage_id = serializers.IntegerField(
        source='recycling_storage.id', read_only=True
    )
    storage_name = serializers.CharField(
        source='recycling_storage.name', read_only=True
    )
    current_capacity = serializers.IntegerField(
        source='recycling_storage.capacity', read_only=True
    )
    storage_history_id = serializers.IntegerField(source='id', read_only=True)
    storage_history_created_at = serializers.DateTimeField(
        source='created_at', read_only=True, format='%Y-%m-%d %H:%M:%S'
    )
    storage_history_capacity = serializers.IntegerField(
        source='capacity', read_only=True
    )

    class Meta:
        model = RecyclingStorageHistory
        fields = [
            'storage_id',
            'storage_name',
            'current_capacity',
            'storage_history_id',
            'storage_history_capacity',
            'storage_history_created_at',
        ]


class StorageCleanupOrderHistorySerializer(serializers.ModelSerializer):
    storage_id = serializers.IntegerField(
        source='recycling_storage.id', read_only=True
    )
    storage_name = serializers.CharField(
        source='recycling_storage.name', read_only=True
    )
    current_capacity = serializers.IntegerField(
        source='recycling_storage.capacity', read_only=True
    )
    cleanup_order_capacity = serializers.IntegerField(
        source='current_capacity', read_only=True
    )
    cleanup_order_approved_at = serializers.DateTimeField(
        source='approved_at', read_only=True, format='%Y-%m-%d %H:%M:%S'
    )
    cleanup_order_closed_at = serializers.DateTimeField(
        source='closed_at', read_only=True, format='%Y-%m-%d %H:%M:%S'
    )

    class Meta:
        model = StorageCleanupOrder
        fields = [
            'storage_id',
            'storage_name',
            'current_capacity',
            'cleanup_order_capacity',
            'cleanup_order_approved_at',
            'cleanup_order_closed_at',
        ]
