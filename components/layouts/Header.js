import React, { useEffect, useState } from 'react'
import { FlatList, Image, SafeAreaView, StyleSheet, useWindowDimensions, View } from 'react-native'
import { Appbar, Avatar, TouchableRipple, useTheme, } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { handleRandomMessage } from '../../utils/handleRandomText'
import Logo from '../icons/Logo'
import {StatusBar} from 'expo-status-bar'

const Header = (props) => {

  const Dimensions = useWindowDimensions();
  const Theme = useTheme();
  const products = useSelector(state => state.store.products);
  const [randomProductNum, setRandomProductNum] = useState(null);
  const [randomMessage, setRandomMessage] = useState("");
  const rootElevation = Dimensions.width < 768 ? 4 : 0;
  const logoSize = Dimensions.width > 768 ? 20 : 10;


  // Sets two random products for the header bar.
  useEffect(() => {
    let randomNum = parseInt(Math.floor(Math.random() * products.length - 5))
    setRandomProductNum(randomNum)
    setRandomMessage(handleRandomMessage)

    return () => {
      setRandomProductNum(null);
      setRandomMessage(null);
      console.log("Clean up for header changes.");
    }
  }, []);

  if (products === null) {
    return (
      <View></View>
    )
  } else return (
    <SafeAreaView style={{backgroundColor: Theme.colors.black}}>
      <StatusBar style='light' />
      <View>
        <Appbar style={[{backgroundColor: Theme.colors.greyscale, elevation: rootElevation,}]}>
          {
            Dimensions.width > 768 ? (
              <View style={[styles.flexDirectionRow, {marginLeft: 5,}]}>
                <FlatList
                  data={products.slice(randomProductNum, randomProductNum + 2)}
                  extraData={products}
                  horizontal={true}
                  keyExtractor={item => item.id}
                  renderItem={({item}) => (
                    <TouchableRipple
                      onPress={() => {props.navigation.navigate("ProductScreen", {slug: item.slug})}}
                      style={{borderRadius: 2, padding: 1,}}
                    >
                      <Image source={{ uri: item.images[1].src }} style={{height: 30, width: 30, margin: 1,}} />
                    </TouchableRipple>
                  )}
                />
              </View>
            ) : (
              <Logo navigation={props.navigation} route={props.route} size={logoSize} />
              )
            }
          <Appbar.Content subtitle={randomMessage.toLowerCase() + "."} titleStyle={{display: 'none',}} style={{margin: 0, padding: 0,}} />
          <Appbar.Action
            color={Theme.colors.white}
            icon="bag-personal"
            onPress={() => {props.navigation.navigate("CartScreen")}}
            style={{backgroundColor: Theme.colors.primary}}
          />
          {
            Dimensions.width > 768 ? (
              <TouchableRipple onPress={() => {}} style={{borderRadius: "50%", marginRight: 5,}}>
                <Avatar.Image size={35} />
              </TouchableRipple>
            ) : (
              <Appbar.Action icon="menu" onPress={() => props.navigation.toggleDrawer()} />
            )
          }
        </Appbar>
      </View>
    </SafeAreaView>
  )
}

export default Header

const styles = StyleSheet.create({
  flexDirectionRow: {
    flexDirection: 'row',
  },
})