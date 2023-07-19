import React, { useState, useEffect } from 'react';
import {
  useNavigate,
} from 'react-router-dom';

import request from '~/Utils/Request';
import calcPage from '~/Utils/CalcPage';
import View from './View';

export default ({page: startPage}) => {

  // const {page: pageStr='1'} = useParams();
  // const startPage = parseInt(pageStr, 10);

  const navigate = useNavigate();
  const defaultLimit = 10;
  const [lastPage, setLastPage] = useState(startPage);
  const [apiState, setApiState] = useState({
    loading: true,
    error: null,
    offset: (startPage - 1) * defaultLimit,
    limit: defaultLimit,
    total: 0,
    postList: [],
  });

  const fetchPostList = (offset) => {
    setApiState({ ...apiState, loading: true, error: null });

    const queryString = new URLSearchParams({ offset, limit: apiState.limit }).toString();
    const reqUri = `/api/post?${queryString}`;
    request(reqUri)
      .then((resp) => resp.json())
      .then((result) => {
        console.log(result);
        const { total: serverTotal, limit: serverLimit, post_infos: postList } = result;
        const nowTotal = serverTotal === 0 ? apiState.total : serverTotal;
        setApiState({
          ...apiState, total: nowTotal, offset, limit: serverLimit, loading: false, error: null, postList,
        });

        const { currentPage } = calcPage(offset, serverLimit, nowTotal);
        if (currentPage !== lastPage) {
          setLastPage(currentPage);
          navigate(currentPage === 1 ? '/post' : `/post/page/${currentPage}`);
        }
      })
      .catch(({ message }) => setApiState({ ...apiState, loading: false, error: message }));
  };

  useEffect(() => {
    fetchPostList(apiState.offset);
  }, []);

  return (
    <View
      loading={apiState.loading}
      error={apiState.error}
      offset={apiState.offset}
      limit={apiState.limit}
      total={apiState.total}
      postList={apiState.postList}
      fetchPostList={fetchPostList}
      onRetry={() => fetchPostList(apiState.offset)}
      page={lastPage}
    />
  );
};
