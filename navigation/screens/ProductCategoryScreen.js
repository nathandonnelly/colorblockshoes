import React, { useEffect, useLayoutEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { ActivityIndicator, Button, Headline, Subheading, Text } from 'react-native-paper'
import { useSelector } from 'react-redux'
import Footer from '../../components/layouts/Footer'
import ProductCard from '../../components/modules/ProductCard'

const ProductCategoryScreen = (props) => {
  const { category } = props.route.params;

  const products = useSelector(state => state.store.products);
  const [productCategory, setProductCategory] = useState(null);
  const [productsByCategory, setProductsByCategory] = useState(null);
  const [productsToRender, setProductsToRender] = useState(20)

  // Filters products by search query and sets the state.
  useEffect(() => {

    if (products) {
      const productsFilteredByCategory = products.filter(product => product.categories[0].slug === category);
      setProductsByCategory(productsFilteredByCategory);
      setProductCategory(productsFilteredByCategory[0].categories[0].name);
      console.log("Products by category:", category);
    }

    return () => {
      setProductsByCategory(null);
      console.log("Clean up for category changes.");
    }
  }, [products, category]);

  // Changes navigation options title to product name.
  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: productCategory !== null ? productCategory : "Product Category",
    });

    return () => { 
      props.navigation.setOptions({
        title: "Product Category",
      });
      console.log("Clean up for navigation changes.");
    }
  }, [props.navigation, productCategory]);

  // Function to load more products.
  const loadMoreProducts = () => {
    setProductsToRender(productsToRender + 20);
  }


  if (productsByCategory === null) {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator />
      </View>
    )
  } else return (
    <ScrollView>
      <View style={{margin: 20,}}>
        <Headline style={[styles.headline]}>{productCategory}</Headline>
      </View>
      <View style={[styles.flexDirectionRow, styles.flexOne, styles.flexWrap, styles.justifyContentCenter,]}>
        {productsByCategory.slice(0, productsToRender).map(product => (
          <View key={product.id + product.name} style={{margin: 20,}}>
            <ProductCard
              product={product}
              navigation={props.navigation}
              route={props.route}
            />
          </View>
        ))}
      </View>
      { 
        productsToRender > productsByCategory.length ? (
          <View style={[styles.alignItemsCenter, styles.justifyContentCenter,]}>
            <Subheading>{productsByCategory.length < 20 || productsByCategory.length === null ? "" : "All Done."}</Subheading>
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

export default ProductCategoryScreen

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