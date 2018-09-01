import React, { Component } from 'react'
// import {
//     Route,
//     NavLink
// } from 'react-router-dom'

import axios from 'axios';

import Header from '../../Header'
import PostListWithPagination from './PostListWithPagination';


class PostListWithHeaderPagination extends Component {

  render() {
    return (
      <div>
        <Header at="post"></Header>
        <PostListWithPagination limit={ 10 }></PostListWithPagination>
      </div>
    );
  }
}


export default PostListWithHeaderPagination;
