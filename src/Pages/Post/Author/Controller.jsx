import React, { useState, useEffect } from 'react';
// import parse from 'html-react-parser';
import parse from 'html-react-parser';
import request from '~/Utils/Request';
import View from './View';

const getAuthor = (authorId) => new Promise((resolve, reject) => request(`/api/author/${encodeURIComponent(authorId)}`)
    .then((resp) => resp.json())
    .then(resolve)
    .catch(reject));

export default function ({ authorId }) {
    const [apiState, setApiState] = useState({ loading: true, error: null, result: {} });

    const fetchAuthor = () => {
        setApiState({ ...apiState, loading: true, error: null });
        getAuthor(authorId)
            .then((result) => {
                console.log(result);
                setApiState({
                    ...apiState, loading: false, error: null, result,
                });
            })
            .catch(({ message }) => setApiState({ ...apiState, loading: false, error: message }));
    };

    useEffect(() => {
        fetchAuthor();
    }, []);

    return (
        <View
            loading={apiState.loading}
            error={apiState.error}
            result={apiState.result}
            onRetry={fetchAuthor}
        >
            {!apiState.loading && !apiState.error && parse(apiState.result.description)}
        </View>
    );
}
