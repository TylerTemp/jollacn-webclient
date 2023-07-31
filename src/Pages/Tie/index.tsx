// import React from 'react';

import { useParams, useLocation } from 'react-router-dom';

// import View from './View';

// import '~/css/post.css';
import TieContent from './TieContent';

interface State {
  page: number,
}

export default () => {
    // const { state: { page = 1 } = {} } = useLocation();
    const { tieId } = useParams();
    // const { state: { page=1 } }: {state: {page: number}} = useLocation();
    const { state }: {state: State | null} = useLocation();
    const page = state === null
        ? 1
        : state.page;

    const backUrl = page <= 1
        ? `/tie#${tieId}`
        : `/tie/pages/${page}#${tieId}`;

    return <TieContent tieId={tieId} backUrl={backUrl} />;
};
