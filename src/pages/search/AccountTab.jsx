import { Skeleton, Stack, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BASE_URL } from '../../config'
import UsersList, { UserListSkeleton } from '../../components/usersLists'

const AccountTab = ({ search }) => {
    const userState = useSelector(state => state.user)
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getFilteredUsers = async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/User/search/${search}`, {
                    headers: {
                        "authorization": `Bearer ${userState.SecurityToken}`,
                        "Content-Type": "application/json"
                    }
                })
                setIsLoading(false)
                setUsers(data.users)
            } catch (error) {
                console.log(error.message);
            }
        }
        getFilteredUsers()
        // eslint-disable-next-line
    }, [search])
    return (<>
        {isLoading && <UserListSkeleton />}
        {users.length > 0
            ? <UsersList users={users} />
            : !isLoading && <Typography>User Not Found</Typography>
        }
    </>
    )
}

export default AccountTab