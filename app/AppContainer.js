import React, { useEffect, useState } from 'react';
import { Appearance, } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../api/WordPressAPI';
import { APP_NAME } from '../data/constants';
import { updateIsAuthenticated, updateIsLoading } from '../redux/slices/appSlice';
import { mergeCart, updateCurrency, updateProducts } from '../redux/slices/storeSlice';
import { AppDarkTheme } from '../themes/AppDarkTheme';
import { AppDefaultTheme } from '../themes/AppDefaultTheme';
import { AppColorblindTheme } from '../themes/AppColorblindTheme'
import { AppColorblindDarkTheme } from '../themes/AppColorblindDarkTheme';
import { db } from '../config/firebase.config';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateFirstName, updateLastName, updateSignUpTimestamp, updateTheme, updateUserCurrency, } from '../redux/slices/userSlice'
import AppNavigator from './AppNavigator';
import LoadingScreen from '../navigation/screens/LoadingScreen';

const AppContainer = (props) => {
  
  // Handle links.
  const linking = {
    prefixes: [
      'diztro://',
      'https://colorblockshoes.com',
      'https://*.colorblockshoes.com',
    ],
    config: {
      screens: {
        AccountScreen: "account",
        CartScreen: "cart",
        CheckoutScreen: "checkout",
        HomeScreen: "/",
        LoadingScreen: "loading",
        PaymentCompleteScreen: "payment-complete",
        ProductScreen: "products/:slug",
        ProductAttributesScreen: "attributes/:attribute",
        ProductCategoryScreen: "categories/:category",
        SearchScreen: "search",
        ShopScreen: "shop",
      },
    },
  };

  // Hooks.
  const auth = getAuth();
  const dispatch = useDispatch()

  // Global state.
  const isLoading = useSelector(state => state.app.isLoading);
  const cartContents = useSelector(state => state.store.cartContents);
  const products = useSelector(state => state.store.products);
  const userTheme = useSelector(state => state.user.theme);

  // Container state.
  const [ getProductsPageNum, setGetProductsPageNum ] = useState(1);

  // Get products and push them to state.
  useEffect(async () => {
    getProducts(getProductsPageNum)
      .then(data => {
        if (data) {
          if (data.length !== 0) {
            dispatch(updateProducts(data));
            console.log("Fetched products dispatched to store.", data);
            setGetProductsPageNum(getProductsPageNum + 1);
            if (isLoading === true) {
              dispatch(updateIsLoading(false));
            }
          } else return;
        } else {
          console.error("Error fetching products.");
        };
      })
      .catch((error) => { console.error(error) })
      .finally(() => { })

    return () => {
      console.log("Clean up for products being fetched.");
    }
  }, [getProductsPageNum]);

  // Get user data from database on auth state change.
  useEffect(async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userDoc = userSnap.data();
          console.log("User document:", userDoc);
          dispatch(updateFirstName(userDoc.firstName));
          dispatch(updateLastName(userDoc.lastName));
          dispatch(updateSignUpTimestamp(Date(userDoc.signUpTimestamp)));
          dispatch(updateTheme(userDoc.theme));
          dispatch(updateCurrency(userDoc.userCurrency));
          dispatch(updateUserCurrency(userDoc.userCurrency));
        } else {
          // doc.data() will be undefined in this case
          console.log("No user document.");
        }
        const cartRef = doc(db, "carts", user.uid);
        const cartSnap = await getDoc(cartRef);
        if (cartSnap.exists()) {
          const cartDoc = cartSnap.data();
          console.log("Cart document:", cartDoc);
          dispatch(mergeCart(cartDoc.cartContents));
        } else {
          // doc.data() will be undefined in this case
          console.log("No cart document.");
        }

      } else {
        // User is signed out
        console.log("User is not signed in or signed out.");
        dispatch(updateFirstName(""));
        dispatch(updateLastName(""));
        dispatch(updateSignUpTimestamp(""));
        dispatch(updateTheme("system"));
        dispatch(updateUserCurrency(""));
      }
    });

    return () => {
      console.log("Clean up for user being signed in or out.");
    }

  }, [auth]);

  // Updates cart in database when cart state is updated.
  useEffect( async () => {
    if (auth?.currentUser?.uid) {
      await setDoc(doc(db, "carts", auth.currentUser.uid), {
        cartContents: cartContents,
      })
    }

    return () => {
      console.log("Clean up for keeping cart contents sync'd with user account.");
    }
  }, [cartContents])

  // Handle theme.
  const colorScheme = Appearance.getColorScheme();
  const handleTheme = () => {
    if (!auth.currentUser || userTheme === "system") {
      if (colorScheme === 'dark') {
        return AppDarkTheme
      } else return AppDefaultTheme
    } else {
      switch(userTheme) {
        case "light":
          return AppDefaultTheme;
        case "dark":
          return AppDarkTheme;
        case "colorblind":
          return AppColorblindTheme;
        case "colorblind-dark":
          return AppColorblindDarkTheme;
        default:
          return AppDefaultTheme;
      }
    }
  };
  const theme = handleTheme();

  if (isLoading === true && products === null) {
    return (
      <PaperProvider theme={theme}>
        <NavigationContainer
          theme={theme}
          linking={linking}
          fallback={<LoadingScreen />}
          documentTitle={{
            formatter: () =>
              `${APP_NAME}`,
          }}
        >
          <LoadingScreen />
        </NavigationContainer>
      </PaperProvider>
    )
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer
        theme={theme}
        linking={linking}
        fallback={<LoadingScreen />}
        documentTitle={{
          formatter: (options, route) =>
            `${options?.title ?? route?.name} - ${APP_NAME}`,
        }}
      >
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  )
}

export default AppContainer