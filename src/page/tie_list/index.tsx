import React from 'react';
import { useLocation } from 'react-router-dom';
import Controller from './Controller';

interface State {
    page: number,
}

export default () => {
    const { state }: {state: null | State} = useLocation();
    const page = state === null
        ? 1
        : state.page;
    return <Controller page={page} />;
}
