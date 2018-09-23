import React, { Component } from 'react'

import Paper from '@material-ui/core/Paper';
// import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';


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
});


class Tie extends Component {

  constructor(props) {
    super(props);
    this.state = {
      slug: this.props.slug || this.props.match.params.slug,
      loaded: this.props.loaded === undefined? false: this.props.loaded,
      error: this.props.error === undefined? null: this.props.error,
      tie: this.props.tie === undefined? {
          'content': null
        }: this.props.tie
    };
  }

  componentDidMount() {
    this.fetchTie(this.state.slug);
  }

  fetchTie(slug) {
    this.setState({
      loaded: false,
      error: null,
      slug: slug,
    });
    axios.get(`/api/tie/${slug}`, {transformResponse: undefined})
      .then(res => {
        var data = res.data;
        var tie = JSON.parse(data);
        this.setState({error: null, tie: tie});
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
            // console.log(res.response);
            error = `${res.response.status} ${res.response.statusText}`;
          };
          if(json_resp) {
            error = json_resp.message || error;
          };
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', res);
          error = resp.message;
        };
        console.log('set error to', error);
        this.setState({error: error});
      })
      .then(() => {
        // console.log('always');
        this.setState({loaded: true});
      });
  }

  render() {
    const { slug, error } = this.state;
    const tie = this.props.tie || this.state.tie;
    let loaded = this.state.loaded;
    const check_slug = this.props.slug || this.props.match.params.slug;

    if(check_slug != slug) {
      console.log(`tie change slug from ${slug} to ${this.props.slug} when trying to render`)
      loaded = false;
      fetchTie(check_slug);
    };

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
      <Paper>
        { tie.content }
      </Paper>
    );

  }
}


export default withStyles(styles)(Tie);
