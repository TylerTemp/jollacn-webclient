import React from 'react';
import Box from '@mui/system/Box';
import Paper from '@mui/material/Paper';

import Pagination from '~/component/pagination';
import TieList from '~/component/tie_list';

export default ({
  offset,
  limit,
  total,
  onOffsetChange,
  onTieListResult,

  page,
}) => (
  <>
    <Box sx={{ padding: '0 25px' }}>
      <TieList
        key={offset}
        offset={offset}
        limit={limit}
        onResult={onTieListResult}
        page={page} />
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px 0 0 0' }}>
      <Paper>
        <Pagination offset={offset} limit={limit} total={total} onChange={onOffsetChange} />
      </Paper>
    </Box>
  </>
);
