// import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'typeface-roboto';

// import appTheme from '~/Components/Theme';
import ThemeProvider from '~/Components/Theme/ThemeProvider';
import MainLayout, { PageStruct, menuBarHeight } from '~/Components/Layouts/MainLayout';
import PostList from '~/Pages/PostList';
import Post from '~/Pages/Post';
import TieList from '~/Pages/TieList';
import Tie from '~/Pages/Tie';
import Home from '~/Pages/Home';
import NotFound from '~/Pages/NotFound';
import ErrorBoundary from '~/Components/ErrorBoundary';
import WidthLimitLayout, { WidthLimit } from './Components/Layouts/WidthLimitLayout';
import { PropsWithChildren, StrictMode } from 'react';
import useTheme from '@mui/material/styles/useTheme';
import Style from "./index.scss";
import Fixed from './Components/Fixed';

const OutletWrapper = ({ children }: PropsWithChildren) => {

    const theme = useTheme();
    const bgColor = theme.palette.background.default;

    return <Fixed top={menuBarHeight} style={{backgroundColor: bgColor}}>
        <PageStruct className={Style.fixed}>
            {children}
        </PageStruct>
    </Fixed>;
}

const App = () => <StrictMode>
    <ThemeProvider>
        <CssBaseline />
        <ErrorBoundary>
            <Router>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<WidthLimit><Home /></WidthLimit>} />

                        <Route path="/post" element={<WidthLimitLayout />}>
                            <Route path="page/:page" element={<PostList />}>
                                <Route path=":slug" element={<OutletWrapper><WidthLimit><Post /></WidthLimit></OutletWrapper>} />
                            </Route>
                            <Route path="" element={<PostList />}>
                                <Route path=":slug" element={<OutletWrapper><WidthLimit><Post /></WidthLimit></OutletWrapper>} />
                            </Route>
                        </Route>

                        <Route path="/tie" element={<WidthLimitLayout maxWidth="lg" />}>
                            <Route path="page/:page" element={<TieList />}>
                                <Route path=":tieId" element={<OutletWrapper><WidthLimit maxWidth="lg"><Tie /></WidthLimit></OutletWrapper>} />
                            </Route>
                            <Route path="" element={<TieList />}>
                                <Route path=":tieId" element={<OutletWrapper><WidthLimit maxWidth="lg"><Tie /></WidthLimit></OutletWrapper>} />
                            </Route>
                        </Route>

                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </Router>

        </ErrorBoundary>
    </ThemeProvider>
</StrictMode>;

// ReactDom.render(
//   <App />,
//   document.getElementById('root'),
// );

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />,
);
