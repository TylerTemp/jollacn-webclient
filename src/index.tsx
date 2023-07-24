import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

import 'typeface-roboto';

import appTheme from '~/component/Theme';
import MainLayout from '~/component/Layouts/MainLayout';
import PostList from '~/page/PostList';
import Post from '~/page/Post';
import TieList from '~/page/tie_list';
import Tie from '~/page/tie';
import Home from '~/page/home';
import NotFound from '~/page/NotFound';
import ErrorBoundary from "~/component/ErrorBoundary";
import WidthLimitLayout from "./component/Layouts/WidthLimitLayout";


const App = () => (
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider theme={appTheme}>
        <Router>
          <Routes>
              <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />

                  <Route path="/post" element={<WidthLimitLayout />}>
                      <Route index element={<PostList />} />
                      <Route path="page/:page" element={<PostList />} />

                      <Route path=":slug" element={<Post />} />
                  </Route>

                  <Route path="/tie" element={<TieList />} />
                  <Route path="/tie/page/:page" element={<TieList />} />
                  {/* <Route path="/tie/:tieId" component={(props) => <Tie key={props.match.params.tieId} {...props} />} /> */}
                  <Route path="/tie/:tieId" element={<Tie />} />
                  <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);

// ReactDom.render(
//   <App />,
//   document.getElementById('root'),
// );


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <App />
);