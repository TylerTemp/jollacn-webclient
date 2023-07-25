import React, { useState } from 'react';

import View from './View';

export default ({ uri }) => {
  const [preList, setPreList] = useState([]);

  const addPreList = (item) => setPreList([item, ...preList]);

  return (
    <View
      uri={uri}
      preList={preList}
      addPreList={addPreList}
    />
  );
};
