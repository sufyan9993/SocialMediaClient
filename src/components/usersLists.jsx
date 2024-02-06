import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { calculateDate } from '../config'
import { FavoriteRounded } from '@mui/icons-material'
import CircularLoading from './Loading'

const UsersList = ({ users, isLikes = false }) => {
    const navigate = useNavigate()
    console.log(!users, users);
    return (
        <Stack position={'relative'} height={'100%'}>
            {!users && <CircularLoading />}
            <List className='color-white'>
                {users && users?.map((user, i) => (
                    <ListItem key={i} disablePadding>
                        <ListItemButton onClick={() => navigate(`/Profile/${user.username}`)}>
                            <ListItemIcon sx={{ minWidth: 'fit-content' }}>
                                <Box height={isLikes ? 50 : 60} width={isLikes ? 50 : 60} borderRadius={'50%'} border={'2px solid #878797'} overflow={'hidden'}>
                                    <Box width={'inherit'} alt='image.jpg' component={'img'} src={user?.profilePhoto} />
                                </Box>
                            </ListItemIcon>
                            <ListItemText primary={`@${user.username}`} secondary={user.fullname} sx={{ marginLeft: '10px' }} />
                            {isLikes && <Stack alignItems={'center'} marginRight={'5%'} >
                                <FavoriteRounded fontSize='small' htmlColor='red' />
                                <Typography width={'fit-content'} align='center' fontSize={'60%'}>
                                    {calculateDate(user.timestamp)}
                                </Typography>
                            </Stack>}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>

    )
}

export default UsersList