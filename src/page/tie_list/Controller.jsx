import React, { useState } from 'react';
import {
  useHistory,
} from 'react-router-dom';

import calcPage from '~/util/CalcPage';
import View from './View';

export default ({ page = 1 }) => {
  const history = useHistory();

  const limit = 12;

  const [pageState, setPageState] = useState({ offset: (page - 1) * limit, limit, total: 0 });

  const onTieListResult = ({ offset, limit: resultLimit, total }) => {
    setPageState({
      ...pageState,
      offset,
      limit: resultLimit,
      total,
    });

    const { currentPage } = calcPage(offset, resultLimit, total);
    history.push(currentPage === 1 ? '/tie' : `/tie/page/${currentPage}`);
  };

  return (
    <View
      offset={pageState.offset}
      limit={pageState.limit}
      total={pageState.total}
      onOffsetChange={(offset) => setPageState({ ...pageState, offset })}
      onTieListResult={onTieListResult}
      page={calcPage(pageState.offset, pageState.limit, pageState.total).currentPage}
    />
  );
};
