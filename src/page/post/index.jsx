import React from 'react';

import { useLocation } from 'react-router-dom';

import View from './View';

import '~/css/post.css';

export default ({ match: { params: { slug } } }) => {
  const { state: { page = 1 } = {} } = useLocation();
  return <View slug={slug} page={page} />;
};
