import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AuthReducer from './slices/AuthSlice'
import ChatReducer from './slices/ChatSlice'
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import persistStore from 'redux-persist/es/persistStore';
import { createTransform } from 'redux-persist';

const rootReducer = combineReducers({
      auth: AuthReducer,
      chat: ChatReducer
})

const removeNonSerializableTransform = createTransform(
  (inboundState, key) => {
    if (key === 'auth') {
      const { socket, ...rest } = inboundState;
      return rest;
    }
    return inboundState;
  },
  (outboundState, key) => outboundState,
  { whitelist: ['auth'] }
);

const persistConfig = {
      key: 'root',
      storage,
      blacklist: ['socket'],
      version: 1,
      transforms: [removeNonSerializableTransform]
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})

export const persistor = persistStore(store);