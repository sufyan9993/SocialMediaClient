import React from 'react';
import PostCard from '../components/postCard';
import { Stack } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from '../config';
import { useState } from 'react';
import { useEffect } from 'react';

const Home = () => {
    const [posts, setPosts] = useState([])
    const getPosts = () => {
        axios.get(`${BASE_URL}/Post/GetAllPost`)
            .then((res) => {
                setPosts(res.data.posts)
            })
            .catch((err) => {
                alert(err)
                console.log(err);
            })

    }
    useEffect(() => {
        getPosts()
    }, [])

    return (
        <Stack alignItems={'center'}>
            {posts.map((value, index) => <PostCard key={index} post={value} updatePosts={getPosts} />)}
        </Stack >
    );
};

export default Home;
