import React from 'react';
import { withStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ChevronLeftSharpIcon from '@material-ui/icons/ChevronLeftSharp';

// import TieWithComment from './TieWithComment';
import { observer } from 'mobx-react';
// import { computed } from 'mobx';

import Header from '../../Header';
import Pagination from '../../Pagination';
import CommentList from '../../CommentList';
import CommentAdd from '../../CommentAdd';
import commentListPaginationStore from '../../storage/CommentListPaginationStore';
import Tie from './Tie';


const styles = theme => ({

  centerDiv: {
    'width': '100%',
    'text-align': 'center',
  },

  commentDivider: {
    'height': 0,
    'padding': '10px',
    'border': 'none',
    'background-color': 'transparent',
    // 'margin-left': '-20px',
    // 'margin-right': '-20px',
  },

  pageWidthLimit: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },

  headerTieDivider: {
    // 'border-color': '#eee',
    'height': 0,
    'border': 'none',
    // 'border-top': '1px solid #eee',
    'margin-top': '15px',
    'margin-bottom': '15px',
  },

  tieBox: {
    'max-width': '900px',
    'margin-left': 'auto',
    'margin-right': 'auto',
    'padding': '15px 10px 20px 10px',
    // 'font-size': '1.3rem',
    // 'font-weight': '300',
  },

  commentBox: {
    'max-width': '900px',
    'margin-left': 'auto',
    'margin-right': 'auto',
    'padding': '20px 10px 20px 10px',
    // 'font-size': '1.3rem',
    // 'font-weight': '300',
  },

  pagination: {
    'display': 'inline-block',
  },

  textRight: {
    'text-align': 'right',
  }

});


@withStyles(styles)
@observer
class TiePage extends React.Component {

  componentDidMount() {
    console.log('did mount');
    const tie_id = this.props.match.params.id;
    // alert(`tie modal tie id = ${tie_id}`);
    commentListPaginationStore.setApi(`/api/tie/${tie_id}/comment`);
    commentListPaginationStore.fetchCommentPage(commentListPaginationStore.current_page);
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Header at="tie"></Header>

        <Divider className={classes.headerTieDivider}/>

        <div className={classes.pageWidthLimit}>
          <Paper>
            <div className={ classes.tieBox }>
              <div>
                <Button color="inherit" onClick={ (e) => {e.preventDefault(); this.props.history.push("/tie")} }>
                  <ChevronLeftSharpIcon />
                  返回
                </Button>
              </div>
              <Tie
                  id={ this.props.match.params.id }
                >
              </Tie>
            </div>
          </Paper>

          <Divider className={ classes.commentDivider } />

          <Paper>
            <div className={ classes.commentBox }>
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
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}


export default TiePage;
