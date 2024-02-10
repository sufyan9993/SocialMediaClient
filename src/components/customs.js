import { Button,Box, CircularProgress } from "@mui/material"


export const CustomButton = ({ children, type = 'button', variant = 'contained', style = {}, ...restprops }) => {
    return <Button
        variant={variant}
        type={type}
        sx={{
            textTransform: 'none', padding: '1% 3%',minWidth:'fit-content',
            fontSize: '85%', borderRadius: 0,
            boxShadow: (variant === 'contained' && '3px 3px'), ...style
        }}
        {...restprops}>
        {children}
    </Button>
}

export const customScrollbarStyles = {
    overflowY: 'auto',


    /* Customize scrollbar */
    scrollbarWidth: 'thin', // For Firefox
    scrollbarColor: '#1976d2 #545c65', // For Firefox

    '&::-webkit-scrollbar': {
        width: '5px', // Set the width of the scrollbar
    },

    '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#545c65', // Set the color of the scrollbar thumb
        borderRadius: '3px', // Optional: Set border-radius for rounded corners
    },

    '&::-webkit-scrollbar-track': {
        background: '#1976d2', // Set the color of the scrollbar track
    },
};

export const CircularLoading = () => {
    return (
        <Box sx={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 5
        }}>
            <CircularProgress size={60} />
        </Box >
    );
}