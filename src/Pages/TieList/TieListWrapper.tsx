import { PropsWithChildren, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import PostList from '~/Components/post_list';
import TieListPage from './TieListPage';
import { useMountRef } from '~/Components/Layouts/MainLayout/MainBottomProvider';
import Portal from '@mui/base/Portal';
import LinearProgress from '@mui/material/LinearProgress';
import { WidthLimit } from '~/Components/Layouts/WidthLimitLayout';

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

        <WidthLimit maxWidth="lg">
            <TieListPage
                page={page}
                onPageChange={page => page <= 1? navigate(`/tie`): navigate(`/tie/Pages/${page}`)}
                loading={loading}
                setLoading={setLoading}
            >
                {children}
            </TieListPage>
        </WidthLimit>
    </>;
}
