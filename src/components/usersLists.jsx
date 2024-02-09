import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton, Stack, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { calculateDate } from '../config'
import { FavoriteRounded } from '@mui/icons-material'

const UsersList = ({ users, isLikes = false }) => {
    const navigate = useNavigate()
    return (
        <Stack position={'relative'} height={'100%'}>
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
export const UserListSkeleton = () => {
    return (
        <Stack position={'relative'} height={'100%'} spacing={1}width={'100%'}>
            {[...Array(5)].map((_,i) => (
                <Stack key={i} direction={'row'} alignItems={'center'} spacing={1}>
                    <Skeleton variant='circular'height={50} width={50}/>
                    <Stack width={'70%'}>
                    <Skeleton variant='text' sx={{fontSize:'1.25rem'}} width={'60%'}/>
                    <Skeleton variant='text' sx={{fontSize:'1.25rem'}}  width={'40%'}/>
                    </Stack>
                </Stack >
            ))}
        </Stack>
    )
}
export default UsersList