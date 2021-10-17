import React from 'react';
import Box from '@mui/system/Box';
import Typography from '@mui/material/Typography';

import Divider from '@mui/material/Divider';


export default () => <footer>
  <Box sx={{display: 'flex', justifyContent: 'center', width: '100%', color: 'white'}}>
    <Typography variant="body2" gutterBottom>
      <a href="https://beian.miit.gov.cn/" target="_blank" style={{textDecoration: 'none', color: 'white'}}>京ICP备18007798号</a>
    </Typography>
      <Divider orientation="vertical" sx={{margin: '0px 5px'}}/>
    <Typography variant="body2" gutterBottom>
      &copy; CC-BY-SA 4.0
    </Typography>
  </Box>
</footer>;
