import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AccountTab from './AccountTab';
import PostsTab from './PostsTab';
import { useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';

function CustomTabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}


function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

const SearchPage = () => {
  const { search } = useParams()
  const location = useLocation();
  const index = location.state?.index || 0;
  const [value, setValue] = useState(index);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }} className='color-white'>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Accounts" {...a11yProps(0)} />
          <Tab label="Posts" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <AccountTab search={search} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PostsTab search={search} />
      </CustomTabPanel>
    </Box>
  );
}
export default SearchPage