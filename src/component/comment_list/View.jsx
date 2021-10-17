import React, { Fragment } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
// import parse from 'html-react-parser';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import Pagination from '~/component/pagination';


const CommentList = ({commentList}) => {
  if(commentList.length === 0) {
    return <Typography variant="body2" paragraph display="flex" justifyContent="center" padding="30px 0 0 0">
      -- 暂无评论 --
    </Typography>
  }

  return <List sx={{ width: '100%'}}>
    {commentList.map(({id, nickname, avatar, content, updated_at: updatedAt}) => <Fragment key={id}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={nickname} src={`/api/${avatar}`} />
        </ListItemAvatar>
        <ListItemText
          primary={nickname}
          secondary={<>
              <Typography
                sx={{ display: 'inline'}}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {content}
              </Typography>

              {updatedAt && <span style={{paddingLeft: '10px'}}> [{updatedAt}]</span>}
            </>}
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </Fragment>)}
  </List>;
}


export default ({
  loading,
  error,
  offset,
  limit,
  total,
  comments,
  fetchComments
}) => {
  return <>
    <CommentList commentList={comments} />
    {loading && <Box sx={{ display: 'flex', justifyContent: 'center'}}>
      <CircularProgress />
    </Box>}
    {error && <Alert severity="error">{error}</Alert>}
    <Pagination offset={offset} limit={limit} total={total} onChange={fetchComments} />
  </>;
}
