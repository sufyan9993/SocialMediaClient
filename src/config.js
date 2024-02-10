import axios from "axios";
import { setData } from "./redux/features/userSlice";

export const BASE_URL = process.env.REACT_APP_BASE_URL

export const calculateDate = (dt) => {
    const postCreationDate = new Date(dt);
    const currentDate = new Date();
    const timeDifference = currentDate - postCreationDate;
    const timeUnits = {
        year: Math.floor(timeDifference / 1000 / 60 / 60 / 24 / 365.35),
        month: Math.floor(timeDifference / 1000 / 60 / 60 / 24 / 30.44),
        day: Math.floor(timeDifference / 1000 / 60 / 60 / 24),
        hour: Math.floor(timeDifference / 1000 / 60 / 60),
        minute: Math.floor(timeDifference / 1000 / 60),
        second: Math.floor(timeDifference / 1000),
    }
    let time
    for (const unit in timeUnits) {
        if (timeUnits[unit] > 0) {
            // Output the result
            time = (timeUnits[unit] > 1) ? `${timeUnits[unit]} ${unit}s ago` : `${timeUnits[unit]} ${unit} ago`
            break;
        }
    }
    return time


}

export const getUserData = async (dispatchMethod, user) => {
    try {
        const { data } = await axios.get(`${BASE_URL}/User/${user.userName}`)
        const { _id, username, profilePhoto, following, follower, savedPosts } = data.userData
        dispatchMethod(setData({ _id, profilePhoto, following, follower, savedPosts, token: user.SecurityToken, username }))
    } catch (err) {
        err.response && alert(err.response.data.message)
        console.log(err);
    }
}

export const handleFollow = async (action, followingUserId, user, dispatchMethod) => {
    try {
        await axios.put(`${BASE_URL}/User/${action}`, { followingUserId }, {
            headers: {
                'authorization': `Bearer ${user.SecurityToken}`,
                'Content-Type': 'application/json'
            }
        })
        await getUserData(dispatchMethod, user)

    } catch (error) {
        console.log(error);
    }


}