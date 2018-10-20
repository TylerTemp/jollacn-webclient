import React, { Component } from 'react';
import {
    Route,
    Switch
} from 'react-router-dom';

// import { observer } from 'mobx-react';
// import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import tieListCache from '../../storage/TieListCache';
// import { TieStore } from '../../store/TieStore';
import Pagination from '../../Pagination';
import Header from '../../Header';
import TieList from './TieList';


const styles = theme => ({
  centerDiv: {
    'width': '100%',
    'text-align': 'center',
  },

  pagination: {
    'display': 'inline-block',
  },

  postListPaginationDivider: {
    'border': 'none',
    'height': 0,
    'margin': '16px',
  },

});


// @observer
@withStyles(styles)
class TieListWithHeaderPagination extends Component {

  constructor(props) {
    super(props);
    let page_str = this.props.match.params.page;
    let page = page_str? parseInt(page_str): 1;
    // this.limit = 50;
    this.state = {
      current_page: page,
      total_page: page,
      limit: 50,
      loaded: true,
      error: null,
      ties: []
    }
  }

  componentDidMount() {
    let page = this.state.current_page;
    console.log('tie list with pagination, did mount to page', page);
    this.fetchTiesPage(page);
  }

  fetchTiesPage(page = 1) {
    this.setState({error: null, loaded: false, current_page: page});
    console.log('fetching ties from page', page);
    const limit = this.state.limit;
    const offset = (page - 1) * limit;
    const promise = new Promise((resolve, reject) => {
      return tieListCache.fetchTieList(offset, limit, resolve, reject);
    });
    promise
      .then(
        (api_result) => {  // succeed
          const { total, limit, ties } = api_result;

          const page_mod = total % limit;
          const page_div = Math.trunc(total / limit);
          let total_page = page_div;
          if(page_div == 0) {
            total_page = 1;
          } else if (page_mod != 0) {
            total_page = page_div + 1;
          };

          this.setState({
            'loaded': true,
            'error': null,
            'ties': ties,
            'limit': limit,
            'current_page': page,
            'total_page': total_page,
          });
        },
        (error_msg) => {  // failed
          this.setState({
            'loaded': true,
            'error': error_msg,
          });
        }
      )
      .catch(
        (error) => {
          console.log(error);
          this.setState({'loaded': true, 'error': 'Unknown Error'});
        }
      );
  }

  goToPage(num) {
    console.log('post list with pagination goes to page', num);
    this.fetchTiesPage(num);
    // this.setState({current_page: num});
  }

  render() {
    const { error, loaded, ties } = this.state;

    console.log('tie with pagination rendering', ties,
      ' is loaded: ', loaded, ' error: ', error,
      'total_page:', this.state.total_page,
      'current_page:', this.state.current_page
    );

    const { classes } = this.props;

    return (
      <React.Fragment>

        <Header at="tie"></Header>

        <div className={ classes.contentWrapper }>
          <TieList
              ties={ ties }
              loaded={ loaded }
              error={ error }
              location={ this.props.location }
            >
          </TieList>

          <div className={ classes.centerDiv }>
            <Paper className={ classes.pagination }>
              <Pagination
                  total={ this.state.total_page }
                  current={ this.state.current_page }
                  pageUrl={ (num) => `/tie/page/${num}` }
                  goToPage={ (num) => this.goToPage(num) }>
              </Pagination>
            </Paper>
          </div>
        </div>

      </React.Fragment>
    );
  }
}


export default TieListWithHeaderPagination;
