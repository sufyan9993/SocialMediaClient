import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { AccountCircleRounded, AddBoxRounded, BookmarkRounded, HomeRounded, LogoutRounded, SearchRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/features/userSlice';
import { Stack } from '@mui/material';

export default function SideBar({ searchRef, variant = 'permanent', tabView = false, mobView = false }) {
    const navigate = useNavigate()
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const drawerWidth = tabView ? 60 : 240;

    let drawerMenuItem = [
        { text: 'Home', Icon: HomeRounded, method: () => navigate('/') },
        { text: 'Search', Icon: SearchRounded, method: () => searchRef.current.focus() },
        { text: 'Post', Icon: AddBoxRounded, method: () => navigate(`/AddPost`) },
        { text: 'Saved', Icon: BookmarkRounded, method: () => navigate(`/Profile/${user.userName}/Saved`) },
        { text: 'Profile', Icon: AccountCircleRounded, method: () => navigate(`/Profile/${user.userName}`) },
        { text: 'Logout', Icon: LogoutRounded, method: () => dispatch(logout()) },
    ]
    if (!user.login) {
        drawerMenuItem = drawerMenuItem.filter(menu => {
            if (menu.text === 'Logout') {
                menu.text = 'Login'
                menu.method = () => navigate('/Login')
            }
            return !['Post', 'Saved', 'Profile'].includes(menu.text)
        })

    }
    return (
        <Stack sx={{
            height: '100vh',
            zIndex: 10, width: !mobView ? drawerWidth : '100%',
            background: 'linear-gradient(to bottom, #1976d2, #545c65)',
            position: 'fixed',
            ...(mobView && { bottom: '0px', height: 'fit-content' })
        }}            >
            <List {...(mobView && { sx: { p: 0, display: 'flex', justifyContent: 'space-around' } })}>
                {drawerMenuItem.map((menu) => (
                    <ListItem key={menu.text} disablePadding {...(mobView && { sx: { width: 'fit-content!important', maxWidth: 'fit-content!important' } })}>
                        <ListItemButton onClick={()=>{
                            menu.method()
                            searchRef.current.value = ''
                        }} >
                            <menu.Icon />
                            {(!tabView && !mobView) && <ListItemText primary={menu.text} sx={{ marginLeft: '10px' }} />}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>

    );
}
