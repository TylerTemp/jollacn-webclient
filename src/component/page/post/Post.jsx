import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import axios from 'axios';

import '../../../css/post.css';

const styles = {
  // paper: {
  //   'width': '100%',
  // },
  postBox: {
    'max-width': '900px',
    'margin-left': 'auto',
    'margin-right': 'auto',
    'padding': '50px 10px 30px 10px',
    'font-size': '1.3rem',
    'font-weight': '300',
  },
  postHeaderImg: {
    'width': '100%',
  },
  postTitle: {
    'font-size': '2.8rem',
    'line-height': '1.15',
    'font-weight': '400',
    'padding-bottom': '30px',
  },
  postMetaBodyDivider: {
    'border-color': '#eee',
    'height': 0,
    'border-top': '1px solid #eee',
  },
  postDescription: {
    'color': '#666',
    // 'font-size': '1.4rem',
    // 'line-height': '1',
    'border': '1px solid #dedede',
    'border-radius': '2px',
    'background': '#f9f9f9',
    'padding': '0 10px 0 10px',
  },
  // media: {
  //   // ⚠️ object-fit is not supported by IE11.
  //   objectFit: 'cover',
  // },
};


class Post extends Component {

  constructor(props) {
    super(props);
    this.state = {
      slug: this.props.slug,
      loaded: false,
      error: null,
      post: {
        'title': null,
        'content': null,
        'author': null
      }
    };
  }

  componentDidMount() {
    this.fetchPost(this.state.slug);
  }

  fetchPost(slug) {
    this.setState({
      loaded: false,
      error: null,
      slug: slug,
    })
    axios.get(`/api/post/${slug}`, {transformResponse: undefined})
      .then(res => {
        var data = res.data;
        var post = JSON.parse(data);
        this.setState({error: null, post: post});
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
              error = 'server error and unable to parse error response';
            };
            if(json_resp) {
              error = json_resp.message || 'unknown server error';
            };
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', res);
            error = res.message;;
        };
        console.log('set error to', error);
        this.setState({error: error});
      })
      .then(() => {
        console.log('always');
        this.setState({loaded: true});
      });
  }

  render() {
    const { slug, error, post } = this.state;
    let loaded = this.state.loaded;

    if(this.props.slug != slug) {
      console.log(`post change slug from ${slug} to ${this.props.slug} when trying to render`)
      loaded = false;
      fetchPost(this.props.slug);
    };

    const { classes } = this.props;

    if (error) {
      return (
        <div>
            <p>ERROR: { error }</p>
        </div>
      );
    };

    if (!loaded) {
      return (
        <div>
          <p>loading...</p>
        </div>
      );
    };

    return (
      <article className="post">
        <div>
          <img src={post.headerimg} className={classes.postHeaderImg}/>
        </div>
        <div className={classes.postBox}>
          <Typography gutterBottom variant="title" component="h1" align="center" className={classes.postTitle}>
            {post.title}
          </Typography>
          <hr className={classes.postMetaBodyDivider} />
          {
            post.description && (
              <div className={classes.postDescription} dangerouslySetInnerHTML={{__html: post.description}}></div>
            )
          }
          <div dangerouslySetInnerHTML={{__html: post.content}}>
          </div>
        </div>
      </article>
    );

  }
}


// export default Post;
export default withStyles(styles)(Post);
