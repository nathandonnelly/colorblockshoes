import React from 'react'
import { useWindowDimensions } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import MainDrawerContent from '../navigation/drawers/MainDrawerContent'
import Header from '../components/layouts/Header'
import CartScreen from '../navigation/screens/CartScreen'
import CheckoutScreen from '../navigation/screens/CheckoutScreen'
import HomeScreen from '../navigation/screens/HomeScreen'
import PaymentCompleteScreen from '../navigation/screens/PaymentCompleteScreen'
import ProductScreen from '../navigation/screens/ProductScreen'
import ProductAttributesScreen from '../navigation/screens/ProductAttributesScreen'
import ProductCategoryScreen from '../navigation/screens/ProductCategoryScreen'
import SearchScreen from '../navigation/screens/SearchScreen'
import ShopScreen from '../navigation/screens/ShopScreen'

const AppNavigator = (props) => {

  const Drawer = createDrawerNavigator();
  const Dimensions = useWindowDimensions();

  return (
    <Drawer.Navigator
      initialRouteName="HomeScreen"
      drawerContent={(props) => ( <MainDrawerContent navigation={props.navigation} route={props.route} /> )}
      screenOptions={{
        header: (props) => (
          <Header navigation={props.navigation} route={props.route} />
        ),
        drawerType: Dimensions.width >= 768 ? 'permanent' : 'front',
        drawerStyle: {
          borderRightWidth: 0,
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Drawer.Screen name="CartScreen" component={CartScreen} options={{title: "Cart", }} />
      <Drawer.Screen name="CheckoutScreen" component={CheckoutScreen} options={{title: "Checkout", }} />
      <Drawer.Screen name="HomeScreen" component={HomeScreen} options={{title: "Home", }} />
      <Drawer.Screen
        name="PaymentCompleteScreen"
        component={PaymentCompleteScreen}
        options={{title: "Payment Complete"}}
      />
      <Drawer.Screen name="ProductScreen" component={ProductScreen} options={{title: "Product", }} />
      <Drawer.Screen 
        name="ProductAttributesScreen"
        component={ProductAttributesScreen}
      />
      <Drawer.Screen
        name="ProductCategoryScreen"
        component={ProductCategoryScreen}
        options={{title: "Product Category", }}
      />
      <Drawer.Screen name="SearchScreen" component={SearchScreen} options={{title: "Search",}} />
      <Drawer.Screen name="ShopScreen" component={ShopScreen} options={{title: "Shop",}} />
    </Drawer.Navigator>
  )
}

export default AppNavigator