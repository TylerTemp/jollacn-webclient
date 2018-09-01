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
            <ul className="am-comments-list">
              {
                this.props.comment_list.map((item, _index) => (
                  <li className="am-comment" key={ item.id }>

                    <img src={ item.avatar } alt="" className="am-comment-avatar" width="48" height="48"/>

                    <div className="am-comment-main">

                      <header className="am-comment-hd">
                        <div className="am-comment-meta">
                          评论于 <time>{ item.inserted_at}</time>
                        </div>
                      </header>

                      <div className="am-comment-bd">
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
