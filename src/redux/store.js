import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import {rootPersistConfig, rootReducer} from './rootReducer';
import {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from 'react-redux';

const store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

const persistor = persistStore(store);

const {dispatch} = store;
const useSelector = useAppSelector;
const useDispatch = () => useAppDispatch();

export {store, persistor, dispatch, useSelector, useDispatch};
