import { useOutlet, useParams } from 'react-router-dom';

// import PostList from '~/Components/post_list';
import PostListWrapper from './PostListWrapper';

export default () => {

    const {page: pageStr='1'} = useParams();
    const outlet = useOutlet();

    return <PostListWrapper
        page={parseInt(pageStr, 10) as number}
    >{outlet}</PostListWrapper>;
}
