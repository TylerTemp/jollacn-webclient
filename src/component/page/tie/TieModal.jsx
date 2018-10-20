import React from 'react';
import { withStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
// import Modal from '@material-ui/core/Modal';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';

// import TieWithComment from './TieWithComment';
import { observer } from 'mobx-react';
// import { computed } from 'mobx';

import Pagination from '../../Pagination';
import CommentList from '../../CommentList';
import CommentAdd from '../../CommentAdd';
import commentListPaginationStore from '../../storage/CommentListPaginationStore';
import Tie from './Tie';


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
    // top: '85px',
    // padding: '20px',
  },

  centerDiv: {
    'width': '100%',
    'text-align': 'center',
  },

  pagination: {
    'display': 'inline-block',
  },

  divider: {
    // 'height': 1,
    // 'border': 'none',
    'margin-left': '-20px',
    'margin-right': '-20px',
  },
});


@withStyles(styles)
@observer
class TieModal extends React.Component {

  constructor(props) {
    super(props);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      open: true,
      // current_comment_page: 1,
    }
    console.log('inited');
  }

  componentDidMount() {
    console.log('did mount');
    const tie_id = this.props.match.params.id;
    // alert(`tie modal tie id = ${tie_id}`);
    commentListPaginationStore.setApi(`/api/tie/${tie_id}/comment`);
    commentListPaginationStore.fetchCommentPage(commentListPaginationStore.current_page);
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
    const { classes } = this.props;

    // TODO: better solution?

    // const comments = commentListPaginationStore.comments.map((comment, _index) => (comment));

    return (
      <Dialog
        open={ this.state.open }
        onClose={ this.handleClose }
        maxWidth={ false }
        className={ classes.modal }
      >
        <React.Fragment>
          <div className={ classes.modalContent }>
            <Tie
                id={ this.props.match.params.id }
              >
            </Tie>
            <Divider className={ classes.divider } />
            <CommentList
                error={ commentListPaginationStore.error }
                loaded={ commentListPaginationStore.loaded }
                comment_list={ commentListPaginationStore.comments }
              >
            </CommentList>

            <div className={ classes.centerDiv }>
              <Paper className={ classes.pagination }>
                <Pagination
                  total={ commentListPaginationStore.total_page }
                  current={ commentListPaginationStore.current_page }
                  pageUrl={ undefined }
                  goToPage={ (num) => { commentListPaginationStore.fetchCommentPage(num); } }>
                </Pagination>
              </Paper>
            </div>

            <CommentAdd
              api={ `/api/tie/${ this.props.match.params.id }/comment` }
              commentAdd={ (comment) => { commentListPaginationStore.commentPush(comment) } }>
            </CommentAdd>
          </div>
        </React.Fragment>
      </Dialog>
    );
  }
}


export default TieModal;
