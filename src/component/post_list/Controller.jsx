import React, { useState, useEffect } from 'react';

import request from '~/util/Request';

import View from './View';


export default ({page: startPage=1}) => {
  const defaultLimit = 10;
  const [apiState, setApiState] = useState({loading: true, error: null, offset: (startPage-1)*defaultLimit, limit: defaultLimit, total: 0, postList: []});

  const fetchPostList = offset => {
    setApiState({...apiState, loading: true, error: null});

    const queryString = new URLSearchParams({offset, limit: apiState.limit}).toString();
    const reqUri = `/api/post?${queryString}`;
    request(reqUri)
      .then(resp => resp.json())
      .then(result => {
        console.log(result);
        const {total: serverTotal, limit: serverLimit, post_infos: postList} = result;
        const nowTotal = serverTotal === 0? apiState.total: serverTotal;
        setApiState({...apiState, total: nowTotal, offset, limit: serverLimit, loading: false, error: null, postList});
      })
      .catch(({message}) => setApiState({...apiState, loading: false, error: message}));
  };

  useEffect(() => {
    fetchPostList(apiState.offset);
  }, []);

  return <View
    loading={apiState.loading}
    error={apiState.error}

    offset={apiState.offset}
    limit={apiState.limit}
    total={apiState.total}
    postList={apiState.postList}

    fetchPostList={fetchPostList}
  />;
}
