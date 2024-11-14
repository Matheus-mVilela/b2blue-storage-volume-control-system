import { Container, Box, FormControl, Typography, Button, Avatar, TextField, Alert } from '@mui/material';
import bannerImage from '../assets/sustainability_banner.jpeg'; 
import { useState } from 'react';
import { createStorage, downloadStorageHistory, dowloadCleanupOrderHistory} from '../api';
import { queryClient } from '../App';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { useQuery } from '@tanstack/react-query';


export default function Sidebar() { 
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await createStorage(name, description);
            setSuccess('Storage created successfully!');
            setName('');
            setDescription('');
        } catch (err) {
            setError('Error creating storage. Please try again.');
        }
        queryClient.invalidateQueries({ queryKey: ['storages'] })

    };
    const { data: storageHistory} = useQuery({
      queryKey: ['storageHistory'],
    queryFn: downloadStorageHistory,
  });

    const handleDowloadSotorageHistory = async () => {
      if (!storageHistory || storageHistory.length === 0) {
        return;
      }
      try {
          const headers = [
            'storage_id',
            'storage_name',
            'current_capacity',
            'storage_history_id',
            'storage_history_capacity',
            'storage_history_created_at',
          ];
          const data = storageHistory.map(
            item => [
              item.storage_id,
              item.storage_name,
              item.current_capacity,
              item.storage_history_id,
              item.storage_history_capacity,
              item.storage_history_created_at,
            ]);
          const csvContent = [headers, ...data].map(e => e.join(",")).join("\n");
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'storage_history.csv');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      } catch (error) {
          console.error('Error fetching data from the API:', error);
      }
    };

    const { data: cleanupOrderHistory} = useQuery({
      queryKey: ['cleanupOrderHistory'],
    queryFn: dowloadCleanupOrderHistory,
    });
    
    const handleDowloadCleanupOrderHistory = async () => {
      if (!cleanupOrderHistory || cleanupOrderHistory.length === 0) {
        console.error('No data found in the API.');
        return;
      }
      try {
          const headers = [
            'storage_id',
            'storage_name',
            'current_capacity',
            'cleanup_order_capacity',
            'cleanup_order_approved_at',
            'cleanup_order_closed_at',
          ];
          const data = storageHistory.map(
            item => [
              item.storage_id,
              item.storage_name,
              item.current_capacity,
            ]);
          const csvContent = [headers, ...data].map(e => e.join(",")).join("\n");
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'cleanup_order_hisotry.csv');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      } catch (error) {
          console.error('Error fetching data from the API:', error);
      }
    };
  
    return (
        <Container sx={{ padding: 2, maxWidth: '300px', borderRadius: 3, boxShadow: 4 }}>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} mb={2}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>U</Avatar>
            <Typography variant="body1" gutterBottom>Fake User</Typography>
          </Box>
    
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add Storage
            </Typography>
    
            <FormControl fullWidth margin="normal">
              <TextField
                label="Name" 
                variant="outlined" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormControl>
    
            <FormControl fullWidth margin="normal">
              <TextField 
                label="Description" 
                variant="outlined" 
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </FormControl>
    
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
    
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
            >
              Add +
            </Button>
            
          </Box>
          <Box sx={{padding: 1, marginBottom: 1}}>
          <Button
              variant="contained"
              color="primary"
              startIcon={<CloudDownloadIcon />}
              onClick={handleDowloadSotorageHistory}
              sx={{backgroundColor: 'green'}}
          >
           Download Storage History
          </Button>
          </Box>
          <Box sx={{padding: 1, marginBottom: 1}}>
          <Button
              variant="contained"
              color="primary"
              startIcon={<CloudDownloadIcon />}
              onClick={handleDowloadCleanupOrderHistory}
              sx={{backgroundColor: 'green'}}
          >
           Download Cleanup Order History
          </Button>
          </Box>
    
          <Box
            sx={{
                backgroundColor: 'primary.light',
                padding: 0.5,
                borderRadius: 2,
                textAlign: 'center',
                boxShadow: 1,
            }}
            >
            <img 
                src={bannerImage} 
                alt="Banner Image"
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </Box>
        </Container>
      );
}
