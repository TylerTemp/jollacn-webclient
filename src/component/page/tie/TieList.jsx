import React, { Component } from 'react'
import {
    // Route,
    // NavLink,
    Link
} from 'react-router-dom'

import axios from 'axios';

import Header from '../../Header'
import { default as PostArticle } from './Tie'


class TieList extends Component {

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
                this.props.tie_list.map((item, index) => (
                  <li key={ item.slug }>
                    <Link to={`/tie/${ item.slug }`}>
                      { item.content }
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
