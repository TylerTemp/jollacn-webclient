import React, { Component } from 'react'
// import {
//     Route,
//     NavLink
// } from 'react-router-dom'

import axios from 'axios';

import Pagination from '../../Pagination'
import TieList from './TieList'


class TieListWithPagination extends Component {

  constructor(props) {
    super(props);
    let page_str = this.props.match.params.page;
    let page = page_str? parseInt(page_str): 1;
    // this.limit = 10;
    this.state = {
      limit: 50,
      ties_loaded: false,
      page_loaded: false,
      error: null,
      current_page: page,
      total_page: 0,
      ties: []
    }
  }

  componentDidMount() {
    let page = this.state.current_page;
    console.log('tie list with pagination, did mount to page', page)
    this.fetchTies(page);
  }

  fetchTies(page = 1) {
    this.setState({error: null, ties_loaded: false, current_page: page});
    console.log('fetching ties from page', page);
    let limit = this.state.limit;
    let offset = (page - 1) * limit;
    axios.get(
        `/api/tie?offset=${offset}&limit=${limit}`,
        {
          headers: {'Accpected': 'application/json'},
          transformResponse: undefined
        }
      )
      .then(res => {
        var data = res.data;
        var result = JSON.parse(data);
        console.log('fetched ties result', result);
        var total_count = result.total;
        var ties = result.ties;
        var page_mod = total_count % result.limit;
        var page_div = Math.trunc(total_count / result.limit);
        var total_page = page_div;
        if(page_div == 0) {
          total_page = 1;
        } else if (page_mod != 0) {
          total_page = page_div + 1;
        };
        this.setState({
          limit: result.limit,
          ties_loaded: true,
          page_loaded: true,
          error: null,
          current_page: page,
          total_page: total_page,
          ties: ties
        });
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
            error = res.message;
        };
        console.log('set error to', error);
        this.setState({
          post_infos_loaded: true,
          error: error,
        });
      })
      .then(() => {
        // console.log('always');
        this.setState({post_infos_loaded: true});
      });
  }

  goToPage(num) {
    console.log('post list with pagination goes to page', num);
    this.fetchTies(num);
    // this.setState({current_page: num});
  }

  render() {
    const { error, ties_loaded, ties } = this.state;

    console.log('tie with pagination rendering', ties,
      ' is loaded: ', ties_loaded, ' error: ', error,
      'total_page:', this.state.total_page,
      'current_page:', this.state.current_page
    );

    return (
      <div>
        <TieList
            ties={ ties }
            loaded={ ties_loaded }
            error={ error }>
        </TieList>

        <Pagination
            total={ this.state.total_page }
            current={ this.state.current_page }
            pageUrl={ (num) => `/tie/page/${num}` }
            goToPage={ (num) => this.goToPage(num) }>
        </Pagination>
      </div>
    );
  }
}


export default TieListWithPagination;
