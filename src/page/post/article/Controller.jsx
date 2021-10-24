import React, { useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import request from '~/util/Request';
import View from './View';

export default ({ slug }) => {
  const [apiState, setApiState] = useState({ loading: true, error: null, result: {} });
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const fetchPost = () => {
    setApiState({ ...apiState, loading: true, error: null });
    request(`/api/post/${slug}`)
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
    fetchPost();
  }, []);

  const theme = useTheme();
  const breakpoints = {
    lg: useMediaQuery(theme.breakpoints.up('lg')),
    md: useMediaQuery(theme.breakpoints.up('md')),
  }

  return (
    <View
      loading={apiState.loading}
      error={apiState.error}
      result={apiState.result}
      onRetry={fetchPost}
      lightboxIndex={lightboxIndex}
      lightboxOpenAt={setLightboxIndex}
      breakpoints={breakpoints}
    />
  );
};
