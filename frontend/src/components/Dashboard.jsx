import Grid from '@mui/material/Grid2';
import Storages from './Storages';
import Sidebar from './Sidebar';


export default function Dashboard() {
    return (
        <Grid container minHeight={'100vh'}>
            <Grid size={4}>
                <Sidebar/>
            </Grid>
            <Grid size={8}>
                <Storages/>
            </Grid>
        </Grid>
    )
}