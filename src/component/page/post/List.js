import React, { Component } from 'react'
import {
    Route,
    NavLink,
    Link
} from 'react-router-dom'

import axios from 'axios';

import Header from '../../Header'
import { default as PostArticle } from './Article'


class List extends Component {

    constructor(props) {
      super(props);
      this.state = {
      }
    }

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
        <div>
          <div>
            <ol>
              {
                this.props.article_infos.map((item, index) => (
                  <li key={ item.slug }>
                    <Link to={`/post/${ item.slug }`}>
                      { item.title }
                    </Link>
                  </li>
                ))
              }
            </ol>
          </div>
        </div>
      );
    }
}


export default List;
