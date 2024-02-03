import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const CircularLoading = () => {
    return (
        <Box sx={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 5
        }}>
            <CircularProgress size={60} />
        </Box >
    );
}
export default CircularLoading;