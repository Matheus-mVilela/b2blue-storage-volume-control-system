from datetime import datetime, timezone

from django.db import models


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class RecyclingStorage(BaseModel):
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=300)
    capacity = models.FloatField(default=0.0)

    def create_cleanup_order(self):
        if self.capacity >= 80:
            cleanup_order = StorageCleanupOrder.objects.create(
                recycling_storage=self,
                current_capacity=self.capacity,
            )
            return cleanup_order
        else:
            return None

    def clean_capacity(self):
        self.capacity = 0.0
        self.save()
        return self


class StorageCleanupOrder(BaseModel):
    description = models.TextField(max_length=300, null=True)
    current_capacity = models.FloatField()
    approved_at = models.DateTimeField(null=True)
    closed_at = models.DateTimeField(null=True)

    recycling_storage = models.ForeignKey(
        RecyclingStorage,
        on_delete=models.CASCADE,
        related_name='cleanup_orders',
    )

    def close(self):
        self.closed_at = datetime.now(timezone.utc)
        self.save()
        return self
