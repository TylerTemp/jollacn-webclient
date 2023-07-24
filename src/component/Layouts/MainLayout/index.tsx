import {
  Link, Outlet, useLocation,
} from 'react-router-dom';
import Box from '@mui/material/Box';

import BlogHeaderImg from '~/asset/image/blog_header.png';

// import { HeaderImg, STab } from './Style';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import BallotIcon from '@mui/icons-material/Ballot';
import StyleIcon from '@mui/icons-material/Style';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import Divider from '@mui/material/Divider';
import Tab from '@mui/material/Tab';
import Style from './index.css';
import MainBottomProvider from './MainBottomProvider';
import MountPoint from './MountPoint';
import { WidthLimit } from '../WidthLimitLayout';
// import MainBottomContext from './MainBottomContext';


export default () => {

    const {pathname} = useLocation();

    let tabAt = 'home';
    if (pathname.startsWith('/post')) {
      tabAt = 'post';
    }
    else if (pathname.startsWith('/tie')) {
      tabAt = 'tie';
    }

    return <MainBottomProvider>
      <Box className={Style.sticky}>
        <AppBar position="relative" sx={{ display: 'flex', alignItems: 'center' }}>
          <WidthLimit>
            <Toolbar>
              <Tabs indicatorColor="secondary" value={tabAt}>
                <Tab
                  className={Style.tab}
                  color="white"
                  label={(
                    <Link to="/">
                      <Typography variant="h6" color="inherit" display="flex" alignItems="center">
                        <HomeIcon />
                        首页
                      </Typography>
                    </Link>
                    )}
                  value="home"
                />

                <Tab
                  className={Style.tab}
                  label={(
                    <Link to="/post">
                      <Typography variant="h6" color="inherit" display="flex" alignItems="center">
                        <BallotIcon />
                        文章
                      </Typography>
                    </Link>
                    )}
                  value="post"
                />

                <Tab
                  className={Style.tab}
                  label={(
                    <Link to="/tie">
                      <Typography variant="h6" color="inherit" display="flex" alignItems="center">
                        <StyleIcon />
                        快讯
                      </Typography>
                    </Link>
                    )}
                  value="tie"
                />

              </Tabs>
            </Toolbar>
          </WidthLimit>
        </AppBar>
        <MountPoint />
      </Box>

      <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '40px',
            paddingBottom: '25px',
            paddingLeft: '10px',
            paddingRight: '10px',
          }}
      >
        <Link to="/">
          <img className={Style.headerImg} src={BlogHeaderImg} alt="Jolla非官方中文博客" />
        </Link>
      </Box>

      <Box className={Style.content}>
        <Outlet />
      </Box>

      <footer>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline',
          width: '100%',
          color: 'white',
          padding: '30px 0',
        }}
        >
          <Typography variant="body2" gutterBottom>
            <a href="https://beian.miit.gov.cn/" target="_blank" style={{ textDecoration: 'inherit', color: 'inherit' }} rel="noreferrer">京ICP备18007798号</a>
          </Typography>
          <Divider orientation="vertical" sx={{ margin: '0px 5px' }} />
          <Typography variant="body2" gutterBottom>
            &copy; TylerTemp/
            <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" style={{ textDecoration: 'inherit', color: 'inherit' }} rel="noreferrer">CC-BY-SA 4.0</a>
          </Typography>

          <Divider orientation="vertical" sx={{ margin: '0px 5px' }} />

          <Typography variant="body2" gutterBottom>
            <a href="/rss.xml" target="_blank" style={{ textDecoration: 'inherit', color: 'inherit' }} rel="noreferrer">
              <RssFeedIcon />
            </a>
          </Typography>
        </Box>
      </footer>
    </MainBottomProvider>;
}
