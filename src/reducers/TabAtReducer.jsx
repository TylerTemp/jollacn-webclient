import InitialState from './InitialState';
import {
    TAB_AT,
} from '~/actions/ActionTypes';

export default (state=InitialState.tabAt, action) => {
  const {type, payload} = action;
  switch (type) {
    case TAB_AT:
      /* eslint-disable no-case-declarations */
      const { tabAt } = payload;
      return tabAt;
    default:
      return state;
  }
};
