import axios from 'axios'


export const fetchStorages = async (storage) => {
    try {
      const response = await axios.get('http://0.0.0.0:8000/storages/');
        return response.data
    } catch (error) {
      console.error('Error creating storage:', error);
    }
  };
