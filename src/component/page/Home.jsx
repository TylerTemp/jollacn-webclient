import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

import Header from '../Header'


class Home extends Component {

  render() {
    return (
      <div>
        <Header></Header>
        <div className="home">
            <h1 className="title">Welcome, { React.version }</h1>
            <Button variant="contained" color="primary">
              Hello World
            </Button>
        </div>
      </div>
    );
  }
}


export default Home
