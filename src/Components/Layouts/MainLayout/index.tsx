import {
    Link, Outlet, useLocation, useNavigate,
} from 'react-router-dom';
import Box from '@mui/material/Box';

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
// import * as Style from './index.scss';
import { PropsWithChildren, useContext } from 'react';
// import useTheme from '@mui/material/styles/useTheme';
import Style from './index.scss';
import MainBottomProvider from './MainBottomProvider';
import MountPoint from './MountPoint';
import { WidthLimit } from '../WidthLimitLayout';
import { Context, ThemeType } from '~/Components/Theme/ThemeProvider';
// import MainBottomContext from './MainBottomContext';
import HeaderImg from '~/Components/HeaderImg';
import DarkLightToggle from './DarkLightToggle';
import MuiLink from "@mui/material/Link";
import NoStyleLink from "~/Utils/NoStyleLink.scss";

export const menuBarHeight = 56;

export const PageStruct = ({children, className}: PropsWithChildren<{className?: HTMLElement['className']}>) => <Box className={className}>
    <HeaderImg />
    <Box className={Style.content}>
        {children}
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
                <MuiLink href="https://beian.miit.gov.cn/" target="_blank" style={{ textDecoration: 'inherit', color: 'inherit' }} rel="noreferrer">京ICP备18007798号</MuiLink>
            </Typography>
            <Divider orientation="vertical" sx={{ margin: '0px 5px' }} />
            <Typography variant="body2" gutterBottom>
                &copy; TylerTemp/
                <MuiLink href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" style={{ textDecoration: 'inherit', color: 'inherit' }} rel="noreferrer">CC-BY-SA 4.0</MuiLink>
            </Typography>

            <Divider orientation="vertical" sx={{ margin: '0px 5px' }} />

            <Typography variant="body2" gutterBottom>
                <MuiLink href="/rss.xml" target="_blank" style={{ textDecoration: 'inherit', color: 'inherit' }} rel="noreferrer">
                    <RssFeedIcon />
                </MuiLink>
            </Typography>
        </Box>
    </footer>
</Box>;

export default function () {
    const navigate = useNavigate();

    const { theme, setTheme } = useContext(Context);

    // const curTheme = useTheme();

    const { pathname } = useLocation();

    let tabAt = 'home';
    if (pathname.startsWith('/post')) {
        tabAt = 'post';
    } else if (pathname.startsWith('/tie')) {
        tabAt = 'tie';
    }

    return (
        <MainBottomProvider>
            <Box className={Style.menuBar} style={{ height: `${menuBarHeight}px` }}>
                <AppBar position="relative" sx={{ display: 'flex', alignItems: 'center' }}>
                    <WidthLimit>
                        <Toolbar disableGutters>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    // display: { xs: 'none', md: 'flex' }
                                }}
                            >
                                <Tabs value={tabAt} textColor="secondary" indicatorColor="secondary">
                                    <Tab
                                        // className={Style.tab}
                                        // color="white"
                                        onClick={() => navigate('/')}
                                        label={(
                                            <Link to="/" className={NoStyleLink.link}>
                                                <Typography variant="h6" color="inherit" display="flex" alignItems="center">
                                                    <HomeIcon />
                                                    首页
                                                </Typography>
                                            </Link>
                                        )}
                                        value="home"
                                    />

                                    <Tab
                                        // className={Style.tab}
                                        onClick={() => navigate('/post')}
                                        label={(
                                            <Link to="/post" className={NoStyleLink.link}>
                                                <Typography variant="h6" color="inherit" display="flex" alignItems="center">
                                                    <BallotIcon />
                                                    文章
                                                </Typography>
                                            </Link>
                                        )}
                                        value="post"
                                    />

                                    <Tab
                                        // className={Style.tab}
                                        onClick={() => navigate('/tie')}
                                        label={(
                                            <Link to="/tie" className={NoStyleLink.link}>
                                                <Typography variant="h6" color="inherit" display="flex" alignItems="center">
                                                    <StyleIcon />
                                                    快讯
                                                </Typography>
                                            </Link>
                                        )}
                                        value="tie"
                                    />

                                </Tabs>
                            </Box>

                            <Box sx={{ flexGrow: 0 }}>
                                {/* <Button onClick={() => setTheme(theme === ThemeType.Dark ? ThemeType.Light : ThemeType.Dark)}>
                                    <LightbulbTwoToneIcon style={{ color: curTheme.themeBubble }} />
                                </Button> */}
                                <DarkLightToggle isDark={theme === ThemeType.Dark} onChange={toDark => setTheme(toDark? ThemeType.Dark: ThemeType.Light)} />
                            </Box>

                        </Toolbar>
                    </WidthLimit>
                </AppBar>
                <MountPoint />
            </Box>

            <Box style={{ height: `${menuBarHeight}px` }} />

            <PageStruct><Outlet /></PageStruct>
        </MainBottomProvider>
    );
}
