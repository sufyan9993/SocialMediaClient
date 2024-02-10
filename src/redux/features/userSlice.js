import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
const setCookies = (state) => {
    localStorage.setItem('SecurityToken', state.SecurityToken)
    localStorage.setItem('userName', state.userName)
}

const removeCookies = () => {
    localStorage.removeItem('SecurityToken')
    localStorage.removeItem('userName')
}
const userSlice = createSlice({
    name: 'userData',
    initialState: {
        SecurityToken: localStorage.getItem('SecurityToken') ? localStorage.getItem('SecurityToken') : null,
        userName: localStorage.getItem('userName') ? localStorage.getItem('userName') : null,
        login: localStorage.getItem('userName') !== undefined && localStorage.getItem('userName') !== null,
        userId: null,
        profilePhoto: null,
        following: null,
        follower: null,
        savedPosts: null,
    },
    reducers: {
        loginSuccess: (state, action) => {

            state.SecurityToken = action.payload.token
            state.userName = action.payload.username
            state.login = true
            state.userId = action.payload._id
            state.profilePhoto = action.payload.profilePhoto
            state.following = action.payload.following
            state.follower = action.payload.follower
            state.savedPosts = action.payload.savedPosts
            setCookies(state)
        },
        setData: (state, action) => {
            state.SecurityToken = action.payload.token
            state.userName = action.payload.username
            state.userId = action.payload._id
            state.profilePhoto = action.payload.profilePhoto
            state.following = action.payload.following
            state.follower = action.payload.follower
            state.savedPosts = action.payload.savedPosts
            setCookies(state)
        },
        logout: (state) => {
            state.userId = null
            state.userName = null
            state.profilePhoto = null
            state.SecurityToken = null
            state.login = false
            state.follower = null
            state.following = null
            state.savedPosts = null
            removeCookies()

        },
    }
})
export const { loginSuccess, logout, setData } = userSlice.actions
export default userSlice.reducer