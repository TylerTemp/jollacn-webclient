import React, { useState } from 'react';

import request from '~/util/Request';

import View from './View';

export default ({ uri, onSucceed }) => {
  const [apiState, setApiState] = useState({ loading: false, error: null, result: null });
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');

  const postComment = () => {
    setApiState({
      ...apiState, loading: true, error: null, result: null,
    });
    request(uri, {
      method: 'POST',
      body: JSON.stringify({
        nickname,
        email,
        content,
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((result) => {
        console.log(result);
        if (onSucceed) {
          onSucceed(result);
        }
        setApiState({
          ...apiState, loading: false, error: null, result,
        });
      })
      .catch(({ message }) => setApiState({
        ...apiState, loading: false, error: message, result: null,
      }));
  };

  return (
    <View
      loading={apiState.loading}
      error={apiState.error}
      result={apiState.result}
      nickname={nickname}
      setNickname={setNickname}
      email={email}
      setEmail={setEmail}
      content={content}
      setContent={setContent}
      onSubmit={postComment}
      dismissError={() => setApiState({ ...apiState, error: null })}
      dismissResult={() => setApiState({ ...apiState, result: null })}
      uri={uri}
    />
  );
};
