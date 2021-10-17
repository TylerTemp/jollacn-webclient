import React from 'react';
// import { withStyles } from '@mui/material/styles';
// import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
// import Modal from '@mui/material/Modal';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
// import withMobileDialog from '@mui/material/withMobileDialog';
import Button from '@mui/material/Button';
import ChevronLeftSharpIcon from '@mui/icons-material/ChevronLeftSharp';
// import withWidth, { isWidthUp } from '@mui/material/withWidth';

// import TieWithComment from './TieWithComment';
// import { observer } from 'mobx-react';
// import { computed } from 'mobx';

import Pagination from '~/component/Pagination';
import CommentList from '~/component/CommentList';
import CommentAdd from '~/component/CommentAdd';
import commentListPaginationStore from '~/component/storage/CommentListPaginationStore';
import Tie from './Tie';


// const styles = theme => ({
//   modalContent: {
//     backgroundColor: theme.palette.background.paper,
//     padding: theme.spacing.unit,
//   },
//
//   [theme.breakpoints.up('sm')]: {
//     modalContent: {
//       // width: theme.spacing.unit * 50,
//       maxWidth: '1100px',
//       boxShadow: theme.shadows[5],
//       padding: theme.spacing.unit * 4,
//       margin: 'auto',
//     },
//   },
//
//   modal: {
//     // top: '85px',
//     // padding: '20px',
//   },
//
//   centerDiv: {
//     width: '100%',
//     'text-align': 'center',
//   },
//
//   pagination: {
//     display: 'inline-block',
//   },
//
//   divider: {
//     // 'height': 1,
//     // 'border': 'none',
//     // 'margin-left': '-20px',
//     // 'margin-right': '-20px',
//   },
// });
//
//
// @withStyles(styles)
// @observer
// @withWidth()
// @withMobileDialog()
class TieModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      open: true,
      // current_comment_page: 1,
      return_to: '/tie',
    };
    // console.log('inited');
  }

  componentDidMount() {
    // console.log('did mount');
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
    const state_return_to = this.state.return_to;
    const { return_to = state_return_to } = this.props.location.state;
    this.props.history.push(return_to);
  }

  // emptyFunction() {
  //   ;
  // }

  render() {
    const { classes } = this.props;

    // console.log('tie modal location state', this.props.location.state);

    return (
      <Dialog
        fullScreen={!isWidthUp('sm', this.props.width)}
        open={this.state.open}
        onClose={this.handleClose}
        maxWidth={false}
        className={classes.modal}
      >
        <React.Fragment>
          <div className={classes.modalContent}>
            <Button className={classes.button} variant="contained" color="default" onClick={(e) => { e.preventDefault(); this.handleClose(); }}>
              <ChevronLeftSharpIcon />
              返回
            </Button>
            <Tie
              id={this.props.match.params.id}
            />
            <Divider className={classes.divider} />
            <CommentList
              error={commentListPaginationStore.error}
              loaded={commentListPaginationStore.loaded}
              comment_list={commentListPaginationStore.comments}
            />

            <div className={classes.centerDiv}>
              <Paper className={classes.pagination}>
                <Pagination
                  total={commentListPaginationStore.total_page}
                  current={commentListPaginationStore.current_page}
                  pageUrl={undefined}
                  goToPage={(num) => { commentListPaginationStore.fetchCommentPage(num); }}
                />
              </Paper>
            </div>

            <CommentAdd
              api={`/api/tie/${this.props.match.params.id}/comment`}
              commentAdd={(comment) => { commentListPaginationStore.commentPush(comment); }}
            />
          </div>
        </React.Fragment>
      </Dialog>
    );
  }
}


export default TieModal;
