import { createStore, applyMiddleware, compose } from 'redux';
// import thunk from 'redux-thunk';
import logger from 'redux-logger';

import rootReducer from '../reducers';

// const middleware = applyMiddleware(thunk, logger);

const reduxDevTools =
    typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__();

const composeArgs = reduxDevTools === undefined? []: [reduxDevTools];

const store = createStore(
    rootReducer,
    compose(...composeArgs)
);

export default store;
// export { SagaMiddleware };
