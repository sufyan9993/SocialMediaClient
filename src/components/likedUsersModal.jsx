import { IconButton, Stack } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../config'
import { Close } from '@mui/icons-material'
import { customScrollbarStyles } from '../components/customs'
import UsersList, { UserListSkeleton } from './usersLists'
const LikedUserModal = ({ postId, setIsShow }) => {
    const [likes, setLikes] = useState([])
    const [isMobView, setIsMobView] = useState(window.innerWidth <= 500)
    const [isLoading, setIsLoading] = useState(true)

    const getLikesData = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/Post/${postId}/getLikedata`)
            setIsLoading(false)
            setLikes(data.likes)
        } catch (error) {
            console.log(error.message);
        }
    }
    useEffect(() => {
        getLikesData()
        const handleResize = () => {
            setIsMobView(window.innerWidth <= 500);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
        // eslint-disable-next-line
    }, [])
    return (
        <Stack sx={{
            position: 'fixed',
            height: '100%',
            width: '100%',
            bgcolor: 'rgba(0,0,0,0.7)',
            top: 0,
            zIndex: 20,
            left: 0,
            justifyContent: 'center',
            alignItems: 'center',


        }}
        >
            <Stack position={'relative'} borderRadius='20px' bgcolor={'#545c65'} width={isMobView ? '80%' : '400px'} height={'70%'} >
                <IconButton sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0

                }} onClick={() => setIsShow(false)}>
                    <Close />
                </IconButton>
                <Stack spacing={1} sx={{ ...customScrollbarStyles, position: 'relative', top: '10%', height: '85%', paddingLeft: '10px' }}>
                    {
                        isLoading ? <UserListSkeleton />
                            : <UsersList users={likes} isLikes={true} />
                    }
                </Stack>
            </Stack>

        </Stack >
    )
}

export default LikedUserModal