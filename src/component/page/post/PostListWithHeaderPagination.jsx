import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

import axios from 'axios';

import Header from '../../Header'
import PostListWithPagination from './PostListWithPagination';


const styles = (theme) => ({
  headerPostlistDivider: {
    // 'border-color': '#eee',
    'height': 0,
    'border': 'none',
    // 'border-top': '1px solid #eee',
    'margin-top': '15px',
    'margin-bottom': '15px',
  },
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
});


class PostListWithHeaderPagination extends Component {

  render() {

    const { classes } = this.props;

    let page_str = this.props.match.params.page;
    let page = parseInt(page_str);

    return (
      <React.Fragment>
        <Header at="post"></Header>

        <Divider className={classes.headerPostlistDivider}/>

        <div className={classes.pageWidthLimit}>
          <PostListWithPagination
              page={ page }
            ></PostListWithPagination>
        </div>
      </React.Fragment>
    );
  }
}


// export default PostListWithHeaderPagination;
export default withStyles(styles)(PostListWithHeaderPagination);
