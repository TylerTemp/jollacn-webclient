import React from 'react';
import Box from '@mui/system/Box';

import Article from './article';
import Comment from './comment';

export default({slug}) => {

  return <Box sx={{width: '100%', display: 'flex', justifyContent: 'center'}}>
    <Box sx={{width: '100%', maxWidth: '1100px'}}>
      <Article slug={slug} />
      <Box sx={{height: '15px'}} />
      <Comment uri={`/api/post/${slug}/comment`} />
    </Box>
  </Box>;
}
