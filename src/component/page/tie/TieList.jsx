import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
// import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';


const styles = theme => ({
  tieContent: {
    'font-size': '1.1rem',
  },
  muteLink: {
    'color': 'inherit',
    'text-decoration': 'inherit',
  }
});


@withStyles(styles)
class TieList extends Component {

    // constructor(props) {
    //   super(props);
    //   this.state = {
    //   }
    // }

    // TODO: video media?
    makeMediaPreview(previews) {
      // console.log('previews:', previews);

      const preview_length = previews.length;

      if(preview_length == 0) {
        return null;
      }

      if(preview_length == 1) {
        const tile = previews[0];
        return <GridList cellHeight={200} cols={1}>
          <GridListTile key={ tile.src }>
            <img src={ tile.src } />
          </GridListTile>
        </GridList>
      } else if(preview_length == 2) {
        <GridList cellHeight={200} cols={2} spacing={ 1 }>
          {
            previews.map(tile => (
              <GridListTile key={ tile.src }>
                <img src={ tile.src } />
              </GridListTile>))
          }
        </GridList>
      } else {
        const first_tile = previews[0];
        const rest_tile = previews.slice(1);
        return <GridList cellHeight={100} cols={rest_tile.length} spacing={ 1 }>
          <GridListTile key={ first_tile.src } cols={ rest_tile.length } rows={ 1 }>
            <img src={ first_tile.src } />
          </GridListTile>
          {
            rest_tile.map(tile => (
              <GridListTile key={ tile.src }>
                <img src={ tile.src } />
              </GridListTile>))
          }
        </GridList>
      };
    }

    render() {
      // console.log(this.props);

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
          <Grid container spacing={24}>
            {
              this.props.ties.map((tie, index) => (
                <React.Fragment key={ tie.id }>
                  <Grid item xs={ 12 / 2 } md={ 12 / 4 } lg={ 12 / 4 } >
                    <Card>
                      <CardActionArea>
                        <Link to={ `/tie/${tie.id}/mediaview` } className={ classes.muteLink }>
                          { this.makeMediaPreview(tie.media_previews) }
                        </Link>
                      </CardActionArea>
                      <CardActionArea>
                        <CardContent>
                          <Link className={ classes.muteLink } to={{
                                'pathname': `/tie/${tie.id}`,
                                'state': { modal: true, returnTo: this.props.location.pathname }
                              }}>
                            <div className={ classes.tieContent } dangerouslySetInnerHTML={{__html: tie.content}}>
                            </div>
                          </Link>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                </React.Fragment>
              ))
            }
          </Grid>
        </React.Fragment>
      );
    }
}


export default TieList;
