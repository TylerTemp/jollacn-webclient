import React, { Component } from 'react'
// import {
//     Route,
// } from 'react-router-dom'

import axios from 'axios';


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
            <ol>
              {
                this.props.comment_list.map((item, _index) => (
                  <li key={ item.id }>
                    { item.id } | { item.content }
                  </li>
                ))
              }
            </ol>
          </div>
        </div>
      );
    }
}


export default CommentList;
