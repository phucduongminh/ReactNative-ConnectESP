import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userReducer from './slices/user';

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  keyPrefix: 'redux-',
  blacklist: [],
};

const rootReducer = combineReducers({
  user: persistReducer({...rootPersistConfig, key: 'user'}, userReducer),
});

export {rootPersistConfig, rootReducer};
