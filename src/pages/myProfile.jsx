import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IconButton, Stack, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL, handleFollow } from '../config';
import { Close, Edit } from '@mui/icons-material';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { CustomButton, customScrollbarStyles } from '../components/customs';
import UsersList from '../components/usersLists';

const Profile = () => {
  const [profileData, setProfileData] = useState(false)
  const stateUser = useSelector(state => state.user)
  const dispatch = useDispatch()
  const { username } = useParams()
  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showUsers, setshowUsers] = useState([])

  const [isMobView, setIsMobView] = useState(window.innerWidth <= 500)
  const [isTabView, setIsTabView] = useState(window.innerWidth <= 860)

  const getFollowerORFollowing = async (endPoint) => {
    setIsModalOpen(endPoint)
    try {
      if (!endPoint) return null;
      const { data } = await axios.get(`${BASE_URL}/User/${username}/${endPoint}`)
      setshowUsers(data.users)
    } catch (error) {
      console.log(error.message)
    }
  }


  const FollowersSection = () => {
    return (
      <Stack justifyContent={isTabView && 'space-around'} direction={'row'} spacing={5}>
        <Stack alignItems={'center'} onMouseOver={(e) => e.target.style.cursor = 'pointer'}>
          <Typography >{profileData?.posts || 0}</Typography>
          <Typography>Posts</Typography>
        </Stack>
        <Stack alignItems={'center'}
          onMouseOver={(e) => e.target.style.cursor = 'pointer'}
          onClick={() => getFollowerORFollowing('follower')} >
          <Typography >{profileData?.follower?.length || 0}</Typography>
          <Typography>Follower</Typography>
        </Stack>
        <Stack alignItems={'center'}
          onMouseOver={(e) => e.target.style.cursor = 'pointer'}
          onClick={() => getFollowerORFollowing('following')} >
          <Typography >{profileData?.following?.length || 0}</Typography>
          <Typography>Following</Typography>
        </Stack>
      </Stack>
    )
  }

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/User/${username}`)
      setProfileData(data.userData)
    } catch (err) {
      err.response.data.message === "User not found" && navigate('Not Found')
      console.log(err?.response?.data?.message);
    }
  }
  const handleEditProfile = () => {
    navigate('/Profile/Edit-Profile')
  }
  const followHandler = () => {
    if (!stateUser.login) {
      return alert('Please login for additional activity')
    }
    const action = stateUser.following.includes(profileData._id) ? 'unfollow' : 'follow'
    handleFollow(action, profileData._id, stateUser, dispatch)
  }
  useEffect(() => {
    setshowUsers([])
    getUserData();
    setIsModalOpen(false)
    const handleResize = () => {
      setIsMobView(window.innerWidth <= 500);
      setIsTabView(window.innerWidth <= 860);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line
  }, [stateUser, username])
  return (
    profileData && <>
      {isModalOpen && <Stack
        sx={{
          position: 'fixed',
          height: '100%',
          width: '100%',
          bgcolor: 'rgba(0,0,0,0.7)',
          top: 0,
          zIndex: 20,
          left: 0,
          justifyContent: 'center',
          alignItems: 'center',


        }}>
        <Stack position={'relative'} borderRadius='20px' bgcolor={'#545c65'} width='400px' height={'70%'} >
          <IconButton onClick={() => setIsModalOpen(false)} sx={{
            position: 'absolute',
            top: 0,
            right: 0
          }}>
            <Close />
          </IconButton>
          <Stack spacing={1} sx={{ ...customScrollbarStyles, position: 'relative', top: '10%', height: '85%', paddingLeft: '10px' }}>
            <UsersList users={showUsers} />
          </Stack >
        </Stack >
      </Stack>}
      <Stack spacing={1} padding={'20px'} >
        <Stack direction={'row'} spacing={4} alignItems={'center'}>

          <Stack
            width={'25%'}
            height={'25%'}
            borderRadius={'50%'}
            border={'1px solid'}
            alignItems={'center'}
            justifyContent={'center'}
            overflow={'hidden'}
          >
            <img src={profileData?.profilePhoto} alt='profile' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Stack>
          <Stack spacing={1} width={'75%'}>
            <Stack direction={'row'} spacing={3} alignItems={'center'}>
              <Typography component={'h5'} variant={'h5'} >{profileData?.username}</Typography>
              {
                stateUser.userName === username
                  ? < CustomButton onClick={handleEditProfile} endIcon={<Edit />}>
                    Edit Profile
                  </CustomButton >
                  : <CustomButton onClick={followHandler}>
                    {stateUser?.following?.includes(profileData._id) ? 'unfollow' : 'follow'}
                  </CustomButton>
              }
            </Stack>
            {(!isTabView || isMobView) && < FollowersSection />}

            {!isMobView && <>
              <Typography fontWeight={'500'} fontSize={'110%'}  >
                {profileData.fullname}
              </Typography>
              <Typography marginTop={'0!important'} width={'100%'} sx={{ whiteSpace: 'pre-line' }} >
                {profileData.bio}
              </Typography>
            </>}
          </Stack>

        </Stack>
        {isMobView && <>
          <Typography fontWeight={'500'} fontSize={'110%'}  >
            {profileData.fullname}
          </Typography>
          <Typography width={'80%'} sx={{ whiteSpace: 'pre-line' }}  >
            {profileData.bio}
          </Typography>
        </>}

        {
          (isTabView && !isMobView) && <>
            <hr />
            <FollowersSection />
          </>
        }
        <hr />
        <Stack>
          <Outlet />
        </Stack>
      </Stack >
    </>
  );

};

export default Profile;
