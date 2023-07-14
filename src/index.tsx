import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

import 'typeface-roboto';

import appTheme from '~/component/Theme';
import MainLayout from '~/component/main_layout';
import PostList from '~/page/post_list';
import Post from '~/page/post';
import TieList from '~/page/tie_list';
import Tie from '~/page/tie';
import Home from '~/page/home';
import NotFound from '~/page/NotFound';


const App = () => (
  <StrictMode>
    <ThemeProvider theme={appTheme}>
      <Router>
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />

                <Route path="/post" element={<PostList />} />
                <Route path="/post/page/:page" element={<PostList />} />
                {/* <Route path="/post/:slug" component={(props) => <Post key={props.match.params.slug} {...props} />} /> */}
                <Route path="/post/:slug" element={<Post />} />

                <Route path="/tie" element={<TieList />} />
                <Route path="/tie/page/:page" element={<TieList />} />
                {/* <Route path="/tie/:tieId" component={(props) => <Tie key={props.match.params.tieId} {...props} />} /> */}
                <Route path="/tie/:tieId" element={<Tie />} />
                <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
      </Router>
    </ThemeProvider>
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