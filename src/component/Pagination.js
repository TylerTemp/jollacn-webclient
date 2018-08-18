import React, { Component } from 'react';

import {
    Link
} from 'react-router-dom';


class Pagination extends Component {

  constructor(props) {
    super(props);
    this.state = {
      current: this.props.current, //当前页码
    }
  }

  goToPage(num) {
    console.log('pagination goes to page', num);
    // console.log(this.state);
    this.setState({current: num});
    // console.log(this.state);
    this.props.goToPage(num);  // parent call
  }

  render() {
    // console.log('on render props', this.props);
    let current = this.state.current;
    let total = this.props.total;

    let page_numbers = [];
    for(var page_number = 1; page_number <= total; page_number++)
    {
      page_numbers.push(page_number);
    };

    return (
      <section>
        {this.props.children}
        <p>current = { current }; total = { total } </p>
        {page_numbers.map((page_number) => {
          if(this.props.pageUrl) {
            return (
                <div key={ page_number }>
                <Link
                    to={ this.props.pageUrl(page_number) }
                    onClick={ (() => this.goToPage(page_number)).bind(this) }
                    >
                  { page_number }
                </Link>
              </div>
            );
          };
          return (
            <div key={ page_number }>
              <a href="#{ page_number }" onClick={ (() => this.goToPage(page_number)).bind(this) }>
                { page_number }
              </a>
            </div>
          );
        })}
      </section>
    );
  }
}


export default Pagination
