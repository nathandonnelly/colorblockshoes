import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { ActivityIndicator, Button, Headline, Subheading, Text, TouchableRipple } from 'react-native-paper'
import { useSelector } from 'react-redux'
import ProductCard from '../../components/modules/ProductCard'
import Footer from '../../components/layouts/Footer'

const ShopScreen = (props) => {

  const products = useSelector(state => state.store.products);
  const [productsToRender, setProductsToRender] = useState(20);

  const loadMoreProducts = () => {
    setProductsToRender(productsToRender + 20);
  };

  if (products === null) {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator />
      </View>
    )
  } else return (
    <ScrollView>
      <View style={{margin: 20,}}>
        <Headline style={[styles.headline,]}>Shop</Headline>
      </View>
      <View style={[styles.flexDirectionRow, styles.flexOne, styles.flexWrap, styles.justifyContentCenter,]}>
        {products.slice(0, productsToRender).map(product => (
          <View key={product.id} style={[styles.flexDirectionRow, {margin: 20,}]}>
            <ProductCard
              navigation={props.navigation}
              route={props.route}
              product={product}
            />
          </View>
        ))}
      </View>
      { 
        productsToRender > products.length ? (
          <View style={[styles.alignItemsCenter, styles.justifyContentCenter,]}>
            <Subheading>All Done.</Subheading>
          </View>
        ) : (
          <Button 
            mode="contained"
            onPress={() => { loadMoreProducts() }}
            style={{
              borderRadius: 0,
            }}
          >
            Load More Products
          </Button>
        )
      }
      <Footer navigation={props.navigation} route={props.route} />
    </ScrollView>
  )
}

export default ShopScreen

const styles = StyleSheet.create({
  alignItemsCenter: {
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  flexOne: {
    flex: 1,
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  headline: {
    fontSize: 30,
    fontWeight: "600",
    lineHeight: 30,
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
})