import React, { Component } from 'react';
import ReactDom from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  // NavLink,
  Switch,
  Link,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';

import 'typeface-roboto';
// import CssBaseline from '@mui/material/CssBaseline';

// import Home from '~/page/Home';
// // import Header from '~/component/Header';
// import NotFound from '~/page/NotFound';
// // import Layout from './component/Layout'
// // import {default as PostList} from './component/page/post/List'
// // import PostListWithPagination from '~/component/page/post/PostListWithPagination';
// import RedirectPostSlug from '~/page/post/RedirectPostSlug';
// import PostListWithHeaderPagination from '~/page/post/PostListWithHeaderPagination';
// import PostWithComment from '~/page/post/PostWithComment';
// // import TieListWithHeaderPagination from './component/page/tie/TieListWithHeaderPagination';
// // import TieWithComment from './component/page/tie/TieWithComment';
// import TieModalSwitch from '~/page/tie/TieModalable';

import appTheme from '~/component/Theme';
import MainLayout from '~/component/main_layout';
import store from '~/store';
import PostList from '~/page/post_list';
import Post from '~/page/post';

import '~/css/index.css';


const App = () => <>
    <Router>
      <Provider store={store}>
        <ThemeProvider theme={appTheme}>
          <MainLayout>
            <Switch>
              {/*<Route exact path="/" component={Home} />*/}

              <Route exact path="/post" component={props => <PostList key={1} page={1} />} />
              <Route exact path="/post/page/:page" component={props => <PostList key={parseInt(props.match.params.page)} page={parseInt(props.match.params.page)} />} />
              <Route exact path="/post/:slug" component={props => <Post key={props.match.params.slug} {...props}/>} />

              {/*<Route path="/tie" component={TieModalSwitch} />
              <Route exact path="/:post_slug" component={RedirectPostSlug} />
              <Route component={NotFound} />*/}
            </Switch>
          </MainLayout>
        </ThemeProvider>
      </Provider>
    </Router>
</>;

ReactDom.render(
  <App />,
  document.getElementById('root'),
);
