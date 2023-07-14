import React from 'react';
import {
  Link,
} from 'react-router-dom';
import Box from '@mui/system/Box';
import Card from '@mui/material/Card';
import { Routes, Route } from 'react-router-dom';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import styled from '@mui/system/styled';
import { type PostInfo } from "~/util/Types";

import Pagination from '~/component/pagination';
import Style from "./index.css";

const PostPreview = ({
  post: {
    cover, title, description, slug,
  }, page,
}: {post: PostInfo, page: number}) => (
<Link
    to={`/post/${slug}`}
    state={{ page }}
  >
  <Card sx={{ width: '100%' }}>
    { cover && (
    <>
      <CardMedia
        component="img"
        image={cover}
        title={title}
      />
    </>
    )}
    <CardContent>
      <Typography gutterBottom variant="h2">
        { title }
      </Typography>
      <Typography component="div" dangerouslySetInnerHTML={{ __html: description }} />
    </CardContent>
    <CardActions>
      <Button size="small" color="primary">
        阅读 &gt;&gt;
      </Button>
    </CardActions>
  </Card>
</Link>
);

interface Props {
  loading: boolean,
  error: string | null,
  offset: number,
  limit: number,
  total: number,
  postList: PostInfo[],
  fetchPostList: (offset: number) => void,
  onRetry: () => void,
  page: number,
}

export default ({
  loading,
  error,
  offset,
  limit,
  total,
  postList,
  fetchPostList,
  onRetry,
  page,
}: Props) => (
  <div className={Style.container}>
    <div className={Style.widthLimit}>

      <Grid container spacing={2}>
        {postList.map((each) => (
          <Grid item key={each.slug} sm={12} md={6}>
            <PostPreview post={each} page={page} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ height: '15px' }} />

      {loading && (
      <Box sx={{ height: '100px', display: 'flex', justifyContent: 'center' }}>
        <CircularProgress color="secondary" />
      </Box>
      )}

      {error && (
        <Paper>
          <Alert
            severity="error"
            action={(
              <Button color="inherit" size="small" onClick={onRetry}>
                重试
              </Button>
          )}
          >
            {error}
          </Alert>
        </Paper>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper>
          <Pagination offset={offset} limit={limit} total={total} onChange={fetchPostList} />
        </Paper>
      </Box>
      
    </div>
  </div>
);
