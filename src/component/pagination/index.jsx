import React from 'react';

import Pagination from '@mui/material/Pagination';
import CalcPage from '~/util/CalcPage';

export default ({
  offset, limit, total, onChange,
}) => {
  const { totalPage, currentPage } = CalcPage(offset, limit, total);
  
  if (totalPage <= 1) {
    return null;
  }

  // const curPage = Math.trunc(offset / limit) + 1;
  return <Pagination
    count={totalPage}
    page={currentPage}
    onChange={(_, page) => onChange((page - 1) * limit)} />;
};
