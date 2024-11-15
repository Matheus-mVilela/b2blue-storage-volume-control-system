import { Container, Box, Typography, Divider, Checkbox, Button, FormControl, TextField, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchStorages, fetchCleanupOrders, approveCleanupOrder, updateStorage, deleteStorage} from '../api';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';


export default function Storages() {  
    const queryClient = useQueryClient();
    
    const { data: storages, isLoading: isLoadingStorages, isError: isErrorStorages } = useQuery({
        queryKey: ['storages'],
        queryFn: fetchStorages,
    });

    const { data: cleanupOrders, isLoading: isLoadingOrders, isError: isErrorOrders } = useQuery({
        queryKey: ['cleanupOrders'],
        queryFn: fetchCleanupOrders,
    });

    const [capacityUpdates, setCapacityUpdates] = useState({});

    const handleApproveOrder = async (orderId) => {
        try {
            await approveCleanupOrder(orderId);
            queryClient.invalidateQueries({ queryKey: ['cleanupOrders'] });
            queryClient.invalidateQueries({ queryKey: ['storages'] });
        } catch (error) {
            console.error('Failed to approve cleanup order:', error);
        }
    };

    const handleUpdateStorage = async (id, newCapacity) => {
        try {
            await updateStorage(id, newCapacity);
            queryClient.invalidateQueries({ queryKey: ['cleanupOrders'] });
            queryClient.invalidateQueries({ queryKey: ['storages'] });
        } catch (error) {
            console.error('Failed to update storage:', error);
        }
    };

    const handleCapacityChange = (id, value) => {
        setCapacityUpdates((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleDeleteStorage = async (id) => {
        try {
            await deleteStorage(id);
            queryClient.invalidateQueries({ queryKey: ['storages'] });
        } catch (error) {
            console.error('Failed to delete storage:', error);
        }
    };

    const boxStyle = {
        border: '1px solid #ccc',
        borderRadius: 2,
        padding: 3,
        boxShadow: 3,
        backgroundColor: '#f9f9f9',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        height: '100%',
    };

    return (
        <Container
            sx={{
                height: '80vh', 
                overflowY: 'auto',
                paddingRight: 2,
            }}
        >
            {isLoadingStorages || isLoadingOrders ? (
                <Typography variant="h6" gutterBottom>Loading...</Typography>
            ) : isErrorStorages || isErrorOrders ? (
                <Typography variant="h6" color="error" gutterBottom>Failed to load data</Typography>
            ) : (
                <Grid container spacing={2}>
                    {storages?.map((storage) => (
                        <Grid key={storage.id} xs={12} md={6} lg={4}>
                            <Box sx={boxStyle}>
                                <IconButton color="error" onClick={() => handleDeleteStorage(storage.id)}>
                                <DeleteIcon sx={{ fontSize: 30, color: 'red' }} />
                                </IconButton>

                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2" gutterBottom>
                                        Storage Name: {storage.name}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        Capacity: {storage.capacity}% 
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        Description: {storage.description}
                                    </Typography>
                                </Box>
                                
                                <Box 
                                    component="form" 
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleUpdateStorage(storage.id, capacityUpdates[storage.id]);
                                    }} 
                                    noValidate 
                                    sx={{ mb: 3, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}
                                >
                                    <FormControl fullWidth margin="normal" sx={{ flex: 1 }}>
                                        <TextField
                                            label="New Capacity"
                                            variant="outlined"
                                            value={capacityUpdates[storage.id] || ''}
                                            onChange={(e) => handleCapacityChange(storage.id, e.target.value)}
                                            required
                                        />
                                    </FormControl>

                                    <Button 
                                        type="submit"
                                        variant="contained" 
                                        endIcon={<SendIcon/>}
                                    >
                                        Send
                                    </Button>
                                </Box>

                                
                                <Divider orientation="vertical" flexItem sx={{ marginX: 2 }} />

                                <Box>
                                    {cleanupOrders?.filter(order => order.storage_id === storage.id).length > 0 ? (
                                        cleanupOrders
                                            .filter(order => order.storage_id === storage.id)
                                            .map((order) => (
                                                <Box key={order.id} display="flex" alignItems="center" mb={2}>
                                                    <Checkbox
                                                        onChange={() => handleApproveOrder(order.id)}
                                                        inputProps={{ 'aria-label': 'Approve cleanup order' }}
                                                    />
                                                    <Typography variant="body2" sx={{ marginLeft: 1 }}>
                                                        Approve cleanup order #{order.id}
                                                    </Typography>
                                                </Box>
                                            ))
                                    ) : (
                                        <Typography variant="body2">No pending cleanup orders</Typography>
                                    )}
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}
