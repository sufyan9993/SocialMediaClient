import React, { } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
const ProtectedRoute = ({ children }) => {
    const user = useSelector(state => state.user)
    const { username } = useParams()
    if (username && user.login) {
        if (username === user.userName) {
            return children
        }else{
            return <Navigate to="*" replace/>
        }
    } else if (user.login) {
        return children
    } else {
        return <Navigate to="/Login" replace />;
    }
}

export default ProtectedRoute
