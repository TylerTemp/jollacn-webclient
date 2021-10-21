import React, { useState, useEffect } from 'react';

import request from '~/util/Request';
import View from './View';

export default ({
  offset: defaultOffset = 0, limit = 24, onResult, itemXs, itemMd, itemLg, page,
}) => {
  // const defaultLimit = 10;
  const [apiState, setApiState] = useState({
    loading: true, error: null, offset: defaultOffset, limit, total: 0, tieList: [],
  });
  const [mediaViewerState, setMediaViewerState] = useState({
    isOpen: false,
    index: 0,
    content: '',
    medias: [],
  });

  const fetchTieList = (offset) => {
    setApiState({ ...apiState, loading: true, error: null });

    const queryString = new URLSearchParams({ offset, limit: apiState.limit }).toString();
    const reqUri = `/api/tie?${queryString}`;
    request(reqUri)
      .then((resp) => resp.json())
      .then((result) => {
        console.log(result);
        const { total: serverTotal, limit: serverLimit, ties: tieList } = result;
        const nowTotal = serverTotal === 0 ? apiState.total : serverTotal;
        const stateResult = {
          ...apiState,
          total: nowTotal,
          offset,
          limit: serverLimit,
          loading: false,
          error: null,
          tieList,
        };
        setApiState(stateResult);
        if (onResult) {
          onResult(stateResult);
        }
      })
      .catch(({ message }) => setApiState({ ...apiState, loading: false, error: message }));
  };

  useEffect(() => {
    fetchTieList(apiState.offset);
  }, []);

  return (
    <View
      loading={apiState.loading}
      error={apiState.error}
      offset={apiState.offset}
      limit={apiState.limit}
      total={apiState.total}
      tieList={apiState.tieList}
      fetchTieList={fetchTieList}
      onRetry={() => fetchTieList(apiState.offset)}
      mediaViewerState={mediaViewerState}
      openMediaViewer={(content, medias) => setMediaViewerState({
        ...mediaViewerState, content, medias, isOpen: true, index: 0,
      })}
      closeMediaViewer={() => setMediaViewerState({ ...mediaViewerState, isOpen: false })}
      setMediaViewerIndex={(index) => setMediaViewerState({ ...mediaViewerState, index })}
      itemXs={itemXs}
      itemMd={itemMd}
      itemLg={itemLg}
      page={page}
    />
  );
};
