import React from 'react';

import Controller from './Controller';


export default({match: {params: {page: pageStr='1'}}}) => <Controller page={parseInt(pageStr)} />;
