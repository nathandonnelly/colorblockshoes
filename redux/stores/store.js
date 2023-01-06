import { configureStore } from '@reduxjs/toolkit'
import appReducer from '../slices/appSlice'
import storeReducer from '../slices/storeSlice'
import userReducer from '../slices/userSlice'

export default configureStore({
  reducer: {
    app: appReducer,
    store: storeReducer,
    user: userReducer,
  },
});