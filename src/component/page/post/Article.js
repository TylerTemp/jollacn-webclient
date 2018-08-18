import React, { Component } from 'react'
import {
    Route,
} from 'react-router-dom'

import axios from 'axios';

import Header from '../../Header'


class Article extends Component {

  constructor(props) {
    super(props);
    this.state = {
      slug: this.props.slug,
      loaded: false,
      error: null,
      article: {
        'title': null,
        'content': null,
        'author': null
      }
    };
  }

  componentDidMount() {
    this.fetchArticle(this.state.slug);
  }

  fetchArticle(slug) {
    this.setState({
      loaded: false,
      error: null,
      slug: slug,
    })
    axios.get(`/post/${slug}`, {transformResponse: undefined})
      .then(res => {
        var data = res.data;
        var article = JSON.parse(data);
        this.setState({error: null, article: article});
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
            error = resp.message;
        };
        console.log('set error to', error);
        this.setState({error: error});
      })
      .then(() => {
        console.log('always');
        this.setState({loaded: true});
      });
  }

  render() {
    const { slug } = this.state;
    if(this.props.slug != slug) {
      console.log(`article change slug from ${slug} to ${this.props.slug} when trying to render`)
      fetchArticle(this.props.slug);
    };

    const { error, loaded, article } = this.state;
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
          <p>loading...</p>
        </div>
      );
    };

    return (
      <article>
        <h1>{ article.title }</h1>
        { article.content }
      </article>
    );

  }
}


export default Article;
