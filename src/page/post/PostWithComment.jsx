import React, { Component } from 'react';

import { withStyles } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import ChevronLeftSharpIcon from '@mui/icons-material/ChevronLeftSharp';

import axios from 'axios';

import Header from '~/component/Header';
import Pagination from '~/component/Pagination';
import CommentList from '~/component/CommentList';
import CommentAdd from '~/component/CommentAdd';
import Post from './Post';


// const styles = theme => ({
//   pageWidthLimit: {
//     width: 'auto',
//     marginLeft: theme.spacing.unit * 3,
//     marginRight: theme.spacing.unit * 3,
//     [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
//       width: 1100,
//       marginLeft: 'auto',
//       marginRight: 'auto',
//     },
//     [theme.breakpoints.down('sm')]: {
//       marginLeft: theme.spacing.unit * 0.5,
//       marginRight: theme.spacing.unit * 0.5,
//     },
//   },
//   headerContentSpace: {
//     height: '20px',
//   },
//   postCommentDivider: {
//     // 'border-color': '#eee',
//     border: 'none',
//     height: 0,
//     // 'border-top': '1px solid #eee',
//     'margin-top': '15px',
//     'margin-bottom': '15px',
//   },
//
//   commentPaper: {
//     paddingTop: theme.spacing.unit * 5,
//     paddingBottom: theme.spacing.unit * 2,
//     paddingLeft: theme.spacing.unit * 3,
//     paddingRight: theme.spacing.unit * 3,
//   },
//   textRight: {
//     'text-align': 'right',
//   },
//
//   backButtonWrapper: {
//     'padding-bottom': '10px',
//   },
//   backButton: {
//     color: 'white',
//   },
// });
//
//
// @withStyles(styles)
class PostWithComment extends Component {
  constructor(props) {
    super(props);
    this.slug = this.props.match.params.slug;
    this.limit = 10;
    this.state = {
      comment_page_loaded: false,
      comment_current_page: 1,
      comment_total_page: 1,
      comment_loaded: false,
      comment_error: null,
      comments: [],
    };
  }

  componentDidMount() {
    this.fetchCommentList(this.state.comment_current_page);
  }

  fetchCommentList(page) {
    this.setState({
      comment_loaded: false,
      comment_error: null,
      comment_current_page: page,
    });

    const { limit } = this;
    const offset = (page - 1) * limit;

    axios.get(
      `/api/post/${this.slug}/comment`,
      {
        params: { offset, limit },
        headers: { Accept: 'application/json' },
        transformResponse: undefined,
      },
    )
      .then((res) => {
        const { data } = res;
        console.log(`comment for ${this.slug} result:`, data);
        const comments_result = JSON.parse(data);

        const { total } = comments_result;
        const page_mod = total % this.limit;
        const page_div = Math.trunc(total / this.limit);
        let total_page = page_div;
        if (page_div == 0) {
          total_page = 1;
        } else if (page_mod != 0) {
          total_page = page_div + 1;
        }

        this.setState({
          comment_loaded: true,
          comment_error: null,
          comment_current_page: page,
          comment_total_page: total_page,
          comments: comments_result.comments,
        });
      })
      .catch((res) => {
        let error = 'unknown server error';
        if (res.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const { data } = res.response;
          console.log('response', data);
          let json_resp = null;
          try {
            json_resp = JSON.parse(data);
          } catch (e) {
            // console.log(res.response);
            error = `${res.response.status} ${res.response.statusText}`;
          }
          if (json_resp) {
            error = json_resp.message || error;
          }
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', res);
          error = res.message;
        }
        console.log('set error to', error);
        this.setState({
          comment_loaded: true,
          comment_error: error,
          comment_current_page: page,
        });
      })
      .then(() => {
        this.setState({ comment_loaded: true });
      });
  }

  goToCommentPage(num) {
    console.log('post with comment goes to page', num);
    this.fetchCommentList(num);
  }

  commentAdd(data) {
    console.log('post with comment received comment', data);
    const comment_list = this.state.comments;
    comment_list.unshift(data);
    // console.log(comment_list);
    this.setState({ comments: comment_list });
  }

  render() {
    const { slug } = this;
    const { comment_loaded, comment_error, comments } = this.state;

    const { classes } = this.props;

    const { location } = this.props;
    const back_page = (location.state && location.state.backPage) || 1;

    return (
      <React.Fragment>
        <Header at="post" />

        <div className='classes.headerContentSpace' />

        <div className='classes.pageWidthLimit'>

          <div className='classes.backButtonWrapper'>
            <Button className='classes.backButton' onClick={() => { this.props.history.push(`/post/page/${back_page}`); }}>
              <ChevronLeftSharpIcon />
              返回
            </Button>
          </div>

          <Paper>
            <Post
              slug={slug}
            />
          </Paper>

          <Divider className='classes.postCommentDivider' />

          <Paper className="classes.commentPaper">
            <CommentAdd
              api={`/api/post/${this.slug}/comment`}
              commentAdd={this.commentAdd.bind(this)}
            />
            <CommentList
              error={comment_error}
              loaded={comment_loaded}
              comment_list={comments}
            />
            <div className="classes.textRight">
              <Pagination
                total={this.state.comment_total_page}
                current={this.state.comment_current_page}
                pageUrl={undefined}
                auto_left
                goToPage={num => this.goToCommentPage(num)}
              />
            </div>
          </Paper>

          <Divider className="classes.postCommentDivider" />

        </div>
      </React.Fragment>
    );
  }
}


export default PostWithComment;
