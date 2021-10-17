import React, { Component } from 'react';

// import { withStyles } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

import axios from 'axios';

import Header from '~/component/Header';
import PostListWithPagination from './PostListWithPagination';


// const styles = theme => ({
//   headerPostlistDivider: {
//     // 'border-color': '#eee',
//     height: 0,
//     border: 'none',
//     // 'border-top': '1px solid #eee',
//     'margin-top': '15px',
//     'margin-bottom': '15px',
//   },
//   pageWidthLimit: {
//     width: 'auto',
//     marginLeft: theme.spacing.unit * 3,
//     marginRight: theme.spacing.unit * 3,
//     [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
//       width: 1100,
//       marginLeft: 'auto',
//       marginRight: 'auto',
//     },
//   },
// });


class PostListWithHeaderPagination extends Component {
  render() {
    const { classes } = this.props;

    const page_str = this.props.match.params.page;
    const page = parseInt(page_str);

    return (
      <React.Fragment>
        <Header at="post" />

        <Divider className={classes.headerPostlistDivider} />

        <div className={classes.pageWidthLimit}>
          <PostListWithPagination
            page={page}
          />
        </div>
      </React.Fragment>
    );
  }
}


export default PostListWithHeaderPagination;
// export default withStyles(styles)(PostListWithHeaderPagination);
