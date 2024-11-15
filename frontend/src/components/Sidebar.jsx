import { Container, Box, FormControl, Typography, Button, Avatar, TextField, Alert } from '@mui/material';
import bannerImage from '../assets/sustainability_banner.jpeg'; 
import { useState } from 'react';
import { createStorage } from '../api';
import { queryClient } from '../App';


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
