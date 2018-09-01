import React, { Component } from 'react';

import {
    Link
} from 'react-router-dom';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import Button from '@material-ui/core/Button';


class Pagination extends Component {

  constructor(props) {
    super(props);
    this.state = {
      current: this.props.current, //当前页码
      display_range: this.props.display_range || 5,
      auto_left: this.props.auto_left,
      auto_right: this.props.auto_right,
    }
  }

  goToPage(num) {
    console.log('pagination goes to page', num);
    // console.log(this.state);
    this.setState({current: num});
    // console.log(this.state);
    this.props.goToPage(num);  // parent call
  }

  renderPageNumber(page_number, current, page_display, this_disabled) {
    if(page_number == '...') {
      return '...';
    };
    if(this.props.pageUrl) {
      return (
        <span key={ page_number }>
          <Link
              to={ this.props.pageUrl(page_number) }
              onClick={ (() => this.goToPage(page_number)).bind(this) }
              >
            { page_number }
          </Link>
        </span>
      );
    };

    if(this_disabled === undefined) {
      this_disabled = (page_number == current);
    }

    return (
      <a
          className={ (page_number == current)? 'pagination active': 'pagination' }
          href={ `#${ page_number }` }
          onClick={ !this_disabled && (() => this.goToPage(page_number)).bind(this) }
        >
        <Button
            key={ page_number }
            variant='text'
            size='fab'
            mini={ true }
            disabled={ this_disabled }
          >
            { page_display || page_number }
        </Button>
      </a>
    );
  }

  render() {
    // console.log('on render props', this.props);
    let current = this.state.current;
    let display_range = this.state.display_range;
    let total = this.props.total;

    let display_left_right = Math.trunc(display_range / 2);

    let page_numbers = [];
    let start_page_number = 1;
    if(current - 1 > display_left_right) {
      start_page_number = current - display_left_right;
      page_numbers.push('...');
    };

    let end_page_num = current + display_left_right;
    let trans_end = true;
    if(end_page_num > total - 1) {
      end_page_num = total;
      trans_end = false;
    };


    for(var page_number = start_page_number; page_number <= end_page_num; page_number++)
    {
      page_numbers.push(page_number);
    };

    if(trans_end) {
      page_numbers.push('...');
    }

    const {auto_left, auto_right} = this.state;

    return (
      <React.Fragment>
        {this.props.children}
        { auto_left && current == 1 || this.renderPageNumber(1, current, <FirstPageIcon />, current == 1) }
        { auto_left && current == 1 || this.renderPageNumber(current == 1? 1: current - 1, current, <ChevronLeftIcon />, current == 1) }

        {page_numbers.map((page_number) => {
          return this.renderPageNumber(page_number, current);
        })}

        { auto_right && current == total || this.renderPageNumber(current + 1, current, <ChevronRightIcon />, current == total) }
        { auto_right && current == total || this.renderPageNumber(total, current, <LastPageIcon />, current == total) }

      </React.Fragment>
    );
  }
}


export default Pagination
