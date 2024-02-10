import React from 'react';
import PostCard, { PostCardSkeleton } from '../components/postCard';
import { Stack } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from '../config';
import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const Home = ({ singlePost = false }) => {
    const [isLoading, setIsLoading] = useState(true)
    const location = useLocation();
    const { PostId } = useParams()
    const [posts, setPosts] = useState([])
    const getPosts = () => {
        !singlePost
            ? axios.get(`${BASE_URL}/Post/GetAllPost`)
                .then((res) => {
                    setPosts(res.data.posts)
                    setIsLoading(false);
                })
                .catch((err) => {
                    err.response && alert(err.response.data.message)
                    console.log(err);
                })
            : axios.get(`${BASE_URL}/Post/GetSinglePost/${PostId}`)
                .then((res) => {
                    setPosts(res.data.post)
                    setIsLoading(false);
                })
                .catch((err) => {
                    err.response && alert(err.response.data.message)
                    console.log(err);
                })
    }
    useEffect(() => {
        setPosts([])
        setIsLoading(true)
        getPosts()
    }, [location.pathname])
    return (
        <Stack alignItems={'center'}>
            {isLoading && <PostCardSkeleton />}
            {posts.map((value, index) => <PostCard key={index} post={value} updatePosts={getPosts} />)}
        </Stack >
    );
};

export default Home;
