import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';

import TieWithComment from './TieWithComment';


const styles = theme => ({
  modalContent: {
    // width: theme.spacing.unit * 50,
    maxWidth: '1100px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    margin:'auto',
  },

  modal: {
    top: '85px',
  },

});


@withStyles(styles)
class TieModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      open: true
    }
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
    const closeCallback = this.props.closeCallback || this.emptyFunction;
    closeCallback();
  }

  emptyFunction() {
    ;
  }

  render() {
    // console.log(`tie modal match`, this.props.match);
    // const { id } = this.props.match.params;
    const { classes } = this.props;

    return (
      <Modal
        open={ this.state.open }
        onClose={ this.handleClose }
        className={ classes.modal }
      >
        <div className={ classes.modalContent }>
          <TieWithComment match={ this.props.match } />
        </div>
      </Modal>
    );
  }
}


export default TieModal;
