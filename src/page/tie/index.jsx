import React from 'react';
import { useLocation } from 'react-router-dom';

import Controller from './Controller';

export default ({ match: { params: { tieId } } }) => {
  const { state: { page = 1 } = {} } = useLocation();
  return <Controller tieId={tieId} page={page} />;
};
