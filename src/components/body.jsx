import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton, Stack, Toolbar } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SideBar from './sideBar';
import { useEffect } from 'react';
import { customScrollbarStyles } from '../components/customs'
import { useRef } from 'react';


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
}));


const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        transition: theme.transitions.create('width'),
        width: '100%'
    },
}));

const Body = ({ searchRef }) => {
    const navigate = useNavigate()
    const location = useLocation();

    const [inputValue, setInputValue] = useState('')
    const [isMobView, setIsMobView] = useState(window.innerWidth <= 500)
    const [isTabView, setIsTabView] = useState(window.innerWidth <= 860)
    const HeaderRef = useRef(null)

    const handleEnterPress = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== '') {
            navigate(`/search/${inputValue.trim()}`)
        }
    }

    useEffect(() => {
        const handleResize = () => {
            setIsMobView(window.innerWidth <= 500);
            setIsTabView(window.innerWidth <= 860);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    useEffect(() => {
        // Reset search input value when the route changes
        !location.pathname.startsWith('/search/') && setInputValue('');
    }, [location.pathname]);

    return (
        <Stack direction={'row'} flexWrap={'wrap'}>
            {isMobView
                ? <SideBar searchRef={searchRef} mobView={true} />
                : isTabView ? <SideBar searchRef={searchRef} tabView={true} /> : <SideBar searchRef={searchRef} />}
            <Stack ref={HeaderRef}
                zIndex={10}
                sx={isMobView ? { margin: 0 }
                    : isTabView ? { marginLeft: '60px' } : { marginLeft: '240px' }}

                justifyContent={'space-between'}
                direction={'row'}
                width={'100%'}
                padding={'5px 0'}
                bgcolor={'#1976d2'}
            >
                <Typography
                    onClick={() => navigate('/')}
                    onMouseOver={(e) => e.target.style.cursor = 'pointer'}
                    component={'div'}
                    variant='h5'
                    marginLeft={'20px'}>
                    socialize
                </Typography>
                <Search >
                    <IconButton sx={{ width: '30%' }}
                        onClick={() => {
                            inputValue.trim() !== '' && navigate(`/search/${inputValue}`)
                        }
                        }>
                        <SearchIcon fontSize='small' />
                    </IconButton>
                    <StyledInputBase
                        placeholder="Search…"
                        onChange={(e) => setInputValue(e.target.value)}
                        value={inputValue}
                        onKeyDown={handleEnterPress}
                        inputRef={searchRef}
                        sx={{ width: '70%' }}
                    />
                </Search>
            </Stack>
            < Box sx={{ ...(isMobView ? { marginLeft: '0px' } : isTabView ? { marginLeft: '60px' } : { marginLeft: '240px' }), ...customScrollbarStyles, width: '100%', height: '92vh' }} >
                <Outlet />
                <Toolbar sx={{
                    minHeight: '10vh',
                    display: 'block',
                    zIndex: -1,
                }} />
            </Box >

        </Stack >

    );
}

export default Body