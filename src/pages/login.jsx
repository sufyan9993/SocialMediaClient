import React, {  useState } from 'react'
import { Box,  InputAdornment, Stack, TextField } from "@mui/material"
import { AccountCircle, Lock, Login, Person } from "@mui/icons-material"
import { Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginSuccess } from '../redux/features/userSlice'
import axios from 'axios'
import { BASE_URL } from '../config'
import { CustomButton } from '../components/customs'
const LoginPage = () => {

    const [FormValues, setFormValues] = useState({
        username: '',
        password: ''
    })
    const dispatch = useDispatch()
    const islogin = useSelector(state => state.user.login)
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(`${BASE_URL}/Auth/Login`, FormValues)
            .then((res) => {
                const token = res.data.token
                dispatch(loginSuccess({...res.data.userData,token}))
            })
            .catch((err) => {
                console.log(err);
                alert(err?.response?.data?.message)
            })
    }
    return !islogin ? (
        <Stack marginX={'10px'} position="relative" height={'80vh'} direction={'row'} alignItems={'center'} justifyContent={'center'}  >
            <Box
                className='color-white'
                sx={{
                    textAlign: 'center',
                    width:'400px'
                }}

            >
                <AccountCircle fontSize="large" />
                <Stack
                    onSubmit={handleSubmit}
                    component={'form'}
                    spacing={5}
                >
                    <TextField
                        label='Username'
                        variant='standard'
                        required
                        InputProps={{
                            startAdornment: <InputAdornment position='start'><Person /></InputAdornment>
                        }}
                        value={FormValues.username} onChange={(e) => setFormValues({ ...FormValues, username: e.target.value })} />
                    <TextField
                        label='Password'
                        variant='standard'
                        type='password'
                        InputProps={{
                            startAdornment: <InputAdornment position='start'><Lock /></InputAdornment>
                        }}
                        required
                        value={FormValues.password}
                        onChange={(e) => setFormValues({ ...FormValues, password: e.target.value })}
                    />
                    <Stack alignItems={'center'}>

                        <CustomButton
                            width='fit-content!important'
                            endIcon={<Login />}
                            type="submit" >Login</CustomButton>
                    </Stack>
                </Stack>
                <CustomButton style={{ fontSize: '60%' }} variant='text' onClick={() => navigate('/Register')}>
                    Create Account
                </CustomButton>
            </Box>
        </Stack>
    ) : <Navigate to={'/'} />
}

export default LoginPage