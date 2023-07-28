import React, { useState, useEffect } from 'react';

import request from '~/Utils/Request';

import View from './View';

export default ({ tieId, page }) => {
  const [apiState, setApiState] = useState({ loading: true, error: null, result: {} });

  const fetchTie = () => {
    setApiState({ ...apiState, loading: true, error: null });
    request(`/api/tie/${tieId}`)
      .then((resp) => resp.json())
      .then((result) => {
        console.log(result);
        setApiState({
          ...apiState, loading: false, error: null, result,
        });
      })
      .catch(({ message }) => setApiState({ ...apiState, loading: false, error: message }));
  };

  useEffect(() => {
    fetchTie();
  }, []);

  return (
    <View
      loading={apiState.loading}
      error={apiState.error}
      result={apiState.result}
      onRetry={fetchTie}
      tieId={tieId}
      page={page}
    />
  );
};
