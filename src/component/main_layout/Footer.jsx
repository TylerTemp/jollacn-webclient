import React from 'react';
import Box from '@mui/system/Box';
import Typography from '@mui/material/Typography';

import Divider from '@mui/material/Divider';
import RssFeedIcon from '@mui/icons-material/RssFeed';

export default () => (
  <footer>
    <Box sx={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'baseline',
      width: '100%', 
      color: 'white', 
      padding: '30px 0',
    }}
    >
      <Typography variant="body2" gutterBottom>
        <a href="https://beian.miit.gov.cn/" target="_blank" style={{ textDecoration: 'inherit', color: 'inherit' }} rel="noreferrer">京ICP备18007798号</a>
      </Typography>
      <Divider orientation="vertical" sx={{ margin: '0px 5px' }} />
      <Typography variant="body2" gutterBottom>
        &copy; TylerTemp/
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" style={{ textDecoration: 'inherit', color: 'inherit' }} rel="noreferrer">CC-BY-SA 4.0</a>
      </Typography>

      <Divider orientation="vertical" sx={{ margin: '0px 5px' }} />

      <Typography variant="body2" gutterBottom>
        <a href="/rss.xml" target="_blank" style={{ textDecoration: 'inherit', color: 'inherit' }} rel="noreferrer">
          <RssFeedIcon />
        </a>
      </Typography>
    </Box>
  </footer>
);
