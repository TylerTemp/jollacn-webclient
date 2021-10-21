import React, { useState, useEffect } from 'react';

import request from '~/util/Request';
import View from './View';
import ArticleParser from './ArticleParser';

export default ({ slug }) => {
  const [apiState, setApiState] = useState({ loading: true, error: null, result: {} });

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

  return (
    <View
      loading={apiState.loading}
      error={apiState.error}
      result={apiState.result}
      onRetry={fetchPost}
    >
      {!apiState.loading && !apiState.error && <ArticleParser html={apiState.result.content} />}
    </View>
  );
};
