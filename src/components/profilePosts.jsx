import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { ImageListItemBar,  Skeleton, Stack } from '@mui/material';
import { useState } from 'react';
import PostCard from './postCard';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config';
import { useEffect } from 'react';

export default function ProfilePost() {
  const [showImage, setShowImage] = useState(false)
  const [posts, setPosts] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const { username } = useParams()

  const handleShowImage = (id) => {
    const post = posts.find(post => post._id === id)
    setShowImage(post)
  }
  const getUserPosts = async (refresh = true) => {
    try {
      if (refresh) {
        setShowImage(false)
      }
      const { data } = await axios.get(`${BASE_URL}/User/Posts/${username}`)
      setIsLoading(false)
      setPosts(data.posts)
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    setPosts([])
    getUserPosts()
    // eslint-disable-next-line
  }, [username])
  return (
    <>
      {isLoading ? <ImageList sx={{ width: "100%" }} cols={4} >
        {[...Array(8)].map((_,i) => <Skeleton key={i} variant='rectangular' height={'25vw'} />)}
      </ImageList>

        : <ImageList sx={{ width: "100%" }} cols={4} >
          {posts?.map((post) => (
            <ImageListItem key={post._id} onClick={() => handleShowImage(post._id)}>
              <img
                srcSet={`${post.image}`}
                src={`${post.image}`}
                alt={post.title} />
              <ImageListItemBar title={post.title} />
            </ImageListItem>
          ))}
        </ImageList>}
      {/* Modal for showing the image in larger size */}
      {showImage && (
        <Stack
          position={'fixed'}
          top={0}
          left={0}
          zIndex={10}
          bgcolor={'rgba(0,0,0,0.5)'}
          justifyContent={'center'}
          alignItems={'center'}
          width={'100%'}
          height={'100%'}
          onClick={(e) => {
            const postCard = !!e.target.closest('#post-card-div');
            !postCard && setShowImage(false)
          }}
        >
          <div id='post-card-div'>
            <PostCard post={showImage} updatePosts={getUserPosts} />
          </div>
        </Stack>
      )}
    </>
  )
}
