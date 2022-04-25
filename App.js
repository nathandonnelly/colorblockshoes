import './firebase.config'
import store from "./redux/stores/store";
import AppContainer from './AppContainer'
import { Provider as StoreProvider } from "react-redux";
import { decode, encode } from 'base-64'
import { StripeProvider } from '@stripe/stripe-react-native';

const App = () => {

  if (!global.btoa) {
    global.btoa = encode;
  }
    
  if (!global.atob) {
    global.atob = decode;
  }

  return (
    <StoreProvider store={store}>
      <AppContainer />
    </StoreProvider>
  );
}

export default App
