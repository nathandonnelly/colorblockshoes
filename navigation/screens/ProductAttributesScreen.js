import React, { useEffect, useLayoutEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { ActivityIndicator, Button, Headline, Subheading, Text } from 'react-native-paper'
import { useSelector } from 'react-redux';
import Footer from '../../components/layouts/Footer';
import ProductCard from '../../components/modules/ProductCard'

const ProductAttributesScreen = (props) => {

  const { attribute } = props.route.params;
  const attributeSentenceCase = attribute.charAt(0).toUpperCase() + attribute.slice(1);
  const products = useSelector(state => state.store.products);
  const [ productsByAttribute, setProductsByAttribute ] = useState(null);
  const [ productsToRender, setProductsToRender ] = useState(20)

  // Filter products by attribute.
  useEffect(() => {

    const filteredProducts = products.filter(product => product.attributes[1].options.includes((attribute.charAt(0).toUpperCase() + attribute.slice(1))))
    console.log("Filtered products:", filteredProducts);
    setProductsByAttribute(filteredProducts);

    return () => {
      setProductsByAttribute(null);
      console.log("Clean up for filtering products.");
    }
  }, [attribute, products]);

  // Changes navigation options title to product name.
  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: attribute !== null ? attributeSentenceCase + " Products" : "Attribute",
    });

    return () => { 
      props.navigation.setOptions({
        title: "Attribute",
      });
      console.log("Clean up for navigation changes.");
    }
  }, [props.navigation, attributeSentenceCase]);

  // Function to load more products.
  const loadMoreProducts = () => {
    setProductsToRender(productsToRender + 20);
  };

  // Render method.
  if (!attribute || productsByAttribute === null) {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator />
      </View>
    )
  } else return (
    <ScrollView>
      <View style={{backgroundColor: attribute, height: 10,}}></View>
      <View style={[styles.alignItemsCenter, styles.flexDirectionRow, {margin: 20,}]}>
        <View
          style={{backgroundColor: attribute, borderRadius: "50%", height: 30, marginRight: 10, width: 30, }}
        >
        </View>
        <Headline style={[styles.headline]}>
          {attributeSentenceCase}
        </Headline>
      </View>
      <View style={[styles.flexDirectionRow, styles.flexOne, styles.flexWrap, styles.justifyContentCenter,]}>
        {
          productsByAttribute.slice(0, productsToRender).map(product => (
            <View key={product.id + product.name} style={[styles.flexDirectionRow, {margin: 20,}]}>
              <ProductCard
                navigation={props.navigation}
                route={props.route}
                product={product}
              />
            </View>
          ))
        }
      </View>
      { 
        productsToRender > productsByAttribute.length ? (
          <View style={[styles.alignItemsCenter, styles.justifyContentCenter,]}>
            <Subheading>{productsByAttribute.length < 20 || productsByAttribute.length === null ? "" : "All Done."}</Subheading>
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

export default ProductAttributesScreen

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