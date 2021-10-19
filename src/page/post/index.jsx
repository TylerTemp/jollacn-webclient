import React from 'react';

import View from './View';

import '~/css/post.css';


export default({match: {params: {slug}}}) => <View slug={slug} />;
