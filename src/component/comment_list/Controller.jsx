import React, { useState, useEffect } from 'react';

import request from '~/util/Request';
import Pagination from '~/component/pagination';
import View from './View';


export default({uri, preList=[]}) => {
  // console.log(uri);
  const [apiState, setApiState] = useState({loading: true, error: null, comments: [], limit: 10, offset: 0, total: 0});

  const fetchComments = offset => {
    setApiState({...apiState, loading: true, error: null});

    const queryString = new URLSearchParams({offset, limit: apiState.limit}).toString();
    const reqUri = `${uri}?${queryString}`;
    request(reqUri)
      .then(resp => resp.json())
      .then(result => {
        console.log(result);
        const {total: serverTotal, limit: serverLimit, comments} = result;
        const nowTotal = serverTotal === 0? apiState.total: serverTotal;
        setApiState({...apiState, total: nowTotal, offset, limit: serverLimit, loading: false, error: null, comments});
      })
      .catch(({message}) => setApiState({...apiState, loading: false, error: message}));
  }

  useEffect(() => {
    fetchComments(0);
  }, []);

  return <View
    loading={apiState.loading}
    error={apiState.error}

    offset={apiState.offset}
    limit={apiState.limit}
    total={apiState.total}
    comments={[...preList, ...apiState.comments]}

    fetchComments={fetchComments}
  />;
}
