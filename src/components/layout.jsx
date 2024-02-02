import React from 'react'
import Body from './body'
import { useRef } from 'react';

const Layout = () => {
    const searchRef = useRef(null);

    return (
        <div>
            <Body searchRef={searchRef} />
        </div>
    )
}

export default Layout