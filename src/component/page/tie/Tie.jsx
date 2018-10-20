import React, { Component } from 'react'

import Paper from '@material-ui/core/Paper';
// import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';

import tieListCache from '../../storage/TieListCache';


const styles = (theme) => ({
  // pageWidthLimit: {
  //   width: 'auto',
  //   marginLeft: theme.spacing.unit * 3,
  //   marginRight: theme.spacing.unit * 3,
  //   [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
  //     width: 1100,
  //     marginLeft: 'auto',
  //     marginRight: 'auto',
  //   },
  // },
  tieContent: {
    fontSize: '1.5rem',
  },
});


@withStyles(styles)
class Tie extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id || parseInt(this.props.match.params.id),
      loaded: this.props.loaded === undefined? false: this.props.loaded,
      error: this.props.error === undefined? null: this.props.error,
      tie: this.props.tie === undefined? {
          'content': null
        }: this.props.tie
    };
  }

  componentDidMount() {
    this.fetchTie(this.state.id);
  }

  fetchTie(id) {

    const promise = new Promise((resolve, reject) => {
      return tieListCache.fetchTie(id, resolve, reject);
    });

    this.setState({
      loaded: false,
      error: null,
      id: id,
    });

    promise.then(
      (tie) => {
        this.setState({loaded: true, error: null, tie: tie});
      },
      (error_msg) => {
        this.setState({loaded: true, error: error_msg});
      }
    );
  }

  render() {
    const { id, error, loaded } = this.state;
    const tie = this.props.tie || this.state.tie;
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
          <p>tie loading...</p>
        </div>
      );
    };

    return (
      <div className={ classes.tieContent } dangerouslySetInnerHTML={{__html: tie.content}}>
      </div>
    );

  }
}


export default Tie;
