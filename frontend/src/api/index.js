import axios from 'axios';
import { queryClient } from '../App';

const URL = 'http://0.0.0.0:8000';

const callApi = async (endpoint, method = 'GET', data = null) => {
  try {
    const response = await axios({
      method,
      url: `${URL}${endpoint}`,
      data,
    });
    return response.data;
  } catch (error) {
    const errorMessage = `Error calling API at ${endpoint} with method ${method}: ${error?.response?.data || error.message}`
    console.error(errorMessage);
    alert(error);
    throw error;
  }
};

export const fetchStorages = async () => {
  return await callApi('/storages/');
};

export const createStorage = async (name, description) => {
  return await callApi('/storages/', 'POST', { name, description });
};

export const updateStorage = async (id, capacity) => {
  return await callApi(`/storages/${id}/`, 'PATCH', { capacity });
};

export const deleteStorage = async (id) => {
  return await callApi(`/storages/${id}/`, 'DELETE');
};

export const fetchCleanupOrders = async () => {
  return await callApi('/cleanup-orders/');
};

export const approveCleanupOrder = async (id) => {
  return await callApi(`/cleanup-orders/${id}/`, 'PATCH', {
    approved_at: new Date().toISOString(),
  });
};

export const downloadStorageHistory = async () => {
  return await callApi('/storages/history/download/');
};

export const downloadCleanupOrderHistory = async () => {
  return await callApi('/cleanup-orders/history/download/');
};

export const invalidateQueries = () => {
  queryClient.invalidateQueries({ queryKey: ['storages'] });
  queryClient.invalidateQueries({ queryKey: ['cleanupOrders'] });
};