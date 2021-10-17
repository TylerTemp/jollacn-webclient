import React from 'react';
// import {
//   NavLink,
//   Link,
// } from 'react-router-dom';
import { connect } from 'react-redux';

import Grid from '@mui/material/Grid';
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

// const styles = theme => ({
//   root: {
//     flexGrow: 1,
//   },
//   widthLimit: {
//     width: 'auto',
//     marginLeft: theme.spacing.unit * 3,
//     marginRight: theme.spacing.unit * 3,
//     [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
//       width: 1100,
//       marginLeft: 'auto',
//       marginRight: 'auto',
//     },
//   },
// });

// export default Header
const Header = ({ tabAt, onTabAt, children}) => {
    // const atTabIndex = {
    //   home: 0,
    //   post: 1,
    //   tie: 2,
    // }[tabAt];

    // const onTabChange = tabIndex => tabAt(['home', 'post', 'tie'][tabIndex]);

    return <header>
        <AppBar position="static" sx={{display: 'flex', alignItems: 'center'}}>
          <Box sx={{width: '100%', maxWidth: '1100px'}}>
            <Toolbar>
              <Tabs indicatorColor="secondary" value={tabAt} onChange={(_, newValue) => onTabAt(newValue)}>
                  <STab
                    color="white"
                    label={(
                      <SNavLink exact to="/" className="nav-link" onClick={() => onTabAt('home')}>
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
                      <SNavLink exact to="/post" onClick={() => onTabAt('post')}>
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
                      <SNavLink exact to="/tie" onClick={() => onTabAt('tie')}>
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
    </header>;
};


const mapStateToProps = ({tabAt}) => ({tabAt});

const mapDispatchToProps = (dispatch) => ({
    onTabAt: tabAt => dispatch({type: TAB_AT, payload: {tabAt}}),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
