import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counter/counterSlice'
import sellerReducer from './features/seller/sellerSlice'
import userSlice from './features/user/userSlice'
import storage from 'redux-persist/lib/storage'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

const persistConfigUser = {
  key: 'user',
  version: 1,
  storage,
}

const persistConfigSeller = {
  key: 'seller',
  version: 1,
  storage,
}

const persistedUserSlice = persistReducer(persistConfigUser, userSlice)
const persistSeller = persistReducer(persistConfigSeller, sellerReducer)

const store = configureStore({
  reducer: {
    counter: counterReducer,
    seller: persistSeller,
    user: persistedUserSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

const persistor = persistStore(store)

export { store, persistor }
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
