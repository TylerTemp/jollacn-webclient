import React, { Component } from 'react';

// import { withStyles } from '@mui/material/styles';
// import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import axios from 'axios';

import '~/css/post.css';

// const styles = {
// };
//
//
// @withStyles(styles)
class RedirectPostSlug extends Component {
  render() {
    const { post_slug } = this.props.match.params;
    this.props.history.push(`/post/${post_slug}`);
    return (
      <p>
redirecting to `/post/$
        {post_slug}
`
      </p>
    );
  }
}


// export default Post;
export default RedirectPostSlug;
