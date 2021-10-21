import React from 'react';

import PostList from '~/component/post_list';

export default ({ match: { params: { page: pageStr = '1' } } }) => <PostList page={parseInt(pageStr, 10)} />;
