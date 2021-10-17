import React from 'react';


import Pagination from '@mui/material/Pagination';


export default({offset, limit, total, onChange}) => {
  const totalRem = total % limit;  // 不能凑整的数
  const totalQuo = Math.trunc((total - totalRem) / limit);
  const totalPage = totalRem === 0
    ? totalQuo + 1
    : totalQuo + 2;

  if(totalPage == 1) {
    return null;
  }

  const curPage = Math.trunc(offset / limit) + 1;
  return <Pagination count={totalPage} page={curPage} onChange={page => {
    console.log(page);
    onChange((page - 1) * limit)
  }} />
}
