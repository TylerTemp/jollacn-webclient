import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';


class TieList extends Component {

    // constructor(props) {
    //   super(props);
    //   this.state = {
    //   }
    // }

    render() {
      // console.log(this.props);
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
                  <Grid item xs={ 12 / 2} md={ 12 / 4 } lg={ 12 / 4 } >
                    <Paper>
                      <div dangerouslySetInnerHTML={{__html: tie.content}}></div>
                      <Link to={ `/tie/${ tie.id }` }>展开...
                      </Link>
                    </Paper>
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
