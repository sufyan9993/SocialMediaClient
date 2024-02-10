import { Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PostCard, { PostCardSkeleton } from '../../components/postCard'
import axios from 'axios'
import { BASE_URL } from '../../config'
import { useSelector } from 'react-redux'

const PostsTab = ({ search }) => {
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const user = useSelector(state => state.user)
    const getFilteredPost = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/Post/search/${search}`, {
                headers: {
                    "authorization": `Bearer ${user.SecurityToken}`,
                    "Content-Type": "application/json"
                }
            })
            setIsLoading(false)
            setPosts(data.posts)
        } catch (error) {
            console.log(error.message);
        }
    }
    useEffect(() => {
        getFilteredPost()
        // eslint-disable-next-line
    }, [search])
    return (
        <Stack alignItems={'center'} flexWrap={'wrap'} direction={'row'}>
            {isLoading && <PostCardSkeleton />}
            {posts.length > 0
                ? posts.map((value, i) => <PostCard key={i} post={value} updatePosts={getFilteredPost} />)
                : !isLoading && <Typography>No posts Found</Typography>}
        </Stack>
    )
}

export default PostsTab