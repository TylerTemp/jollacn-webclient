import React, { Component } from 'react'
// import {
//     Route,
// } from 'react-router-dom'

import axios from 'axios';

import '../css/comment.css'


class CommentList extends Component {

    constructor(props) {
      super(props);
      this.state = {
      }
    }

    render() {
      if (this.props.error) {
        return (
          <div>
              <p>ERROR: { this.props.error }</p>
          </div>
        )
      };
      if (!this.props.loaded) {
        return (
          <div>
            <p>loading...</p>
          </div>
        )
      };
      return (
        <div>
          <div>
            <ul class="am-comments-list">
              {
                this.props.comment_list.map((item, _index) => (
                  <li class="am-comment" key={ item.id }>

                    <img src={ item.avatar } alt="" class="am-comment-avatar" width="48" height="48"/>

                    <div class="am-comment-main">

                      <header class="am-comment-hd">
                        <div class="am-comment-meta">
                          评论于 <time>{ item.inserted_at}</time>
                        </div>
                      </header>

                      <div class="am-comment-bd">
                        { item.content }
                      </div>
                    </div>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      );
    }
}


export default CommentList;
