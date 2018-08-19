import React, { Component } from 'react'
import {
    Route,
    NavLink
} from 'react-router-dom'

import axios from 'axios';

import Pagination from '../../Pagination'
import {default as PostList} from './List'


class ArticleListWithPagination extends Component {

  constructor(props) {
    super(props);
    let page_str = this.props.match.params.page;
    let page = page_str? ParseInt(page_str): 1;
    // this.limit = 10;
    this.state = {
      limit: 10,
      article_infos_loaded: false,
      page_loaded: false,
      error: null,
      current_page: page,
      total_page: 0,
      article_infos: []
    }
  }

  componentDidMount() {
    let page = this.state.current_page;
    console.log('article list with pagination, did mount to page', page)
    this.fetchArticle(page);
  }

  fetchArticle(page = 1) {
    this.setState({error: null, article_infos_loaded: false, current_page: page});
    // let page = this.state.current_page;
    console.log('fetching page list from page', page);
    let limit = this.state.limit;
    let offset = (page - 1) * limit;
    axios.get(
        `/post?offset=${offset}&limit=${limit}`,
        {
          headers: {'Accpected': 'application/json'},
          transformResponse: undefined
        }
      )
      .then(res => {
        var data = res.data;
        var result = JSON.parse(data);
        console.log('fetched article list result', result);
        var total_count = result.total;
        var article_infos = result.article_infos;
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
          article_infos_loaded: true,
          page_loaded: true,
          error: null,
          current_page: page,
          total_page: total_page,
          article_infos: article_infos
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
              error = 'server error and unable to parse error response';
            };
            if(json_resp) {
              error = json_resp.message || 'unknown server error';
            };
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', res);
            error = res.message;
        };
        console.log('set error to', error);
        this.setState({
          article_infos_loaded: true,
          error: error,
        });
      })
      .then(() => {
        // console.log('always');
        this.setState({article_infos_loaded: true});
      });
  }

  goToPage(num) {
    console.log('article list with pagination goes to page', num);
    this.fetchArticle(num);
    // this.setState({current_page: num});
  }

  // getArticleInfos() {
  //   return {
  //     error: this.state.error,
  //     loaded: this.state.article_infos_loaded,
  //     article_infos: this.state.article_infos
  //   }
  // }

  render() {
    const { error, article_infos_loaded, article_infos } = this.state;
    // const total = 50;
    // const current = 17;
    // return <div>
    //
    //   <PostList
    //     article_infos={ article_infos }
    //     loaded={ article_infos_loaded }
    //     error={ error }>
    //   </PostList>
    //
    //   <Pagination
    //     total={ this.state.total_page }
    //     current={ this.state.current_page }
    //     pageUrl={ (num) => `/post/_page/${num}` }
    //     goToPage={ (num) => this.goToPage(num) }>
    //   </Pagination>
    //
    // </div>

    // console.log('rendering article infos in article with pagination', article_infos)
    console.log('article with pagination rendering', article_infos,
      ' is loaded: ', article_infos_loaded, ' error: ', error,
      'total_page:', this.state.total_page,
      'current_page:', this.state.current_page
    );
    return (
      <div>
      <PostList
          article_infos={ article_infos }
          loaded={ article_infos_loaded }
          error={ error }>
      </PostList>

      <Pagination
          total={ this.state.total_page }
          current={ this.state.current_page }
          pageUrl={ (num) => `/post/_page/${num}` }
          goToPage={ (num) => this.goToPage(num) }>
      </Pagination>
      </div>
    );
  }
}


export default ArticleListWithPagination;
