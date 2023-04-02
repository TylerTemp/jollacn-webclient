import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import Controller from './Controller';

interface State {
  page: number,
}

export default () => {
  const { tieId } = useParams();
  const { state }: { state: State | null} = useLocation();
  const page = state === null
    ? 1
    : state.page;
  return <Controller tieId={tieId} page={page} />;
};
