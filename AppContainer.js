import React, { useEffect, useState } from 'react'
import { Appearance, } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { AppDefaultTheme } from './themes/AppDefaultTheme'
import { AppDarkTheme } from './themes/AppDarkTheme'
import { APP_NAME } from './data/constants'
import AppNavigator from './AppNavigator'
import SplashScreen from './navigation/screens/SplashScreen'
import LoadingScreen from './navigation/screens/LoadingScreen'
import { getProducts } from './api/WordPressAPI';
import { useDispatch, useSelector } from 'react-redux';
import { updateIsLoading } from './redux/slices/appSlice'
import { updateProducts } from './redux/slices/storeSlice'

const AppContainer = (props) => {

  const dispatch = useDispatch()
  const [ getProductsPageNum, setGetProductsPageNum ] = useState(1);
  const isLoading = useSelector(state => state.app.isLoading);
  const products = useSelector(state => state.store.products);

  // Handle links.
  const linking = {
    prefixes: [
      'diztro://',
      'https://diztro.com',
      'https://*.diztro.com',
    ],
    config: {
      screens: {
        CartScreen: "cart",
        CheckoutScreen: "checkout",
        HomeScreen: "/",
        ProductScreen: "products/:slug",
        ProductAttributesScreen: "attributes/:attribute",
        ProductCategoryScreen: "categories/:category",
        SearchScreen: "search",
        ShopScreen: "shop",
      },
    },
  };

  // Handle theme.
  const colorScheme = Appearance.getColorScheme();
  const handleTheme = () => {
    if (colorScheme === 'dark') {
      return AppDarkTheme
    } else return AppDefaultTheme
  };
  const theme = handleTheme();

  // Get products and push them to state.
  useEffect(async () => {
    getProducts(getProductsPageNum)
    .then(data => {
      if (data.length !== 0) {
        dispatch(updateProducts(data));
        console.log("Fetched products dispatched to store.", data)
        setGetProductsPageNum(getProductsPageNum + 1);
        dispatch(updateIsLoading(false));
      } else return;
    })
    .catch((error) => { console.error(error) })
    .finally(() => { })

    return () => {
      console.log("Clean up for products being fetched.");
    }
  }, [getProductsPageNum])

  if (isLoading === true && products === null) {
    return (
      <PaperProvider theme={theme}>
        <NavigationContainer
          theme={theme}
          linking={linking}
          fallback={<LoadingScreen/>}
          documentTitle={{
            formatter: () =>
              `${APP_NAME}`,
          }}
        >
          <SplashScreen />
        </NavigationContainer>
      </PaperProvider>
    )
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer
        theme={theme}
        linking={linking}
        fallback={<LoadingScreen/>}
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