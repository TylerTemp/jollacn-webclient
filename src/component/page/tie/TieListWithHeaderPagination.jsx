import React, { Component } from 'react';
import {
    Route,
    Switch
} from 'react-router-dom';

import { observer } from 'mobx-react';
// import { computed } from 'mobx';
// import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

import tieListPaginationStore from '~/component/storage/TieListPaginationStore';
import Pagination from '~/component/Pagination';
import Header from '~/component/Header';
import TieList from './TieList';


const styles = theme => ({
  centerDiv: {
    'width': '100%',
    'text-align': 'center',
  },

  pagination: {
    'display': 'inline-block',
  },

  tieListPaginationDivider: {
    'border': 'none',
    'height': 0,
    'margin': '16px',
  },

  contentWrapper: {
    'padding': 12,
  },

});


@withStyles(styles)
@observer
class TieListWithHeaderPagination extends Component {

  constructor(props) {
    super(props);
    let page_str = this.props.match.params.page;
    let page = page_str? parseInt(page_str): 1;
    tieListPaginationStore.fetchTiesPage(page);
  }

  // @computed get total_page() {
  //   return tieListPaginationStore.total_page;
  // }
  //
  // @computed get current_page() {
  //   return tieListPaginationStore.current_page;
  // }

  render() {
    // let page_str = this.props.match.params.page;
    // let page = page_str? parseInt(page_str): 1;

    const { error, loaded, ties } = tieListPaginationStore;

    console.log('tie with pagination rendering', ties,
      ' is loaded: ', loaded, ' error: ', error,
      'total_page:', tieListPaginationStore.total_page,
      'current_page:', tieListPaginationStore.current_page
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

          <Divider className={ classes.tieListPaginationDivider }/>

          <div className={ classes.centerDiv }>
            <Paper className={ classes.pagination }>
              <Pagination
                  total={ tieListPaginationStore.total_page }
                  current={ tieListPaginationStore.current_page }
                  pageUrl={ (num) => `/tie/page/${num}` }
                  goToPage={ (num) => tieListPaginationStore.fetchTiesPage(num) }>
              </Pagination>
            </Paper>
          </div>
        </div>

      </React.Fragment>
    );
  }
}


export default TieListWithHeaderPagination;
