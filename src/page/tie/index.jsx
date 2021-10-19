import React from 'react';

import Controller from './Controller';

export default({match: {params: {tieId}}}) => <Controller tieId={tieId} />;
