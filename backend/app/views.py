from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from app.models import RecyclingStorage, StorageCleanupOrder
from app.serializers import (
    RecyclingStorageSerializer,
    StorageCleanupOrderApprovedSerializer,
    StorageCleanupOrderSerializer,
)


class RecyclingStorageView(APIView):
    def get(self, request):
        storages = RecyclingStorage.objects.all()
        serializer = RecyclingStorageSerializer(storages, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RecyclingStorageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        try:
            storage = RecyclingStorage.objects.get(pk=pk)
        except RecyclingStorage.DoesNotExist:
            return Response(
                {'error': 'Storage not found'},
                status=status.HTTP_404_NOT_FOUND,
            )
        storage.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, pk, format=None):
        try:
            storage = RecyclingStorage.objects.get(pk=pk)
        except RecyclingStorage.DoesNotExist:
            return Response(
                {'error': 'Storage not found'},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = RecyclingStorageSerializer(
            storage, data=request.data, partial=True
        )
        if not serializer.is_valid():
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        serializer.save()
        return Response(serializer.data)


class StorageCleanupOrderView(APIView):
    def get(self, request):
        cleanup_orders = StorageCleanupOrder.objects.filter(
            closed_at=None
        ).all()
        serializer = StorageCleanupOrderSerializer(cleanup_orders, many=True)
        return Response(serializer.data)

    def patch(self, request, pk, format=None):
        try:
            order = StorageCleanupOrder.objects.get(pk=pk)
        except StorageCleanupOrder.DoesNotExist:
            return Response(
                {'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = StorageCleanupOrderApprovedSerializer(
            order, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            order.recycling_storage.clean_capacity()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
