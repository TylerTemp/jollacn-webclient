import React, { Component } from 'react';


import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  fgov: {
    width: '100%',
    'text-align': 'center',
  },

  whiteLink: {
    color: 'white',
    'text-decoration': 'inherit',
  },
});


@withStyles(styles)
class Footer extends Component {
  render() {
    const { classes } = this.props;

    return (
      <footer>
        <div className={classes.fgov}>
          <a className={classes.whiteLink} href="http://www.miitbeian.gov.cn" target="_blank">京ICP备18007798号</a>
        </div>
        { this.props.children }
      </footer>
    );
  }
}


export default Footer;
