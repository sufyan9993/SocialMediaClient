import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
const setCookies = (state) => {
    Cookies.set('SecurityToken', state.SecurityToken)
    Cookies.set('userName', state.userName)
}

const removeCookies = () => {
    Cookies.remove('SecurityToken')
    Cookies.remove('userName')
}
const userSlice = createSlice({
    name: 'userData',
    initialState: {
        SecurityToken: Cookies.get('SecurityToken') ? Cookies.get('SecurityToken') : null,
        userName: Cookies.get('userName') ? Cookies.get('userName') : null,
        login: Cookies.get('userName') !== undefined && Cookies.get('userName') !== null,
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