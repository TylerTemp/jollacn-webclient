import React from 'react';
import ReactDom from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  // NavLink,
  Switch,
  // Link,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';

import 'typeface-roboto';

import appTheme from '~/component/Theme';
import MainLayout from '~/component/main_layout';
import store from '~/store';
import PostList from '~/page/post_list';
import Post from '~/page/post';
import TieList from '~/page/tie_list';
import Tie from '~/page/tie';
import Home from '~/page/home';
import NotFound from '~/page/NotFound';

const App = () => (
  <>
    <Router>
      <Provider store={store}>
        <ThemeProvider theme={appTheme}>
          <MainLayout>
            <Switch>
              <Route exact path="/" component={Home} />

              <Route exact path="/post" component={PostList} />
              <Route exact path="/post/page/:page" component={PostList} />
              {/*eslint-disable-next-line react/jsx-props-no-spreading*/}
              <Route exact path="/post/:slug" component={(props) => <Post key={props.match.params.slug} {...props} />} />

              <Route exact path="/tie" component={TieList} />
              <Route exact path="/tie/page/:page" component={TieList} />
              {/*eslint-disable-next-line react/jsx-props-no-spreading*/}
              <Route exact path="/tie/:tieId" component={(props) => <Tie key={props.match.params.tieId} {...props} />} />
              <Route component={NotFound} />
            </Switch>
          </MainLayout>
        </ThemeProvider>
      </Provider>
    </Router>
  </>
);

ReactDom.render(
  <App />,
  document.getElementById('root'),
);
