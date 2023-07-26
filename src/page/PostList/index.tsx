import { Outlet, useParams } from 'react-router-dom';

// import PostList from '~/component/post_list';
import PostListWrapper from './PostListWrapper';

export default () => {

    const {page: pageStr='1'} = useParams();

    return <PostListWrapper
        page={parseInt(pageStr, 10) as number}
    ><Outlet /></PostListWrapper>;
}
