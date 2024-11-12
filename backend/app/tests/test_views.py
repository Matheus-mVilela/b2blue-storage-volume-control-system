from datetime import datetime, timezone
from random import randint

from rest_framework.test import APITestCase
from rest_framework import status
from app.models import RecyclingStorage, StorageCleanupOrder


class RecyclingStorageViewTest(APITestCase):
    def setUp(self):
        self.storage_data = {
            'name': 'Storage 1',
            'description': 'Fake Descriptions',
        }
        self.url = 'http://0.0.0.0:8000/storages/'

    def test_get_recycling_storages(self):
        recycling_storage = RecyclingStorage.objects.create(
            **self.storage_data
        )
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)
        expected_response = [
            {
                'id': recycling_storage.id,
                'name': recycling_storage.name,
                'description': recycling_storage.description,
                'capacity': recycling_storage.capacity
            }
        ]
        self.assertEqual(expected_response, response.json())

    def test_post_recycling_storage(self):
        response = self.client.post(self.url, self.storage_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(RecyclingStorage.objects.count(), 1)
        self.assertEqual(RecyclingStorage.objects.first().name, 'Storage 1')

    def test_post_invalid_recycling_storage(self):
        invalid_data = {}
        response = self.client.post(self.url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class StorageCleanupOrderViewTest(APITestCase):
    def setUp(self):
        self.now = datetime.now(timezone.utc)
        self.recycling_storage = RecyclingStorage.objects.create(
            name='Storage 1'
            )
        self.cleanup_order_data = {
            'description': 'Cleanup order 1',
            'current_capacity': 100,
            'recycling_storage': self.recycling_storage
        }
        self.url = 'http://0.0.0.0:8000/cleanup-orders/'

    def test_get_storage_cleanup_orders(self):
        cleanup_order = StorageCleanupOrder.objects.create(
            **self.cleanup_order_data
        )
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        expected_response = [
            {
                'id': cleanup_order.id,
                'description': cleanup_order.description, 
                'current_capacity': cleanup_order.current_capacity, 
                'approved_at': cleanup_order.approved_at, 
                'recycling_storage_name': self.recycling_storage.name,
            }
        ]
        self.assertEqual(expected_response, response.json())

    def test_get_storage_cleanup_orders_closed(self):
        cleanup_order = StorageCleanupOrder.objects.create(
            **self.cleanup_order_data,
        )
        cleanup_order.close()
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([], response.json())

    def test_patch_storage_cleanup_order_approve(self):
        order = StorageCleanupOrder.objects.create(**self.cleanup_order_data)
        patch_data = {'approved_at': self.now.isoformat()}
        response = self.client.patch(
            f'{self.url}{order.pk}/', patch_data, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.assertEqual(order.approved_at, self.now)

    def test_patch_storage_cleanup_order_not_found(self):
        patch_data = {'approved_at': self.now.isoformat()}
        fake_id = randint(100, 1000)
        response = self.client.patch(
            f'{self.url}{fake_id}/', patch_data, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patch_storage_cleanup_order_invalid_data(self):
        order = StorageCleanupOrder.objects.create(**self.cleanup_order_data)
        patch_data = {'approved_at': 'invalid_date'}
        response = self.client.patch(
            f'{self.url}{order.pk}/', patch_data, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
