import React from 'react';

import View from './View';

import '~/css/post.css';


export default({match: {params: {slug}}}) => {
  return <View slug={slug} />;
}
