import React, { Component } from 'react';
import ReactDom from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    NavLink,
    Switch
} from 'react-router-dom';

import Home from './component/page/Home'
import Header from './component/Header'
// import Layout from './component/Layout'
// import {default as PostList} from './component/page/post/List'
import PostListWithPagination from './component/page/post/PostListWithPagination'
import PostWithComment from './component/page/post/PostWithComment'
import TieWithComment from './component/page/tie/TieWithComment'

import './css/index.css'


class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={Home}/>

            <Route exact path="/post" component={PostListWithPagination}/>
            <Route exact path="/post/page/:page" component={PostListWithPagination}/>
            <Route exact path="/post/:slug" component={PostWithComment}/>

            <Route exact path="/tie/:slug" component={TieWithComment}/>
          </Switch>
        </Router>
      </div>
    );
  }
}

ReactDom.render(
    <App />,
    document.getElementById('root')
)
