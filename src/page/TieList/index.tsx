import { Outlet, useOutlet, useParams } from 'react-router-dom';

import TieListWrapper from './TieListWrapper';

export default () => {

    const {page: pageStr='1'} = useParams();
    const outlet = useOutlet();

    return <TieListWrapper
        page={parseInt(pageStr, 10) as number}
    >{outlet}</TieListWrapper>;
}
