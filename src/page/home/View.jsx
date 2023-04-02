import React from 'react';
import {
  Link,
} from 'react-router-dom';
import Box from '@mui/system/Box';
import Fab from '@mui/material/Fab';
import ReadMoreIcon from '@mui/icons-material/ReadMore';

import PostList from '~/component/post_list';
import TieList from '~/component/tie_list';

export default () => (
  <>
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Box sx={{
        width: '100%', maxWidth: '1100px', margin: '0 20px', position: 'relative',
      }}
      >
        <TieList offset={0} limit={3} itemXs={12 / 1} itemMd={12 / 3} itemLg={12 / 3} page={null} />
        <Box sx={{ position: 'absolute', bottom: 0, right: 0 }}>
          <Link to="/tie">
            <Fab color="primary" aria-label="add">
              <ReadMoreIcon />
            </Fab>
          </Link>
        </Box>
      </Box>
    </Box>

    <Box height={30} />

    <PostList page={1}/>
  </>
);
