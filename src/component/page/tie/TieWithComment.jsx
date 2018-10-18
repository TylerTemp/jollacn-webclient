import React, { Component } from 'react'
// import {
//     Route,
// } from 'react-router-dom'

import axios from 'axios';

import Pagination from '../../Pagination'
import CommentList from '../../CommentList'
import CommentAdd from '../../CommentAdd'
import Tie from './Tie'


class TieWithComment extends Component {

  constructor(props) {
    super(props);
    this.slug = this.props.match.params.slug;
    this.state = {
      comment_limit: 10,
      comment_page_loaded: false,
      comment_current_page: 1,
      comment_total_page: 1,
      comment_loaded: false,
      comment_error: null,
      comments: []
    };
  }

  componentDidMount() {
    this.fetchCommentList(this.state.comment_current_page);
  }

  fetchCommentList(page) {
    this.setState({
      comment_loaded: false,
      comment_error: null,
      comment_current_page: page
    });

    let limit = this.state.comment_limit;
    let offset = (page - 1) * limit;

    axios.get(
        `/api/tie/${this.slug}/comment?offset=${offset}&limit=${limit}`,
        {
          headers: {'Accept': 'application/json'},
          transformResponse: undefined
        }
      )
      .then(res => {
        let data = res.data;
        console.log(`comment for tie/${this.slug} result:`, data);
        let comments_result = JSON.parse(data);

        let total = comments_result.total;
        let page_mod = total % comments_result.limit;
        let page_div = Math.trunc(total / comments_result.limit);
        let total_page = page_div;
        if(page_div == 0) {
          total_page = 1;
        } else if (page_mod != 0) {
          total_page = page_div + 1;
        };

        this.setState({
          comment_limit: comments_result.limit,
          comment_loaded: true,
          comment_error: null,
          comment_current_page: page,
          comment_total_page: total_page,
          comments: comments_result.comments
        });
      })
      .catch(res => {
        var error = 'unknown server error';
        if (res.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          var data = res.response.data;
          console.log('response', data);
          var json_resp = null;
          try {
            json_resp = JSON.parse(data);
          } catch (e) {
            // console.log(res.response);
            error = `${res.response.status} ${res.response.statusText}`;
          };
          if(json_resp) {
            error = json_resp.message || error;
          };
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', res);
          error = resp.message;
        };
        console.log('set error to', error);
        this.setState({
          comment_loaded: true,
          comment_error: error,
          comment_current_page: page,
        });
      })
      .then(() => {
        this.setState({comment_loaded: true});
      });
  }

  goToCommentPage(num) {
    console.log('tie with comment goes to page', num);
    this.fetchCommentList(num);
  }

  commentAdd(data) {
    console.log('tie with comment received comment', data);
    let comment_list = this.state.comments;
    comment_list.push(data);
    // console.log(comment_list);
    this.setState({comments: comment_list});
  }

  render() {

    const slug = this.slug;
    const { comment_loaded, comment_error, comments } = this.state

    return (
      <div>

        <Tie
          slug={ slug }>
        </Tie>

        <CommentList
          error={ comment_error }
          loaded={ comment_loaded }
          comment_list={ comments }>
        </CommentList>
        <CommentAdd
          api={ `/api/tie/${this.slug}/comment` }
          commentAdd={ this.commentAdd.bind(this) }>
        </CommentAdd>
        <Pagination
            total={ this.state.comment_total_page }
            current={ this.state.comment_current_page }
            pageUrl={ undefined }
            goToPage={ (num) => this.goToCommentPage(num) }>
        </Pagination>

      </div>
    );

  }
}


export default TieWithComment;
