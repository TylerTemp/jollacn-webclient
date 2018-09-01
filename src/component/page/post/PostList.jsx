import React, { Component } from 'react'
import {
    // Route,
    // NavLink,
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

import axios from 'axios';


const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
};


class PostList extends Component {

    constructor(props) {
      super(props);
      this.state = {
      }
    }

    render() {

      const { classes } = this.props;

      if (this.props.error) {
        return (
          <div>
              <p>ERROR: { this.props.error }</p>
          </div>
        )
      };
      if (!this.props.loaded) {
        return (
          <div>
            <p>loading...</p>
          </div>
        )
      };
      return (
        <React.Fragment>
        {this.props.post_infos.map((item, index) => (
          <Card className={classes.card}>
              <Link to={ `/post/${item.slug}` }>
                <CardMedia
                  className={classes.media}
                  image={ item.cover }
                  title={ item.title }
                />
              </Link>
              <CardContent>
                <Link to={ `/post/${item.slug}` }>
                  <Typography gutterBottom variant="headline" component="h2">
                    { item.title }
                  </Typography>
                </Link>
                <Typography component="p" dangerouslySetInnerHTML={{__html: item.description}}>
                </Typography>
              </CardContent>
            <CardActions>
              <Link to={ `/post/${item.slug}` }>
                <Button size="small" color="primary">
                  阅读 &gt;&gt;
                </Button>
              </Link>
            </CardActions>
          </Card>
        ))}

        </React.Fragment>
      );
    }
}


export default withStyles(styles)(PostList);
// export default PostList;


// <div>
//   <div>
//     <ol>
//       {
//         this.props.post_infos.map((item, index) => (
//           <li key={ item.slug }>
//             <Link to={`/post/${ item.slug }`}>
//               { item.title }
//             </Link>
//           </li>
//         ))
//       }
//     </ol>
//   </div>
// </div>
