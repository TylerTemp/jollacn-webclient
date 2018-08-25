import React, { Component } from 'react'
import {
    Link
} from 'react-router-dom'

import axios from 'axios';

import Header from '../../Header'
import Tie from './Tie'


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
          <ol>
            {
              this.props.ties.map((item, index) => (
                <li key={ item.slug }>
                  <Tie
                      slug={ item.slug }
                      loaded={ true }
                      error={ null }
                      tie={ item }>
                  </Tie>
                  <Link to={ `/tie/${ item.slug }` }>...
                  </Link>
                </li>
              ))
            }
          </ol>
        </div>
      );
    }
}


export default TieList;
