import React, { Component } from 'react';
import ReactDom from 'react-dom';

import './css/index.css'

class App extends Component {
    render() {
        return <div className="container">
            Hi, css w/ hot reload !
          </div>
    }
}

ReactDom.render(
    <App />,
    document.getElementById('root')
)
