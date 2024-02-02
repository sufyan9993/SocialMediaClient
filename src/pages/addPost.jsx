import React, { useEffect, useState } from 'react'
import { Chip, InputAdornment, Stack, TextField } from "@mui/material"
import { CheckCircleRounded, ClosedCaptionRounded, CloudUpload, DriveFileRenameOutlineRounded, Tag } from "@mui/icons-material"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { BASE_URL } from '../config'
import axios from 'axios'
import CropImage from './imageCrop/crop'
import { CustomButton, customScrollbarStyles } from '../components/customs'
const AddPost = () => {
    const user = useSelector(state => state.user)
    const navigate = useNavigate()
    const [tagValue, setTagValue] = useState('')
    const [cropData, setCropData] = useState(null)
    const [isTabView, setIsTabView] = useState(window.innerWidth <= 860)
    const [isMobView, setIsMobView] = useState(window.innerWidth <= 500)


    const [FormValues, setFormValues] = useState({
        title: '',
        caption: '',
        image: null,
        tags: [],
    })


    const handleSubmit = (e) => {
        e.preventDefault()
        if (FormValues.image && FormValues.title) {

            const formData = new FormData()
            formData.append('file', cropData)
            formData.append('title', FormValues.title)
            formData.append('caption', FormValues.caption)
            formData.append('tags', FormValues.tags)

            axios.post(`${BASE_URL}/Post/AddPost`, formData, {
                headers: {
                    "authorization": `Bearer ${user.SecurityToken}`,
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then((res) => {
                    navigate(`/Profile/${user.userName}`)
                })
                .catch((err) => {
                    console.log(err);
                    alert(err.response?.data?.message)
                })
        } else {
            alert("Please fill out all fields")
        }
    }
    useEffect(() => {
        const handleResize = () => {
            setIsTabView(window.innerWidth <= 860);
            setIsMobView(window.innerWidth <= 500);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <Stack sx={{

            position: 'absolute',
            height: '100%',
            width: '100%',
            top: 0,
            left: 0,
            justifyContent: 'center',
            alignItems: 'center',

        }} >
            <Stack sx={{ ...customScrollbarStyles, maxHeight: '90vh', ...(isMobView ? { marginLeft: '0px' } : isTabView ? { marginLeft: '60px' } : { marginLeft: '240px' }) }} width={isTabView ? '80%' : '60%'} padding='20px' >
                <Stack
                    className='color-white'
                    onSubmit={handleSubmit}
                    component={'form'}
                    spacing={5}
                >
                    <Stack alignItems='center'>
                        <CustomButton disabled={Boolean(FormValues.image)} component="label" variant="contained" endIcon={!cropData ? <CloudUpload /> : <CheckCircleRounded />}>
                            {!cropData ? 'Select Photo' : 'Photo Selected'}
                            <input type="file" style={{ display: 'none' }} onChange={(e) => setFormValues({ ...FormValues, image: e.target.files[0] })} />
                        </CustomButton>
                    </Stack>

                    <TextField
                        label='Title'
                        variant='standard'
                        required
                        InputProps={{
                            startAdornment: <InputAdornment position='start'><DriveFileRenameOutlineRounded /></InputAdornment>
                        }}
                        value={FormValues.title} onChange={(e) => setFormValues({ ...FormValues, title: e.target.value })} />
                    <TextField
                        variant='standard'
                        label='Caption'
                        InputProps={{
                            startAdornment: <InputAdornment position='start'><ClosedCaptionRounded /></InputAdornment>
                        }}
                        value={FormValues.caption}
                        onChange={(e) => setFormValues({ ...FormValues, caption: e.target.value })}
                    />
                    <TextField
                        label='Tags'
                        InputProps={{
                            startAdornment: <InputAdornment position='start'><Tag /></InputAdornment>
                        }}
                        value={tagValue}
                        onChange={(e) => setTagValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                setFormValues({ ...FormValues, tags: [...FormValues.tags, tagValue.trim()] })
                                setTagValue('')
                            }
                        }}
                    />
                    <div>
                        {FormValues.tags.map((tag, index) => (
                            <Chip
                                key={index}
                                label={tag}
                                onDelete={() => { setFormValues({ ...FormValues, tags: FormValues.tags.filter((t, ind) => ind !== index) }) }}
                                style={{ margin: '4px' }}
                            />
                        ))}
                    </div>
                    <CustomButton disabled={!cropData} type="submit" width='fit-content'>
                        {cropData ? 'Submit' : 'select Image'}
                    </CustomButton>
                </Stack>
                <CropImage imageFile={FormValues.image} setCropData={setCropData} />
            </Stack>
        </Stack >
    )
}

export default AddPost