import React, { useEffect } from 'react';
import {
  useLocation,
} from 'react-router-dom';
import { connect } from 'react-redux';

// import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import BallotIcon from '@mui/icons-material/Ballot';
import StyleIcon from '@mui/icons-material/Style';
import Box from '@mui/system/Box';

import { TAB_AT } from '~/actions/ActionTypes';

import { SNavLink, STab } from './Style';

import Post from '~/page/post';

const locationChanged = ({ pathname }, onTabAt) => {
  // if (pathname === '/') {
  //   return onTabAt('home')
  // }

  if (pathname.startsWith('/post')) {
    return onTabAt('post');
  }

  if (pathname.startsWith('/tie')) {
    return onTabAt('tie');
  }

  return onTabAt('home');
};

// export default Header
const Header = ({ tabAt, onTabAt, children }) => {
  const location = useLocation();

  useEffect(() => {
    locationChanged(location, onTabAt);
  }, [location]);

  return (
    <header>
      <AppBar position="static" sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: '1100px' }}>
          <Toolbar>
            <Tabs indicatorColor="secondary" value={tabAt}>
              <STab
                color="white"
                label={(
                  <SNavLink to="/">
                    <Typography variant="h6" color="inherit" display="flex" alignItems="center">
                      <HomeIcon />
                      首页
                    </Typography>
                  </SNavLink>
                  )}
                value="home"
              />

              <STab
                label={(
                  <SNavLink to="/post">
                    <Typography variant="h6" color="inherit" display="flex" alignItems="center">
                      <BallotIcon />
                      文章
                    </Typography>
                  </SNavLink>
                  )}
                value="post"
              />

              <STab
                label={(
                  <SNavLink to="/tie">
                    <Typography variant="h6" color="inherit" display="flex" alignItems="center">
                      <StyleIcon />
                      快讯
                    </Typography>
                  </SNavLink>
                  )}
                value="tie"
              />

            </Tabs>
          </Toolbar>
        </Box>
      </AppBar>
      { children }
    </header>
  );
};

const mapStateToProps = ({ tabAt }) => ({ tabAt });

const mapDispatchToProps = (dispatch) => ({
  onTabAt: (tabAt) => dispatch({ type: TAB_AT, payload: { tabAt } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
