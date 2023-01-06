import React, { useEffect, useState } from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { Appbar, Badge, Drawer, Headline, Text, useTheme } from 'react-native-paper'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import SiteSearch from '../../components/modules/SiteSearch'
import { useSelector } from 'react-redux'
import { handleCartQuantity } from '../../utils/handleCartQuantity'
import ProductCard from '../../components/modules/ProductCard'
import Logo from '../../components/icons/Logo'

const MainDrawerContent = (props) => {

  const currentDate = new Date;
  const currentYear = currentDate.getFullYear();
  const Theme = useTheme();
  const Dimensions = useWindowDimensions();
  const cartContents = useSelector(state => state.store.cartContents);
  const products = useSelector(state => state.store.products);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const logoSize = Dimensions.width > 768 ? 18 : 12;

  // Picks a random product for the drawer.
  useEffect(() => {
    setFeaturedProduct(products[(Math.floor(Math.random() * products.length))])
    return () => {
      setFeaturedProduct(null);
      console.log("Clean up for setting featured product.")
    }
  }, [])

  return (
    <View style={[styles.flexOne]}>
      <Appbar style={{backgroundColor: Theme.colors.background}}>
      <Logo navigation={props.navigation} route={props.route} size={logoSize} />
        <Appbar.Content title="Colorblock Shoes™" style={{marginLeft: 0, paddingLeft: 0,}} />
      </Appbar>
      <DrawerContentScrollView>
        <View style={{marginHorizontal: 10, marginBottom: 10,}}>
          <SiteSearch navigation={props.navigation} route={props.route} />
        </View>
        <Drawer.Section title="Browse">
          <Drawer.Item  
            icon="bag-personal"
            label="Bag"
            onPress={() => { props.navigation.navigate("CartScreen"); }}
            right={() => (
              <Badge
                style={{
                  alignSelf: 'center', backgroundColor: Theme.colors.accent, margin: 0, padding: 0,
                }}
              >
                {handleCartQuantity(cartContents)}
              </Badge>
            )}
          />
          <Drawer.Item
            icon="shopping"
            label="Shop"
            onPress={() => { props.navigation.navigate("ShopScreen") }}
          />
        </Drawer.Section>
        {
          Dimensions.width > 768 ? null : (
            <View>
              <Drawer.Section>
                <Drawer.Item
                  icon="account"
                  label="Account"
                  onPress={() => {props.navigation.navigate("AccountScreen")} }
                />
              </Drawer.Section>
            </View>
          )
        }
        {
          featuredProduct === null ? null : (
            <View>
              <Headline style={[styles.headline, {fontSize: 20, lineHeight: 20, margin: 10,}]}>
                Featured Product
              </Headline>
              <ProductCard
                product={featuredProduct}
                navigation={props.navigation}
                route={props.route}
                elevation={0}
              />
            </View>
          )
        }
      </DrawerContentScrollView>
      <View style={{bottom: 0, margin: 10,}}>
        <Logo navigation={props.navigation} route={props.route} size={10} />
        <View style={{margin: 5,}}>
          <Text style={{fontSize: 9,}}>
            © {currentYear} Colorblock Shoes, Moe Threads, Diztro.
            All Rights Reserved.
            NDV. A Nathan Donnelly Ventures Property.
          </Text>
        </View>
      </View>
    </View>
  )
}

export default MainDrawerContent

const styles = StyleSheet.create({
  alignItemsCenter: {
    alignItems: 'center',
  },
  headline: {
    fontWeight: "600",
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  flexOne: {
    flex: 1,
  },
})