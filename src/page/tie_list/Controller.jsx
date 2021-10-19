import React, { useState, useEffect } from 'react';

import request from '~/util/Request';
import View from './View';


export default({page=1}) => {
  const limit = 12;

  const [pageState, setPageState] = useState({offset: (page-1)*limit, limit, total: 0});

  const onTieListResult = ({offset, limit: resultLimit, total}) => setPageState({
    ...pageState,
    offset,
    limit: resultLimit,
    total
  });

  return <View
    offset={pageState.offset}
    limit={pageState.limit}
    total={pageState.total}

    onOffsetChange={offset => setPageState({...pageState, offset})}
    onTieListResult={onTieListResult}
  />;
}
