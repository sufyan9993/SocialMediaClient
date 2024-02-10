import { Box, IconButton, List, ListItem, ListItemButton, ListItemText, Skeleton, Stack, Typography } from '@mui/material'
import { FavoriteBorderRounded, FavoriteRounded, MoreVertOutlined } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { BASE_URL, calculateDate, getUserData, handleFollow } from '../config'
import LikedUserModal from './likedUsersModal'



const PostCard = ({ post, updatePosts }) => {
    const user = useSelector(state => state.user)
    const [isLiked, setIsLiked] = useState(user.login ? post.likes.includes(user.userId) : false)
    const [likedUser, setLikedUser] = useState(post.likes)
    const [isShowLikedUser, setIsShowLikedUser] = useState(false)
    const [smallView, setSmallView] = useState(window.innerWidth <= 430)
    const [isShowMoreCaption, setIsShowMoreCaption] = useState(false)
    const [isMenuShow, setIsMenuShow] = useState(false)
    const [Load, setLoad] = useState({
        profile: false,
        post: false
    })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();

    const handleOpenMenu = () => {
        setIsMenuShow(pre => !pre)
    };
    const handleSavePost = async (action) => {
        try {
            await axios.put(`${BASE_URL}/User/${user.userId}/${action}`, { postId: post._id }, {
                headers: {
                    "authorization": `Bearer ${user.SecurityToken}`,
                    'Content-Type': 'application/json',
                }
            })
            updatePosts()
            getUserData(dispatch, user)
        } catch (err) {
            console.log(err.message);
        }

    };
    const deletePost = async () => {
        try {
            await axios.delete(`${BASE_URL}/Post/${post._id}/deletePost`, {
                headers: {
                    "authorization": `Bearer ${user.SecurityToken}`,
                    'Content-Type': 'application/json',
                }
            })
            updatePosts()
            getUserData(dispatch, user)
        } catch (error) {
            console.log(error);
        }
    }
    const copyLink = (id) => {
        const url = `${window.location.origin}/Post/${id}`;
        navigator.clipboard.writeText(url)
    }
    const menuItem = [
        { text: 'Copy Link', method: (e) => copyLink(post._id) },
        { text: 'View profile', method: () => navigate(`/Profile/${post.user.username}`, { replace: true }) },
    ]

    if (post.user.username === user.userName && user.login) {
        menuItem.push({ text: 'Delete Post', method: deletePost })
    } else if (user.login) {
        !user.savedPosts?.includes(post._id)
            ? menuItem.push({ text: 'Save', method: () => handleSavePost('savePost') })
            : menuItem.push({ text: 'UnSave', method: () => handleSavePost('unSavePost') })

        !user.following.includes(post.user._id)
            ? menuItem.push({ text: 'follow', method: () => handleFollow('follow', post.user._id, user, dispatch) })
            : menuItem.push({ text: 'unfollow', method: () => handleFollow('unfollow', post.user._id, user, dispatch) })
    }

    const handleLike = async () => {
        if (!user.login) {
            return alert('Please login for additional activity')
        } else if (!isLiked) {
            setIsLiked(true)
            setLikedUser([...likedUser, user.userId])
            await axios.put(`${BASE_URL}/Post/${post._id}/Like`, { userId: user.userId }, {
                headers: {
                    "authorization": `Bearer ${user.SecurityToken}`,
                    'Content-Type': 'application/json',
                }
            })
        } else {
            setIsLiked(false)
            setLikedUser(likedUser.filter(data => data !== user.userId))
            await axios.put(`${BASE_URL}/Post/${post._id}/removeLike`, { userId: user.userId }, {
                headers: {
                    "authorization": `Bearer ${user.SecurityToken}`,
                    'Content-Type': 'application/json',
                }
            })
        }
        updatePosts(false)
    }


    useEffect(() => {
        const handleResize = () => {
            setSmallView(window.innerWidth <= 430);
        };
        const handleClickOutside = (event) => {
            const PostMenu = !!event.target.closest('.postMenuHandle');
            if (!PostMenu) {
                // Clicked outside the menu, close it
                setIsMenuShow((false));
            }
        }
        setIsShowLikedUser(false)
        window.addEventListener('resize', handleResize);
        document.body.addEventListener('click', handleClickOutside)
        user.login && setIsLiked(post.likes.includes(user.userId))
        return () => {
            setIsShowLikedUser(false)
            document.body.removeEventListener('click', handleClickOutside);
            window.removeEventListener('resize', handleResize);
        };
        // eslint-disable-next-line
    }, [location.pathname]);
    return (
        <>
            {
                isShowLikedUser && <LikedUserModal postId={post._id} setIsShow={setIsShowLikedUser} />
            }
            <Stack position={'relative'} zIndex={2} bgcolor={'#878797'}
                sx={{
                    width: `${smallView ? 300 : 380}px`,
                    border: '1px solid rgb(135, 135, 151)', borderRadius: '10px', overflow: 'hidden',
                    margin: '10px'
                }} spacing={1}>
                <Box position={'inherit'}   >
                    <Stack onDoubleClick={handleLike} >
                        {!Load.post
                            && <Skeleton sx={{ margin: '1.5%' }}
                                variant='rounded' animation='wave'
                                width={'97%'} height={490} />}
                        <Box display={!Load.post && 'none'} onLoad={() => setLoad(pre => ({ ...pre, post: true }))} alt='image.jpg' component={'img'} src={post.image}
                            margin={'1.5%'}
                            sx={{ width: '97%' }}
                        />
                    </Stack>
                    <Stack width={'96%'} margin={'2%!important'} justifyContent={'space-between'} direction={'row'} position={'absolute'} bottom={0}>
                        <Stack direction={'row'} alignItems={'center'} spacing={1} sx={{
                            textShadow: '0 0 10px black'
                        }}>
                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={40} width={40} borderRadius={'50%'} border={'2px solid #878797'} overflow={'hidden'}>
                                {!Load.profile
                                    && <Skeleton sx={{ margin: '1.5%' }}
                                        variant='rounded' animation='wave'
                                        width={'97%'} height={490} />}
                                <Box display={!Load.profile && 'none'} onLoad={() => setLoad(pre => ({ ...pre, profile: true }))} width={'inherit'} alt='image.jpg' component={'img'} src={post.user.profilePhoto} />
                            </Box>
                            <Box >
                                <Typography variant='h6' >{post.user.username}</Typography>
                                <small >{calculateDate(post.createdAt)}</small>
                            </Box>
                        </Stack>
                        <Stack className='postMenuHandle'
                            display={isMenuShow ? 'block' : 'none'} width={'50%'} bgcolor={'#878797'} borderRadius={'10px'} position={'absolute'} bottom='0' right='0' paddingBottom={'30px'}>
                            <List>
                                {
                                    menuItem.map(item => (
                                        <ListItem key={item.text} disablePadding>
                                            <ListItemButton onClick={() => { item.method(item.text); handleOpenMenu() }}>
                                                <ListItemText primary={item.text} sx={{ display: 'flex', justifyContent: 'center' }} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))
                                }
                            </List>
                        </Stack>
                        <IconButton className='postMenuHandle'
                            onClick={handleOpenMenu}
                        >
                            <MoreVertOutlined />
                        </IconButton>
                    </Stack>
                </Box >
                <Box padding={'5px 5px 5px 20px'} marginTop={'0px!important'}  >
                    <Stack direction={'row'} justifyContent={'space-between'}>
                        <Stack justifyContent={'space-evenly'} maxWidth={'90%'} onMouseOver={(e) => e.target.style.cursor = 'default'} >
                            <Stack margin={0} component={'h3'}>{post.title}</Stack>
                            <Stack margin={0} onClick={() => setIsShowMoreCaption(!isShowMoreCaption)}>
                                {
                                    (post.caption.length < 60 || isShowMoreCaption) ? post.caption : post.caption.substring(0, 60)
                                }
                            </Stack>
                            <Stack direction={'row'} spacing={1} flexWrap={'wrap'}>
                                {
                                    post.tags.map((value, i) => i < 2 && <span key={i} onMouseOver={(e) => e.target.style.cursor = 'pointer'} onClick={() => navigate(`/search/${value}`,{state:{index:1}})}>#{value}</span>)
                                }
                            </Stack>
                        </Stack>
                        <Stack alignItems={'center'} >
                            <IconButton style={{ padding: '0', color: 'black' }} onClick={handleLike} >
                                {isLiked ? <FavoriteRounded htmlColor='red' />
                                    : <FavoriteBorderRounded />}
                            </IconButton>
                            <span onMouseOver={e => e.target.style.cursor = 'pointer'} onClick={() => likedUser.length > 0 && setIsShowLikedUser(true)}>
                                {likedUser.length || 0}
                            </span>
                        </Stack>
                    </Stack>
                </Box>
            </Stack >
        </>
    )
}

export const PostCardSkeleton = () => {
    const [smallView, setSmallView] = useState(window.innerWidth <= 430)
    useEffect(() => {
        const handleResize = () => {
            setSmallView(window.innerWidth <= 430);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
        // eslint-disable-next-line
    }, []);
    return (
        [...Array(5)].map((_,i) => <Stack key={i} sx={{
            position: 'relative',
            width: `${smallView ? 300 : 380}px`,
            height: `${smallView ? 467 : 572}px`,
            margin: '10px'
        }} >
            <Skeleton variant='rectangular' animation='wave' height={'80%'} width='97%' />
            <Stack width={'90%'} margin={'2%'} direction={'row'} position={'absolute'} bottom={'20%'}>
                <Stack width={'60px'}>
                    <Skeleton variant='circular' animation='wave' height={50} width={50} />
                </Stack>
                <Stack width={'80%'}>
                    <Skeleton variant='text' animation='wave' sx={{ fontSize: '1.25rem' }} />
                    <Skeleton variant='text' animation='wave' sx={{ fontSize: '0.8rem' }} width={'30%'} />
                </Stack>
            </Stack>
            <Stack width={'80%'}>
                <Skeleton variant='text' animation='wave' sx={{ fontSize: '1.25rem' }} />
                <Skeleton variant='text' animation='wave' sx={{ fontSize: '0.8rem' }} width={'40%'} />
                <Skeleton variant='text' animation='wave' sx={{ fontSize: '0.8rem' }} width={'30%'} />

            </Stack>

        </Stack>)
    )
}


export default PostCard