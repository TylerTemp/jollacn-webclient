import React from 'react';
import { useParams } from 'react-router-dom';

import PostList from '~/component/post_list';

export default () => {
    const {page: pageStr='1'} = useParams();
    return <PostList page={parseInt(pageStr, 10) as number} />;
}
