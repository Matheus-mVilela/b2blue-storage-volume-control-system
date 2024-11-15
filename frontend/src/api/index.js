import axios from 'axios'

const URL = 'http://0.0.0.0:8000';

export const fetchStorages = async () => {
    try {
      const response = await axios.get(`${URL}/storages/`);
        return response.data
    } catch (error) {
      console.error('Error fetch storage:', error);
    }
  };

export const createStorage = async (name, description) => {
  try {
    const response = await axios.post(`${URL}/storages/`, {
      name: name,
      description: description,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating storage:', error);
    throw error;
  }
};

export const updateStorage = async (id, capacity) => {
  try {
    const response = await axios.patch(`${URL}/storages/${id}/`, {
      capacity: capacity,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating storage:', error);
    throw error;
  }
};

export const deleteStorage = async (id) => {
  try {
    const response = await axios.delete(`${URL}/storages/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error delete storage:', error);
    throw error;
  }
};

export const fetchCleanupOrders = async () => {
  try {
    const response = await axios.get(`${URL}/cleanup-orders/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cleanup orders:', error);
    throw error;
  }
};

export const approveCleanupOrder = async (orderId) => {
  try {
    const response = await axios.patch(`${URL}/cleanup-orders/${orderId}/`, {
      approved_at: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error('Error approving cleanup order:', error);
    throw error;
  }
};

export const downloadStorageHistory = async () => {
  try {
    const response = await axios.get(`${URL}/storages/history/download/`);
      return response.data
  } catch (error) {
    console.error('Error fetch storage:', error);
  }
};

export const dowloadCleanupOrderHistory = async () => {
  try {
    const response = await axios.get(`${URL}/cleanup-orders/history/download/`);
      return response.data
  } catch (error) {
    console.error('Error fetch storage:', error);
  }
};