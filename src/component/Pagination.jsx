import React, { Component } from 'react';

import {
    Link
} from 'react-router-dom';

// import { observer } from 'mobx-react';

import { withStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import Button from '@material-ui/core/Button';
import grey from '@material-ui/core/colors/grey';


const styles = theme => ({
  disabledText: {
    color: grey[400],
  },
});


@withStyles(styles)
// @observer
class Pagination extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // current: this.props.current, //当前页码
      display_range: this.props.display_range || 5,
      auto_left: this.props.auto_left,
      auto_right: this.props.auto_right,
    };
    this.goToPage = this.goToPage.bind(this);
  }

  goToPage(num) {
    console.log('pagination goes to page', num);
    // console.log(this.state);
    // this.setState({current: num});
    // console.log(this.state);
    this.props.goToPage(num);  // parent call
  }

  renderPageNumber(page_number, current, page_display, this_disabled) {
    if(page_number == '...') {
      const { classes } = this.props;
      return <span className={ classes.disabledText }>...</span>;
    };

    if(this_disabled === undefined) {
      this_disabled = (page_number == current);
    };

    // console.log('render page', page_number, page_display);

    if(this.props.pageUrl) {
      return (
        <Link
            key={ page_display? undefined: page_number }
            className={ (page_number == current)? 'pagination active': 'pagination' }
            to={ this.props.pageUrl(page_number) }
            onClick={ this_disabled? (() => false) : (() => this.goToPage(page_number)).bind(this) }
            >
          <Button
            variant='text'
            size='small'
            mini={ true }
            disabled={ this_disabled }
            >{ page_display || page_number }</Button>
        </Link>
      );
    };



    return (
      <a
          key={ page_display? undefined: page_number }
          className={ (page_number == current)? 'pagination active': 'pagination' }
          href={ `#${ page_number }` }
          onClick={ (evt) => {
              evt.preventDefault();
              if(!this_disabled) {
                this.goToPage(page_number);
              };
            }
          }
        >
        <Button
            variant='text'
            size='small'
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
    // let current = this.state.current;
    let current = this.props.current;
    // alert(`paging, status_current = ${current}; props_current = ${this.props.current}`)
    let display_range = this.state.display_range;
    let total = this.props.total;

    let display_left_right = Math.trunc(display_range / 2);

    let page_numbers = [];
    let start_page_number = 1;
    let left_omit = false;
    if(current - 1 > display_left_right) {
      start_page_number = current - display_left_right;
      left_omit = true;
    };

    let end_page_num = current + display_left_right;
    let right_omit = true;
    if(end_page_num > total - 1) {
      end_page_num = total;
      right_omit = false;
    };

    for(var page_number = start_page_number; page_number <= end_page_num; page_number++)
    {
      page_numbers.push(page_number);
    };

    console.log('page numbers:', page_numbers);

    const {auto_left, auto_right} = this.state;

    return (
      <React.Fragment>
        { auto_left && current == 1 || this.renderPageNumber(1, current, <FirstPageIcon />, current == 1, '|<') }
        { auto_left && current == 1 || this.renderPageNumber(current == 1? 1: current - 1, current, <ChevronLeftIcon />, current == 1, '<') }

        { left_omit && '...' }

        {page_numbers.map((page_number) => {
          return this.renderPageNumber(page_number, current);
        })}

        { right_omit && '...' }

        { auto_right && current == total || this.renderPageNumber(current + 1, current, <ChevronRightIcon />, current == total, '>') }
        { auto_right && current == total || this.renderPageNumber(total, current, <LastPageIcon />, current == total, '>|') }

      </React.Fragment>
    );
  }
}


// export default Pagination;
export default (Pagination);
