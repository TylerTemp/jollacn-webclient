import React, { Component } from 'react';
import {
  Link,
} from 'react-router-dom';

// import { withStyles } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import axios from 'axios';


// const styles = {
//   card: {
//     // maxWidth: 345,
//   },
//   media: {
//     // height: 140,
//   },
//   muteLink: {
//     color: 'inherit',
//     'text-decoration': 'inherit',
//   },
// };
//
//
// @withStyles(styles)
class PostPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { classes } = this.props;

    const {
      slug, cover, title, description,
    } = this.props;

    const { backPage = 1 } = this.props;
    // console.log(`preview backpage = ${backPage}; props.backPage=${this.props.backPage}`)

    return (
      <Card className={classes.card}>
        { cover && (
          <Link
            to={{
              pathname: `/post/${slug}`,
              state: { backPage },
            }}
            className={classes.muteLink}
          >
            <CardMedia
              component="img"
              className={classes.media}
              image={cover}
              title={title}
            />
          </Link>
        )}
        <CardContent>
          <Link
            to={{
              pathname: `/post/${slug}`,
              state: { backPage },
            }}
            className={classes.muteLink}
          >
            <Typography gutterBottom variant="headline" component="h2">
              { title }
            </Typography>
          </Link>
          <Typography component="div" dangerouslySetInnerHTML={{ __html: description }} />
        </CardContent>
        <Link
          to={{
            pathname: `/post/${slug}`,
            state: { backPage },
          }}
          className={classes.muteLink}
        >
          <CardActions>
            <Button size="small" color="primary">
                  阅读 &gt;&gt;
            </Button>
          </CardActions>
        </Link>
      </Card>
    );
  }
}


export default PostPreview;
// export default PostList;
