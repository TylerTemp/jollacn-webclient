import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
// import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';


import BlogHeaderImg from '../../images/blog_header.png';
import Header from '../Header'
import PostListWithPagination from './post/PostListWithPagination';
import tieListCache from '../storage/TieListCache';


const styles = (theme) => ({
  // Divider: {
  //   'height': 0,
  //   'border': 'none',
  //   'margin-top': '15px',
  //   'margin-bottom': '15px',
  // },
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
  headerImgWrapper: {
    'text-align': 'center',
    'padding-top': '40px',
    'padding-bottom': '25px',
  },
  miniTieWrapper: {
  },
  muteLink: {
    'color': 'inherit',
    'text-decoration': 'inherit',
  },
  tieMoreWrapper: {
    'text-align': 'right',
    'width': '100%',
    'margin-top': '-68px',
  }
});


@withStyles(styles)
class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      minitie_loaded: false,
      minitie_error: null,
      minities: []
    }
  }

  componentDidMount() {
    const promise = new Promise((resolve, reject) => {
      tieListCache.fetchTieList(0, 3, resolve, reject)
    });

    this.setState({
      minitie_loaded: false,
      minitie_error: null,
      minities: [],
    });

    promise
      .then(
        (api_result) => {  // succeed
          this.setState({
            minitie_loaded: true,
            minitie_error: null,
            minities: api_result['ties'],
          })
        },
        (error_msg) => {  // failed
          this.setState({
            minitie_loaded: true,
            minitie_error: error_msg,
            minities: [],
          })
        }
      )
      .catch(
        (error) => {
          console.log(error);
          this.setState({
            minitie_loaded: true,
            minitie_error: error,
            minities: [],
          })
        }
      );
  }

  render() {

    const { minitie_loaded, minitie_error, minities } = this.state;

    // console.log('minities=', minities);

    const { classes } = this.props;

    return (
      <div>

        <Header at="home">
          <div className={ classes.headerImgWrapper }>
            <Link to="/">
              <img src={ BlogHeaderImg } alt="Jolla非官方中文博客" />
            </Link>
          </div>
        </Header>

        <div className={classes.pageWidthLimit}>
          <div className={ classes.miniTieWrapper }>

            { !minitie_loaded && <p>loading...</p> }
            { minitie_error && <p>ERROR: { minitie_error }</p> }
            <Grid container spacing={ 40 }>
            {
              minitie_loaded && (!minitie_error) && minities.map((tie, _index) => (
                <Grid item key={ `tie-${tie.id}` } sm={ 12 / 1 } md={ 12 / 3 }>
                  <Link className={ classes.muteLink } to={{
                        'pathname': `/tie/${tie.id}`,
                        'state': { modal: true, modal_tie: true, return_to: this.props.location.pathname }
                      }}>
                    <Card>
                      <CardActionArea>
                        <CardContent>
                            <div className={ classes.tieContent } dangerouslySetInnerHTML={{__html: tie.content}}>
                            </div>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Link>
                </Grid>
              ))
            }
            <div className={ classes.tieMoreWrapper }>
              <Button variant="fab" color="default" className={ classes.tieMore } onClick={ () => { this.props.history.push('/tie') } }>
                <MoreHorizIcon />
              </Button>
            </div>

            </Grid>
          </div>
          <PostListWithPagination></PostListWithPagination>
        </div>
      </div>
    );
  }
}


// export default Home;
export default Home;
