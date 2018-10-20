import React, { Component } from 'react';
import ReactDom from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    NavLink,
    Switch
} from 'react-router-dom';

import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';

import Home from './component/page/Home';
import Header from './component/Header';
import NotFound from './component/page/NotFound';
// import Layout from './component/Layout'
// import {default as PostList} from './component/page/post/List'
import PostListWithPagination from './component/page/post/PostListWithPagination';
import PostListWithHeaderPagination from './component/page/post/PostListWithHeaderPagination';
import PostWithComment from './component/page/post/PostWithComment';
// import TieListWithHeaderPagination from './component/page/tie/TieListWithHeaderPagination';
// import TieWithComment from './component/page/tie/TieWithComment';
import TieModalSwitch from './component/page/tie/TieModalable';

import './css/index.css';


class App extends Component {

  previousLocation = this.props.location;

  componentWillUpdate(nextProps) {
    const { location } = this.props;
    if (
      nextProps.history.action !== "POP" &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline></CssBaseline>
        <Router>
          <Switch >
            <Route exact path="/" component={Home}/>

            <Route exact path="/post" component={PostListWithHeaderPagination}/>
            <Route exact path="/post/page/:page" component={PostListWithHeaderPagination}/>
            <Route exact path="/post/:slug" component={PostWithComment}/>

            {/* <Route exact path="/tie" component={TieListWithHeaderPagination}/> */}
            {/* <Route exact path="/tie/page/:page" component={TieListWithHeaderPagination}/> */}

            {/* <Route exact path="/tie/:id" component={TieWithComment}/> */}
            <Route component={TieModalSwitch} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

ReactDom.render(
    <App />,
    document.getElementById('root')
);
