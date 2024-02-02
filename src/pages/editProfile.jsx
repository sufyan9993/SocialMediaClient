import { Button, IconButton, InputAdornment, Stack, TextField } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../config'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Edit, EmailRounded, Lock,  Person } from '@mui/icons-material'
import CropImage from './imageCrop/crop'
import { setData } from '../redux/features/userSlice'

const EditProfile = () => {
    const [profileData, setProfileData] = useState(false)
    const [UpdateProfileData, setUpdateProfileData] = useState(false)
    const [isTrue, setIsTrue] = useState({ changePassword: false, changePhoto: false })
    const [cropData, setCropData] = useState(null)
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleChangePhoto = (e) => {
        setIsTrue({ ...isTrue, changePhoto: true })
        setUpdateProfileData({ ...UpdateProfileData, newProfilePhoto: e.target.files[0] })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData();
            isTrue.changePhoto && formData.append('file', cropData);
            if (isTrue.changePassword) {
                if (UpdateProfileData.new_password === UpdateProfileData.confirmNew_password) {
                    formData.append('password', UpdateProfileData.password)
                    formData.append('newPassword', UpdateProfileData.new_password)
                } else {
                    alert('New Passwords not matched')
                    return
                }
            }

            delete UpdateProfileData.profilePhoto
            delete UpdateProfileData.newProfilePhoto
            for (const key in UpdateProfileData) {
                UpdateProfileData[key] !== profileData[key] && formData.append(key, UpdateProfileData[key])
            }

            const { data } = await axios.put(`${BASE_URL}/User/${user.userName}/updateProfile`, formData, {
                headers: {
                    "authorization": `Bearer ${user.SecurityToken}`,
                    'Content-Type': 'multipart/form-data',
                }
            })
            const { _id, profilePhoto, following, follower, username } = data.updatedUser
            dispatch(setData({ _id, profilePhoto, following, follower, token: user.SecurityToken, username }))
            navigate(`/Profile/${username}`)
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        const getUserData = async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/User/${user.userName}/AllData`)

                setUpdateProfileData({ ...data.userData })
                setProfileData({ ...data.userData })
            } catch (err) {
                err.response?.data?.message === "User not found" && navigate('Not Found')
                console.log(err?.response?.data?.message);
            }
        }
        

        getUserData()
        // eslint-disable-next-line
    }, [])
    return (
        UpdateProfileData &&
        <Stack padding={'20px'} direction={'row'} spacing={4}>
            <Stack width='40%' onSubmit={handleSubmit}
                className='color-white'
                component={'form'} spacing={2}>
                <Stack
                    width={'100px'}
                    height={'100px'}
                    borderRadius={'50%'}
                    border={'1px solid'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    overflow={'hidden'}
                    position={'relative'}
                >
                    <IconButton component="label" sx={{
                        position: 'absolute',
                    }}>
                        <Edit />
                        <input type="file" style={{ display: 'none' }} onChange={handleChangePhoto} />

                    </IconButton>
                    <img src={profileData?.profilePhoto} alt='profile' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Stack>
                <Stack spacing={1} >
                    <TextField
                        variant='standard'
                        label='Username'
                        required
                        InputProps={{
                            startAdornment: <InputAdornment position='start'><Person /></InputAdornment>
                        }}
                        value={UpdateProfileData.username} onChange={(e) => setUpdateProfileData({ ...UpdateProfileData, username: e.target.value })} />

                    <TextField
                        variant='standard'
                        label='Full-Name'
                        required
                        InputProps={{
                            startAdornment: <InputAdornment position='start'><Person /></InputAdornment>
                        }}
                        value={UpdateProfileData.fullname} onChange={(e) => setUpdateProfileData({ ...UpdateProfileData, fullname: e.target.value })} />


                    <TextField
                        variant='standard'
                        label='email'
                        type='email'
                        InputProps={{
                            startAdornment: <InputAdornment position='start'><EmailRounded /></InputAdornment>
                        }}
                        required
                        value={UpdateProfileData.email}
                        onChange={(e) => setUpdateProfileData({ ...UpdateProfileData, email: e.target.value })}
                    />
                    <TextField
                        variant='filled'
                        label='bio'
                        multiline
                        InputProps={{
                            startAdornment: <InputAdornment position='start'><Edit /></InputAdornment>
                        }}
                        value={UpdateProfileData.bio} onChange={(e) => setUpdateProfileData({ ...UpdateProfileData, bio: e.target.value })} />

                    {isTrue.changePassword &&
                        <>
                            <TextField
                                variant='standard'
                                label='Old-Password'
                                type='password'
                                required
                                InputProps={{
                                    startAdornment: <InputAdornment position='start'><Lock /></InputAdornment>
                                }}
                                value={UpdateProfileData.password} onChange={(e) => setUpdateProfileData({ ...UpdateProfileData, password: e.target.value })} />
                            <TextField
                                variant='standard'
                                label='New-Password'
                                type='password'
                                required
                                InputProps={{
                                    startAdornment: <InputAdornment position='start'><Lock /></InputAdornment>
                                }}
                                value={UpdateProfileData.newPassword} onChange={(e) => setUpdateProfileData({ ...UpdateProfileData, newPassword: e.target.value })} />
                            <TextField
                                variant='standard'
                                label='Confirm-New-Password'
                                type='password'
                                required
                                InputProps={{
                                    startAdornment: <InputAdornment position='start'><Lock /></InputAdornment>
                                }}
                                value={UpdateProfileData.newPassword2} onChange={(e) => setUpdateProfileData({ ...profileData, newPassword2: e.target.value })} />

                        </>

                    }

                    <Button type='button' sx={{ width: 'fit-content' }} onClick={() => setIsTrue(pre => ({ ...isTrue, changePassword: !pre.changePassword }))}>
                        {isTrue.changePassword ? 'undo change password' : 'Change password'}
                    </Button>
                </Stack>
                <Stack alignItems={'end'}>
                    <Button type='submit' variant='contained' sx={{ width: 'fit-content' }} >
                        Save
                    </Button>
                </Stack>
            </Stack>
            <Stack alignItems={'center'}>
                <CropImage ratio={(1 / 1)} imageFile={UpdateProfileData.newProfilePhoto} setCropData={setCropData} />
            </Stack>

        </Stack >
    )
}

export default EditProfile