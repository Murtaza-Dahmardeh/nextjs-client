import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import sagas from './sagas';

const sagaMiddleware = createSagaMiddleware();

// eslint-disable-next-line import/prefer-default-export
export function configureApplicationStore(initialState: any) {
  const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware: (arg0: { thunk: boolean; immutableCheck: boolean; serializableCheck: boolean; }) => any[]) =>
      getDefaultMiddleware({
        thunk: false,
        immutableCheck: false,
        serializableCheck: false,
      }).concat(sagaMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: initialState, // pass the initialState as preloadedState
  });

  sagaMiddleware.run(sagas);

  if ((module as any).hot) {
    (module as any).hot.accept('./reducers', () => {
      // eslint-disable-next-line global-require
      const nextRootReducer = require('./reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
