import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
// slices

import userReducer from './slices/user';

/* const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key, value) {
    return Promise.resolve(value);
  },
  removeItem() {
    return Promise.resolve();
  },
});

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage(); */

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  keyPrefix: 'redux-',
  // whitelist: [], // reload page all lost data , for call api alway
  blacklist: [], //save data in local storage when reload page data remains
};

const rootReducer = combineReducers({
  user: persistReducer({...rootPersistConfig, key: 'user'}, userReducer),
});

export {rootPersistConfig, rootReducer};
