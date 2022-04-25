import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { ActivityIndicator, Button, Headline, Subheading, Text } from 'react-native-paper'
import { useSelector } from 'react-redux';
import Footer from '../../components/layouts/Footer';
import ProductCard from '../../components/modules/ProductCard';

const SearchScreen = (props) => {
  const { query } = props.route.params;

  const products = useSelector(state => state.store.products);
  const [searchResults, setSearchResults] = useState(null);
  const [productsToRender, setProductsToRender] = useState(20);

  // Filter products based on search query.
  useEffect(() => {
    const filterQuery = query.toLowerCase().replace(/\//ig, "").replace(/'/gi, "").replace(/’/gi, "").replace(/ /gi, "");
    console.log(filterQuery)
    const searchedProducts = products.filter(product => {
      return product.name.toLowerCase().replace(/\//ig, "").replace(/’/gi, "").replace(/ /gi, "").includes(filterQuery)
    })
    console.log("Searched products:", searchedProducts);
    setSearchResults(searchedProducts);

    return () => {
      setSearchResults(null);
      console.log("Clean up for filtering searched products.");
    }
  }, [products, query])

  // Reset the search products map slice if the search query changes.
  useEffect(() => {
    return () => { 
      setProductsToRender(20);
      console.log("Clean up for search query changing.");
    }
  }, [query])

  // Function to load more products.
  const loadMoreProducts = () => {
    setProductsToRender(productsToRender + 20);
  };

  if (searchResults === null) {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator />
      </View>
    )
  } else return (
    <ScrollView>
      <View style={{margin: 20,}}>
        <Headline style={[styles.headline]}>Search</Headline>
        {
          query !== "" ? (
            <Subheading>You searched for {query.toLowerCase()}.</Subheading>
          ) : (
            <Subheading>You ran a search on an empty string. Here's all the products.</Subheading>
          )
        }
      </View>
      <View>
        {
          searchResults.length === 0 ? (
            <View style={{marginHorizontal: 20,}}>
              <Subheading>No results found.</Subheading>
            </View>
          ) : (
            <View style={[styles.flexDirectionRow, styles.flexOne, styles.flexWrap, styles.justifyContentCenter,]}>
              {searchResults.slice(0, productsToRender).map(product => (
                <View key={product.id} style={{margin: 20,}}>
                  <ProductCard
                    product={product}
                    navigation={props.navigation}
                    route={props.route}
                  />
                </View>
              ))}
            </View>
          )
        }
      </View>
      { 
        productsToRender > searchResults.length ? (
          <View style={[styles.alignItemsCenter, styles.justifyContentCenter,]}>
            <Subheading>{searchResults.length < 20 || searchResults.length === null ? "" : "All Done."}</Subheading>
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

export default SearchScreen

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