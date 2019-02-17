import React, { Component } from 'react';

import {
  NavLink,
} from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import HomeIcon from '@material-ui/icons/Home';
import BallotIcon from '@material-ui/icons/Ballot';
import StyleIcon from '@material-ui/icons/Style';


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  widthLimit: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
});


@withStyles(styles)
class Header extends Component {
  render() {
    const { classes } = this.props;
    const at_tab = this.props.at;
    // if(at_tab === undefined) {
    //   at_tab = 'home';
    // };

    const at_tab_index = {
      home: 0,
      post: 1,
      tie: 2,
    }[at_tab];

    // if(at_tab_index === undefined) {
    //   at_tab_index = 0;
    // };

    return (
      <header>
        <Grid container className="navContainer">
          <AppBar position="static">
            <div className={classes.widthLimit}>
              <Toolbar className="navToolbar">
                <Tabs value={at_tab_index}>
                  <NavLink exact to="/" className="nav-link">
                    <Tab
                      label={(
                        <Typography variant="title" color="inherit">
                          <HomeIcon className={classes.icon, 'nav-icon'} />
                        首页
                        </Typography>
)}
                      value="home"
                    />
                  </NavLink>
                  <NavLink exact to="/post" className="nav-link">
                    <Tab
                      label={(
                        <Typography variant="title" color="inherit">
                          <BallotIcon className={classes.icon, 'nav-icon'} />
                        文章
                        </Typography>
)}
                      value="post"
                    />
                  </NavLink>
                  <NavLink exact to="/tie" className="nav-link">
                    <Tab
                      label={(
                        <Typography variant="title" color="inherit">
                          <StyleIcon className={classes.icon, 'nav-icon'} />
                        快讯
                        </Typography>
)}
                      value="tie"
                    />
                  </NavLink>
                </Tabs>
              </Toolbar>
            </div>
          </AppBar>
        </Grid>
        { this.props.children }
      </header>

    );
  }
}


// export default Header
export default Header;
