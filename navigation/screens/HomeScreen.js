import React, { useEffect, useState } from 'react'
import { Image, FlatList, ScrollView, StyleSheet, View } from 'react-native'
import { Button, Headline, Subheading, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper'
import { useSelector } from 'react-redux'
import ProductCard from '../../components/modules/ProductCard'
import Footer from '../../components/layouts/Footer'
import ProductColorsFlatList from '../../components/layouts/ProductColorsFlatList'
import { getPageACF } from '../../api/WordPressAPI'

const HomeScreen = (props) => {

  const Theme = useTheme();
  const products = useSelector(state => state.store.products);
  const [pageACF, setPageACF] = useState({});

  // Get page ACF and push to state.
  useEffect(async () => {

    getPageACF("HomeScreen")
    .then(data => {
      console.log("Page ACF:", data);
      setPageACF(data);
    })
    .catch(error => { console.error(error) })
    .finally(() => {  });

    return () => {
      setPageACF([]);
    }

  }, []);

  return (
    <ScrollView>
      <Surface>
        <TouchableRipple
          onPress={() => {props.navigation.navigate("ShopScreen")}}
          style={{ borderRadius: Theme.roundness, margin: 20, }}
        >
          <View
            style={[
              styles.alignItemsCenter, styles.flexDirectionRow, styles.flexWrap, 
              { backgroundColor: Theme.colors.tertiary, borderRadius: Theme.roundness, }
            ]}
          >
            <Image
              source={{uri: pageACF?.bannerImage}}
              style={{
                margin: 20,
                maxHeight: 400,
                minHeight: 300,
                maxWidth: 400,
                minWidth: 300,
              }}
            />
            <View style={[styles.alignItemsCenter, styles.flexWrap]}>
              <View style={[styles.flexOne, {margin: 20,}]}>
                <Headline style={[styles.bold, {fontSize: 60, lineHeight: 60,}]}>{pageACF?.bannerHeadline}</Headline>
                <Subheading>{pageACF?.bannerSubheading}</Subheading>
                <View style={[styles.flexDirectionRow, {marginTop: 5,}]}>
                  <Button
                    mode="contained"
                    onPress={() => { props.navigation.navigate("ProductCategoryScreen", {category: "womens"})}}
                  >
                    Shop Women's
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => { props.navigation.navigate("ProductCategoryScreen", {category: "mens"}) }}
                    style={{marginHorizontal: 10, backgroundColor: Theme.colors.accent}}
                  >
                    Shop Men's
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </TouchableRipple>
      </Surface>
      <View style={{marginTop: 20,}}>
        <Headline style={[styles.bold, { marginHorizontal: 20, marginTop: 10,}]}>New In Stock.</Headline>
        <FlatList 
          data={products.slice(0, 10)}
          horizontal={true}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={{margin: 20,}}>
              <ProductCard navigation={props.navigation} product={item} route={props.route} />
            </View>
          )}
        />
      </View>
      <View style={{marginBottom: 10, marginTop: 20,}}>
        <View style={{ marginBottom: 5, marginHorizontal: 20, }}>
          <Headline style={[styles.bold,]}>Shop By Color.</Headline>
        </View>
        <View style={{marginHorizontal: 10,}}>
          <ProductColorsFlatList navigation={props.navigation} route={props.route} />
        </View>
      </View>
      <Footer navigation={props.navigation} route={props.route} />
    </ScrollView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  alignItemsCenter: {
    alignItems: 'center',
  },
  bold: {
    fontWeight: "600",
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
  justifyContentCenter: {
    justifyContent: 'center',
  },
})