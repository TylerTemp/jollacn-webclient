import React from 'react';
import Pagination from '~/component/pagination';
import Box from '@mui/system/Box';
import {
  Link,
} from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import styled from '@mui/system/styled';


const SLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit'
  // color: 'white',
});


const PostPreview = ({post: {cover, title, description, slug}}) => <Card sx={{width: '100%'}}>
  { cover && (
    <Link
      to={{
        pathname: `/post/${slug}`,
        state: { backPage: 1 },
      }}
    >
      <CardMedia
        component="img"
        image={cover}
        title={title}
      />
    </Link>
  )}
  <CardContent>
    <SLink
      to={{
        pathname: `/post/${slug}`,
        state: { backPage: 1 },
      }}
    >
      <Typography gutterBottom variant="h2">
        { title }
      </Typography>
    </SLink>
    <Typography component="div" dangerouslySetInnerHTML={{ __html: description }} />
  </CardContent>
  <Link
    to={{
      pathname: `/post/${slug}`,
      state: { backPage: 1 },
    }}
  >
    <CardActions>
      <Button size="small" color="primary">
            阅读 &gt;&gt;
      </Button>
    </CardActions>
  </Link>
</Card>;



export default ({
  loading,
  error,
  offset,
  limit,
  total,
  postList,
  fetchPostList
}) => <Box sx={{width: '100%', display: 'flex', justifyContent: 'center'}}>
  <Box sx={{width: '100%', maxWidth: '1100px'}}>
    <Grid container spacing={2}>
      {postList.map(each =>
        <Grid item key={each.slug} sm={12} md={6}>
          <PostPreview post={each} />
        </Grid>
      )}
    </Grid>
    <Box sx={{height: '15px'}} />
    {loading && <Box sx={{height: '100px', display: 'flex', justifyContent: 'center'}}>
      <CircularProgress color="secondary" />
    </Box>}
    {error && <Paper>
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={onRetry}>
            重试
          </Button>
        }
      >
        {error}
      </Alert>
    </Paper>}
    <Box sx={{display: 'flex', justifyContent: 'center'}}>
      <Paper>
        <Pagination offset={offset} limit={limit} total={total} onChange={fetchPostList} />
      </Paper>
    </Box>
  </Box>
</Box>;
