import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// import PostList from '~/component/post_list';
import PostListPage from './PostListPage';
import { useMountRef } from '~/component/Layouts/MainLayout/MainBottomProvider';
import Portal from '@mui/base/Portal';
import LinearProgress from '@mui/material/LinearProgress';
import Paging from '~/component/Paging';

export default () => {

    const {page: pageStr='1'} = useParams();

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
            page={parseInt(pageStr, 10) as number}
            onPageChange={page => page <= 1? navigate(`/post`): navigate(`/post/page/${page}`)}
            loading={loading}
            setLoading={setLoading}
        />
    </>;
}
