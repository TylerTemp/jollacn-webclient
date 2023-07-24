// import React from 'react';

import { useParams, useLocation } from 'react-router-dom';

// import View from './View';

// import '~/css/post.css';
import PostContent from './PostContent';

interface State {
  page: number,
}

export default () => {
  // const { state: { page = 1 } = {} } = useLocation();
  const { slug } = useParams();
  // const { state: { page=1 } }: {state: {page: number}} = useLocation();
  const { state }: {state: State | null} = useLocation();
  const page = state === null
    ? 1
    : state.page;

  return <PostContent slug={slug} backUrl={`/post/page/${page}`} />;
};
