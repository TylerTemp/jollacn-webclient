import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

import axios from 'axios';

import Header from '../../Header'
import Pagination from '../../Pagination'
import CommentList from '../../CommentList'
import CommentAdd from '../../CommentAdd'
import Post from './Post'


const styles = (theme) => ({
  pageWidthLimit: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  headerContentSpace: {
    'height': '20px',
  },
  postCommentDevider: {
    'border-color': '#eee',
    'height': 0,
    'border-top': '1px solid #eee',
    'margin-top': '15px',
    'margin-bottom': '15px',
  },

  commentPaper: {
    paddingTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
  },
  textRight: {
    'text-align': 'right',
  }
});


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

    let limit = this.limit;
    let offset = (page - 1) * limit;

    axios.get(
        `/api/post/${this.slug}/comment?offset=${offset}&limit=${limit}`,
        {
          headers: {'Accpected': 'application/json'},
          transformResponse: undefined
        }
      )
      .then(res => {
        let data = res.data;
        console.log(`comment for ${this.slug} result:`, data);
        let comments_result = JSON.parse(data);

        let total = comments_result.total;
        let page_mod = total % this.limit;
        let page_div = Math.trunc(total / this.limit);
        let total_page = page_div;
        if(page_div == 0) {
          total_page = 1;
        } else if (page_mod != 0) {
          total_page = page_div + 1;
        };

        this.setState({
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
    console.log('post with comment goes to page', num);
    this.fetchCommentList(num);
  }

  commentAdd(data) {
    console.log('post with comment received comment', data);
    let comment_list = this.state.comments;
    comment_list.unshift(data);
    // console.log(comment_list);
    this.setState({comments: comment_list});
  }

  render() {

    const slug = this.slug;
    const { comment_loaded, comment_error, comments } = this.state

    const { classes } = this.props;

    return (
      <div>
        <Header at="post"></Header>

        <div className={classes.headerContentSpace}></div>

        <div className={classes.pageWidthLimit}>

          <Paper>
            <Post
              slug={ slug }>
            </Post>
          </Paper>

          <Divider className={ classes.postCommentDevider }/>

          <Paper className={ classes.commentPaper} >
              <CommentAdd
                api={ `/api/post/${this.slug}/comment` }
                commentAdd={ this.commentAdd.bind(this) }>
              </CommentAdd>
              <CommentList
                error={ comment_error }
                loaded={ comment_loaded }
                comment_list={ comments }>
              </CommentList>
              <div className={ classes.textRight }>
                <Pagination
                    total={ this.state.comment_total_page }
                    current={ this.state.comment_current_page }
                    pageUrl={ undefined }
                    auto_left={ true }
                    goToPage={ (num) => this.goToCommentPage(num) }
                >
                </Pagination>
              </div>
          </Paper>

        </div>
      </div>
    );

  }
}


// export default PostWithComment;
export default withStyles(styles)(PostWithComment);
