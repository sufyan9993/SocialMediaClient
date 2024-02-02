import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Profile from './pages/myProfile';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import ProtectedRoute from './middleware/protectedRoute';
import Layout from './components/layout';
import SavedPost from './components/savedPosts';
import { useEffect, useState } from 'react';
import AddPost from './pages/addPost';
import ProfilePosts from './components/profilePosts';
import EditProfile from './pages/editProfile';
import { Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from './config';
import SearchPage from './pages/search/searchTabs';

function App() {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    user.userName && getUserData(dispatch, user)
  }, [])
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route index element={<Home />} />
            <Route path="Search/:search" element={<SearchPage />} />
            <Route path="Profile/Edit-Profile" element={<EditProfile />} />
            <Route path="Profile/:username" element={<Profile />}>
              <Route path="" element={<ProfilePosts />} />
              <Route path="Saved" element={<ProtectedRoute><SavedPost /></ProtectedRoute>} />
            </Route>
            <Route path="AddPost" element={<ProtectedRoute><AddPost /></ProtectedRoute>} />
            <Route path='*' element={<Typography align={'center'} height={'100%'} variant={'h4'} >404 page not found</Typography>} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
