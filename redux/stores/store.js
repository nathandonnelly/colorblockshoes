import { configureStore } from '@reduxjs/toolkit'
import appReducer from '../slices/appSlice'
import storeReducer from '../slices/storeSlice'

export default configureStore({
  reducer: {
    app: appReducer,
    store: storeReducer,
  },
});