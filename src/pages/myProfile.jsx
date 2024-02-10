import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IconButton, Skeleton, Stack, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL, handleFollow } from '../config';
import { Close, Edit } from '@mui/icons-material';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { CustomButton, customScrollbarStyles } from '../components/customs';
import UsersList, { UserListSkeleton } from '../components/usersLists';

const Profile = () => {
  const stateUser = useSelector(state => state.user)
  const [isLoad, setIsLoad] = useState({
    UserList: true,
    profile: true,

  })

  const [profileData, setProfileData] = useState(false)
  const [IsFollow, setIsFollow] = useState(stateUser.login ? stateUser?.following?.includes(profileData?._id) : false)
  const [followers, setFollowers] = useState(profileData?.follower)
  const dispatch = useDispatch()
  const { username } = useParams()
  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showUsers, setshowUsers] = useState(null)

  const [isMobView, setIsMobView] = useState(window.innerWidth <= 500)
  const [isTabView, setIsTabView] = useState(window.innerWidth <= 860)

  const getFollowerORFollowing = async (endPoint) => {
    setIsModalOpen(endPoint)
    try {
      if (!endPoint) return null;
      const { data } = await axios.get(`${BASE_URL}/User/${username}/${endPoint}`)
      setIsLoad(pre => ({ ...pre, UserList: false }))
      setshowUsers(data.users)
    } catch (error) {
      console.log(error.message)
    }
  }


  const FollowersSection = () => {
    return (
      <Stack justifyContent={isTabView && 'space-around'} direction={'row'} spacing={isMobView?2:5}>
        <Stack alignItems={'center'} onMouseOver={(e) => e.target.style.cursor = 'pointer'}>
          <Typography >{profileData?.posts || 0}</Typography>
          <Typography>Posts</Typography>
        </Stack>
        <Stack alignItems={'center'}
          onMouseOver={(e) => e.target.style.cursor = 'pointer'}
          onClick={() => followers?.length > 0 && getFollowerORFollowing('follower')} >
          <Typography >{followers?.length || 0}</Typography>
          <Typography>Follower</Typography>
        </Stack>
        <Stack alignItems={'center'}
          onMouseOver={(e) => e.target.style.cursor = 'pointer'}
          onClick={() => profileData?.following?.length > 0 && getFollowerORFollowing('following')} >
          <Typography >{profileData?.following?.length || 0}</Typography>
          <Typography>Following</Typography>
        </Stack>
      </Stack>
    )
  }
  const getUserData = async (loading = true) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/User/${username}`)
      setProfileData(data.userData)
      setFollowers(data.userData.follower)
      setIsFollow(stateUser?.following?.includes(data.userData?._id))

    } catch (err) {
      err?.response?.data?.message === "User not found" && navigate('Not Found')
      console.log(err);
    }
  }
  const handleEditProfile = () => {
    navigate('/Profile/Edit-Profile')
  }

  const followHandler = async () => {
    if (!stateUser.login) {
      return alert('Please login for additional activity')
    }
    const action = followers.includes(stateUser.userId) ? 'unfollow' : 'follow'
    if (action === 'follow') {
      setFollowers(prevState => [...prevState, stateUser.userId])
      setIsFollow(true)
    } else {
      setFollowers(prevState => prevState.filter((id) => id !== stateUser.userId))
      setIsFollow(false)
    }
    handleFollow(action, profileData._id, stateUser, dispatch)
  }
  useEffect(() => {
    getUserData(false)
    // eslint-disable-next-line
  }, [stateUser])

  useEffect(() => {
    setIsModalOpen(false)
    setshowUsers(null)
    const handleResize = () => {
      setIsMobView(window.innerWidth <= 500);
      setIsTabView(window.innerWidth <= 860);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line
  }, [username])
  return (
    <>
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
        <Stack position={'relative'} borderRadius='20px' bgcolor={'#545c65'} width={isMobView ? '80%' : '400px'} height={'70%'} >
          <IconButton onClick={() => setIsModalOpen(false)} sx={{
            position: 'absolute',
            top: 0,
            right: 0
          }}>
            <Close />
          </IconButton>
          <Stack spacing={1} sx={{ ...customScrollbarStyles, position: 'relative', top: '10%', height: '85%', paddingLeft: '10px' }}>
            {
              isLoad.UserList ? <UserListSkeleton />
                : <UsersList users={showUsers} />
            }
          </Stack >
        </Stack >
      </Stack>}
      <Stack spacing={1} padding={'20px'} >
        <Stack direction={'row'} spacing={4} alignItems={'center'}>
          <Stack
            width={isMobView ? '100px' : isTabView ? '150px' : '200px'}
            height={isMobView ? '100px' : isTabView ? '150px' : '200px'}
            minHeight={isMobView ? '100px' : isTabView ? '150px' : '200px'}
            borderRadius={'50%'}
            border={isLoad.profile && '1px solid'}
            alignItems={'center'}
            justifyContent={'center'}
            overflow={'hidden'}
          >
            {
              isLoad.profile && <Stack height={'100%'} width='100%'>
                <Skeleton variant='circular' animation='wave' height={'inherit'} width={'inherit'} />
              </Stack>}
            <img onLoad={() => setIsLoad(pre => ({ ...pre, profile: false }))} src={profileData?.profilePhoto} alt='profile' style={{ display: isLoad.profile && 'none', width: 'inherit', height: 'inherit', objectFit: 'cover' }} />
          </Stack>
          <Stack spacing={1} >
            <Stack direction={'row'} spacing={3} alignItems={'center'}>
              <Typography component={'h5'} variant={'h5'} >{profileData?.username}</Typography>
              {
                stateUser.userName === username
                  ? < CustomButton onClick={handleEditProfile} endIcon={<Edit />}>
                    Edit Profile
                  </CustomButton >
                  : <CustomButton onClick={followHandler}>
                    {IsFollow ? 'unfollow' : 'follow'}
                  </CustomButton>
              }
            </Stack>
            {(!isTabView || isMobView) && < FollowersSection />}

            {!isMobView && <>
              <Typography fontWeight={'500'} fontSize={'110%'}  >
                {profileData.fullname}
              </Typography>
              <Typography marginTop={'0!important'} sx={{ whiteSpace: 'pre-line' }} >
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
