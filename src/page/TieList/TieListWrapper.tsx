import { PropsWithChildren, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import PostList from '~/component/post_list';
import TieListPage from './TieListPage';
import { useMountRef } from '~/component/Layouts/MainLayout/MainBottomProvider';
import Portal from '@mui/base/Portal';
import LinearProgress from '@mui/material/LinearProgress';

export default ({page, children}: PropsWithChildren<{page: number}>) => {

    const navigate = useNavigate();
    // const mainButtomRef = useContext(MainBottomContext);
    const refInfo = useMountRef();

    // console.log(`render sub ref`, mountRefElement);
    const [loading, setLoading] = useState<boolean>(false);

    return <>
        {refInfo.refValue && <Portal container={refInfo.refValue.current} key={refInfo.key}>
            <LinearProgress sx={{visibility: (loading? 'visible': 'hidden')}}/>
        </Portal>}

        <TieListPage
            page={page}
            onPageChange={page => page <= 1? navigate(`/tie`): navigate(`/tie/page/${page}`)}
            loading={loading}
            setLoading={setLoading}
        >{children}</TieListPage>
    </>;
}
