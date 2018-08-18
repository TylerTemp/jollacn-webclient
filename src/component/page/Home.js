import React, { Component } from 'react'
import {
    Route,
    NavLink
} from 'react-router-dom'


import Header from '../Header'


class Home extends Component {
    render() {
        return(
          <div>
            <Header></Header>
            <div className="home">
                <h1 className="title">Welcome</h1>
            </div>
          </div>
        )
    }
}


export default Home
