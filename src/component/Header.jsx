import React, { Component } from 'react';

import {
    NavLink
} from 'react-router-dom';


class Header extends Component {
    render() {
        return (
            <header>
                <nav>
                    <ul>
                        <li><NavLink exact to="/">首页</NavLink></li>
                        <li><NavLink to="/post">文章</NavLink></li>
                        <li><NavLink to="/tie">简讯</NavLink></li>

                        <li><NavLink to="/tie/some-slug">测试：一条简讯</NavLink></li>

                    </ul>
                </nav>
            </header>
        )
    }
}


export default Header
