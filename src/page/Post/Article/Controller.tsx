import React, { useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// import request from '../../../util/Request';
import request from '~/Utils/Request';
import View from './View';
import ReqJsonToType from '~/Utils/ReqJsonToType';

interface ArticleInfo {
  slug: string;
}

interface ApiResult {
  headerimg: string,
  title: string,
  description: string,
  source_authors: string[],
  source_url: string,
  source_title: string,
  content: string,
}

interface ApiState {
  loading: boolean;
  error: string,
  result: ApiResult,
}

export default (articleInfo: ArticleInfo) => {
  const [apiState, setApiState] = useState<ApiState>({ loading: true, error: null, result: {
    headerimg: null,
    title: null,
    description: null,
    source_authors: [],
    source_url: null,
    source_title: null,
    content: null,
  }});
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  const fetchPost = () => {
    setApiState({ ...apiState, loading: true, error: null });
    ReqJsonToType(`/api/post/${articleInfo.slug}`)
      .then(resp => resp.json())
      .then(result => {
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
  };

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
