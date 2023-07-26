import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import 'typeface-roboto';

// import appTheme from '~/component/Theme';
import ThemeProvider from "~/component/Theme/ThemeProvider";
import MainLayout from '~/component/Layouts/MainLayout';
import PostList from '~/page/PostList';
import Post from '~/page/Post';
import TieList from '~/page/tie_list';
import Tie from '~/page/tie';
import Home from '~/page/Home';
import NotFound from '~/page/NotFound';
import ErrorBoundary from "~/component/ErrorBoundary";
import WidthLimitLayout, { WidthLimit } from "./component/Layouts/WidthLimitLayout";


const App = () => (
  <>
      <ThemeProvider>
          <CssBaseline />
          <ErrorBoundary>
              <Router>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<WidthLimit><Home /></WidthLimit>} />

                        <Route path="/post" element={<WidthLimitLayout />}>
                            <Route path="" element={<PostList />}>
                              <Route path=":slug" element={<Post />} />
                            </Route>
                            <Route path="page/:page" element={<PostList />} />

                        </Route>

                        <Route path="/tie" element={<TieList />} />
                        <Route path="/tie/page/:page" element={<TieList />} />
                        {/* <Route path="/tie/:tieId" component={(props) => <Tie key={props.match.params.tieId} {...props} />} /> */}
                        <Route path="/tie/:tieId" element={<Tie />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
              </Router>

          </ErrorBoundary>
      </ThemeProvider>
  </>
);

// ReactDom.render(
//   <App />,
//   document.getElementById('root'),
// );


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <App />
);