import React, { useEffect, useRef, useState } from 'react'
import { Box, InputAdornment, Stack, TextField } from "@mui/material"
import { AccountCircle, CheckCircleRounded, CloudUpload, EmailRounded, Lock, Login, Person } from "@mui/icons-material"
import { Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginSuccess } from '../redux/features/userSlice'
import { BASE_URL } from '../config'
import axios from 'axios'
import CropImage from './imageCrop/crop'
import { CustomButton } from '../components/customs'
import CircularLoading from '../components/Loading'

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [FormValues, setFormValues] = useState({
    profilePhoto: null,
    username: '',
    fullname: '',
    email: '',
    password: '',
    password2: ''
  })
  const [cropData, setCropData] = useState(null)
  const passwordRef = useRef(null)
  const dispatch = useDispatch()
  const islogin = useSelector(state => state.user.login)
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    if (cropData) {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('profilePhoto', cropData)
      formData.append('username', FormValues.username)
      formData.append('fullname', FormValues.fullname)
      formData.append('email', FormValues.email)
      formData.append('password', FormValues.password)

      axios.post(`${BASE_URL}/Auth/Register`, formData)
        .then((res) => {
          const token = res.data.token
          setIsLoading(false)
          dispatch(loginSuccess({ ...res.data.userData, token }))
        })
        .catch((err) => {
          setIsLoading(false)
          alert(err?.response?.data?.message)
        })
    } else {
      alert("Please fill out all fields")
    }
  }
  useEffect(() => {
    const handleResize = () => {
      // setIsMobView(window.innerWidth <= 500);
      // setSmallView(window.innerWidth <= 430);
      // setIsTabView(window.innerWidth <= 860);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return !islogin ? (<>
    {isLoading && <CircularLoading />}
    <Stack marginX={'10px'} position="relative" alignItems={'center'} >
      <Box
        className='color-white'
        sx={{
          textAlign: 'center',
          width: '400px',
        }}

      >
        <AccountCircle fontSize="large" />
        <Stack
          onSubmit={handleSubmit}
          component={'form'}
          spacing={5}
        >
          <Stack alignItems={'center'}>
            <CustomButton disabled={Boolean(FormValues.profilePhoto)} component="label" startIcon={!cropData ? <CloudUpload /> : <CheckCircleRounded />}>
              {!cropData ? 'Upload Profile Photo' : 'Profile Uploaded'}
              <input type="file" style={{ display: 'none' }} onChange={(e) => setFormValues({ ...FormValues, profilePhoto: e.target.files[0] })} />
            </CustomButton>
          </Stack>

          <TextField
            label='Username'
            variant='standard'
            required
            InputProps={{
              startAdornment: <InputAdornment position='start'><Person /></InputAdornment>
            }}
            value={FormValues.username} onChange={(e) => setFormValues({ ...FormValues, username: e.target.value })} />

          <TextField
            label='Full-Name'
            variant='standard'
            required
            InputProps={{
              startAdornment: <InputAdornment position='start'><Person /></InputAdornment>
            }}
            value={FormValues.fullname} onChange={(e) => setFormValues({ ...FormValues, fullname: e.target.value })} />

          <TextField
            label='email'
            variant='standard'
            type='email'
            InputProps={{
              startAdornment: <InputAdornment position='start'><EmailRounded /></InputAdornment>
            }}
            required
            value={FormValues.email}
            onChange={(e) => setFormValues({ ...FormValues, email: e.target.value })}
          />
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
          <TextField
            label='re-enter Password'
            variant='standard'
            type='Password'
            InputProps={{
              startAdornment: <InputAdornment position='start'><Lock /></InputAdornment>
            }}
            inputRef={passwordRef}
            required
            value={FormValues.password2}
            onChange={(e) => setFormValues({ ...FormValues, password2: e.target.value })}
          />
          <CustomButton disabled={FormValues.password !== FormValues.password2}
            endIcon={<Login />}
            type="submit" >
            {FormValues.password !== FormValues.password2 ? 'password does not match' : 'Create Account'}
          </CustomButton>
        </Stack>
        <CustomButton style={{ fontSize: '60%' }} variant='text' onClick={() => navigate('/Login')} >
          Login
        </CustomButton>
      </Box>
      <CropImage ratio={(1 / 1)} imageFile={FormValues.profilePhoto} setCropData={setCropData} />
    </Stack>
  </>
  ) : <Navigate to={'/'} />
}

export default RegisterPage