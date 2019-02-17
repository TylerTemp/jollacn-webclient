import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

import axios from 'axios';

import Pagination from '../../Pagination';
import PostPreview from './PostPreview';


const styles = theme => ({
  centerDiv: {
    width: '100%',
    'text-align': 'center',
  },
  pagination: {
    display: 'inline-block',
  },

  postListPaginationDivider: {
    border: 'none',
    height: 0,
    margin: '16px',
  },
});


class PostListWithPagination extends Component {
  constructor(props) {
    super(props);
    const props_match = this.props.match || {};
    const match_params = props_match.params || {};

    const page_str = match_params.page;
    const page = page_str ? parseInt(page_str) : (this.props.page || 1);
    // this.limit = 10;
    this.state = {
      limit: (this.props.limit == undefined ? 10 : this.props.limit),
      post_infos_loaded: false,
      page_loaded: false,
      error: null,
      current_page: page,
      total_page: 0,
      post_infos: [],
    };
  }

  componentDidMount() {
    const page = this.state.current_page;
    console.log('post list with pagination, did mount to page', page);
    this.fetchPostList(page);
  }

  fetchPostList(page = 1) {
    this.setState({ error: null, post_infos_loaded: false, current_page: page });
    // let page = this.state.current_page;
    console.log('fetching page list from page', page);
    const { limit } = this.state;
    const offset = (page - 1) * limit;
    axios.get(
      `/api/post?offset=${offset}&limit=${limit}`,
      {
        headers: { Accept: 'application/json' },
        transformResponse: undefined,
      },
    )
      .then((res) => {
        const { data } = res;
        const result = JSON.parse(data);
        console.log('fetched post list result', result);
        const total_count = result.total;
        const { post_infos } = result;
        const page_mod = total_count % result.limit;
        const page_div = Math.trunc(total_count / result.limit);
        let total_page = page_div;
        if (page_div == 0) {
          total_page = 1;
        } else if (page_mod != 0) {
          total_page = page_div + 1;
        }
        this.setState({
          limit: result.limit,
          post_infos_loaded: true,
          page_loaded: true,
          error: null,
          current_page: page,
          total_page,
          post_infos,
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
          post_infos_loaded: true,
          error,
        });
      })
      .then(() => {
        // console.log('always');
        this.setState({ post_infos_loaded: true });
      });
  }

  goToPage(num) {
    console.log('post list with pagination goes to page', num);
    this.fetchPostList(num);
    // this.setState({current_page: num});
  }

  renderPost(error, post_infos_loaded, post_infos, back_page) {
    if (error) {
      return error;
    }
    if (!post_infos_loaded) {
      return 'loading';
    }

    // console.log('rendering', post_infos);
    return post_infos.map((post_info, index) => (
      <Grid item key={index} sm={12} md={6}>
        <PostPreview
          slug={post_info.slug}
          cover={post_info.cover}
          title={post_info.title}
          description={post_info.description}
          backPage={back_page}
        />
      </Grid>));
  }

  render() {
    const { error, post_infos_loaded, post_infos } = this.state;

    console.log('post with pagination rendering', post_infos,
      ' is loaded: ', post_infos_loaded, ' error: ', error,
      'total_page:', this.state.total_page,
      'current_page:', this.state.current_page);

    const { classes } = this.props;

    return (
      <React.Fragment>
        <Grid container spacing={40}>
          { this.renderPost(error, post_infos_loaded, post_infos, this.state.current_page) }
        </Grid>

        <Divider className={classes.postListPaginationDivider} />

        <div className={classes.centerDiv}>
          <Paper className={classes.pagination}>
            <Pagination
              total={this.state.total_page}
              current={this.state.current_page}
              pageUrl={num => `/post/page/${num}`}
              goToPage={num => this.goToPage(num)}
            />
          </Paper>
        </div>

        <Divider className={classes.postListPaginationDivider} />
      </React.Fragment>
    );
  }
}


// export default PostListWithPagination;
export default withStyles(styles)(PostListWithPagination);
