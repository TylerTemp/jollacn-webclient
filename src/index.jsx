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
import {default as PostArticleListWithPagination} from './component/page/post/ArticleListWithPagination'
import {default as PostArticleWithComment} from './component/page/post/ArticleWithComment'
import {default as TieWithComment} from './component/page/tie/TieWithComment'

import './css/index.css'


class App extends Component {
    render() {
      return (
        <div>
          <Router>
            <Switch>
              <Route exact path="/" component={Home}/>

              <Route exact path="/post" component={PostArticleListWithPagination}/>
              <Route exact path="/post/page/:page" component={PostArticleListWithPagination}/>
              <Route exact path="/post/:slug" component={PostArticleWithComment}/>

              <Route exact path="/tie/:slug" component={TieWithComment}/>
            </Switch>
          </Router>
        </div>
      );
    }
    // render() {
    //     return <Layout>
    //       <Router>
    //             <Switch>
    //               <Route exact path="/" component={Home}/>
    //               <Route path="/post" component={PostList}/>
    //               <Route path="/post/_page/:page" component={PostList}/>
    //               <Route path="/post/:slug" component={PostArticle}/>
    //             </Switch>
    //       </Router>
    //     </Layout>
    // }
}

ReactDom.render(
    <App />,
    document.getElementById('root')
)
