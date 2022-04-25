import './firebase.config'
import store from "./redux/stores/store"
import React, { useEffect, useState } from 'react'
import AppContainer from './AppContainer'
import { Provider as StoreProvider } from 'react-redux'

const App = () => {

  return (
    <StoreProvider store={store}>
      <AppContainer />
    </StoreProvider>
  );
}

export default App
