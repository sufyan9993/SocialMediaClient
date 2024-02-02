import { Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PostCard from '../../components/postCard'
import axios from 'axios'
import { BASE_URL } from '../../config'
import { useSelector } from 'react-redux'

const PostsTab = ({ search }) => {
    const [posts, setPosts] = useState([])
    const user = useSelector(state => state.user)
    useEffect(() => {
        const getFilteredPost = async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/Post/GetAllPost`, {
                    headers: {
                        "authorization": `Bearer ${user.SecurityToken}`,
                        "Content-Type": "application/json"
                    }
                })
                const filter = data.posts.filter((post) => post.title.includes(search))
                setPosts(filter)
            } catch (error) {
                console.log(error.message);
            }
        }
        getFilteredPost()
        // eslint-disable-next-line
    }, [search])
    return (
        <Stack alignItems={'center'} flexWrap={'wrap'} direction={'row'}>

            {posts.length > 0
                ? posts.map((value, i) => <PostCard key={i} post={value} />)
                : <Typography>No posts Found</Typography>}
        </Stack>
    )
}

export default PostsTab