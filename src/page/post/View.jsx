import React from 'react';
import {
  Link,
} from 'react-router-dom';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import Comment from '~/component/comment';

import Article from './article';

export default ({ slug, page }) => (
  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <Box sx={{ width: '100%', maxWidth: '1100px' }}>
      <Box sx={{ padding: '15px 5px' }}>
        <Link to={page === 1 ? '/post' : `/post/page/${page}`}>
          <Button variant="contained" color="info" startIcon={<ArrowBackIosIcon />}>
            返回
          </Button>
        </Link>
      </Box>
      <Article slug={slug} page={page} />
      <Box sx={{ height: '15px' }} />
      <Comment uri={`/api/post/${slug}/comment`} />
    </Box>
  </Box>
);
