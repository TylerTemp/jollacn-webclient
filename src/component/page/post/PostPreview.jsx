import React, { Component } from 'react'
import {
    Link
} from 'react-router-dom'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import axios from 'axios';


const styles = {
  card: {
    // maxWidth: 345,
  },
  media: {
    // height: 140,
  },
};


class PostPreview extends Component {

    constructor(props) {
      super(props);
      this.state = {
      }
    }

    render() {

      const { classes } = this.props;

      const { slug, cover, title, description} = this.props;

      return (
        <Card className={ classes.card }>
          <Link to={ `/post/${slug}` }>
            <CardMedia
              component='img'
              className={ classes.media }
              image={ cover }
              title={ title }
            />
          </Link>
          <CardContent>
            <Link to={ `/post/${slug}` }>
              <Typography gutterBottom variant="headline" component="h2">
                { title }
              </Typography>
            </Link>
            <Typography component="p" dangerouslySetInnerHTML={{__html: description}}>
            </Typography>
          </CardContent>
          <CardActions>
            <Link to={ `/post/${slug}` }>
              <Button size="small" color="primary">
                阅读 &gt;&gt;
              </Button>
            </Link>
          </CardActions>
        </Card>
      );
    }
}


export default withStyles(styles)(PostPreview);
// export default PostList;
