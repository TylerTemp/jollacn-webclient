import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import PostList from '~/component/post_list';
import PostListPage from './PostListPage';
import { useMountRef } from '~/component/Layouts/MainLayout/MainBottomProvider';
import Portal from '@mui/base/Portal';
import LinearProgress from '@mui/material/LinearProgress';

export default ({page}: {page: number}) => {

    const navigate = useNavigate();
    // const mainButtomRef = useContext(MainBottomContext);
    const refInfo = useMountRef();

    // console.log(`render sub ref`, mountRefElement);
    const [loading, setLoading] = useState<boolean>(false);

    return <>
        {refInfo.refValue && <Portal container={refInfo.refValue.current} key={refInfo.key}>
            <LinearProgress sx={{visibility: (loading? 'visible': 'hidden')}}/>
        </Portal>}

        <PostListPage
            page={page}
            onPageChange={page => page <= 1? navigate(`/post`): navigate(`/post/page/${page}`)}
            loading={loading}
            setLoading={setLoading}
        />
    </>;
}
