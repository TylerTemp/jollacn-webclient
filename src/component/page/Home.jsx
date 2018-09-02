import React, { Component } from 'react';

import Header from '../Header'
import PostListWithPagination from './post/PostListWithPagination';


class Home extends Component {

  render() {
    return (
      <div>
        <Header></Header>
        <div className="home">
            <h1 className="title">Welcome, { React.version }</h1>
            <div>Tie preview goes here</div>
            <PostListWithPagination limit={ 8 }></PostListWithPagination>
        </div>
      </div>
    );
  }
}


export default Home
