import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { ImageListItemBar, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import PostCard from './postCard';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function SavedPosts() {
  const [showImage, setShowImage] = useState(false)
  const [posts, setPosts] = useState([])
  const { username } = useParams()
  const user = useSelector(state => state.user)

  const handleShowImage = (id) => {
    const post = posts.find(post => post._id === id)
    setShowImage(post)
  }
  const getSavedPosts = async () => {
    setShowImage(false)
    try {
      const { data } = await axios.get(`${BASE_URL}/User/savedPosts/${username}`, {
        headers: {
          "authorization": `Bearer ${user.SecurityToken}`,
          'Content-Type': 'application/json',
        }
      })

      setPosts(data.savedPosts)
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getSavedPosts()
    // eslint-disable-next-line
  }, [])
  return (
    posts && (
      <>
        {!posts.length > 0 && < Typography >You did not save any post</Typography >}
        <ImageList sx={{ width: "100%" }} cols={4} >
          {posts?.map((post) => (
            <ImageListItem key={post._id} onClick={() => handleShowImage(post._id)}>
              <img
                srcSet={`${post.image}`}
                src={`${post.image}`}
                alt={post.title} />
              <ImageListItemBar title={post.title} />
            </ImageListItem>
          ))}
        </ImageList>
        {/* Modal for showing the image in larger size */}
        {
          showImage && (
            <Stack
              position={'fixed'}
              top={0}
              left={0}
              zIndex={10}
              bgcolor={'rgba(0,0,0,0.5)'}
              width={'100%'}
              height={'100%'}
              justifyContent={'center'}
              alignItems={'center'}
              onClick={(e) => {
                const postCard = !!e.target.closest('#post-card-div');
                !postCard && setShowImage(false)
              }}
            >
              <div id='post-card-div' >
                <PostCard post={showImage} updatePosts={getSavedPosts} />
              </div>
            </Stack>
          )
        }
      </>
    )
  );
}
