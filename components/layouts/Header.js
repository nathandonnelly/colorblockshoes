import React, { useEffect, useState } from 'react'
import { FlatList, Image, SafeAreaView, StyleSheet, useWindowDimensions, View } from 'react-native'
import { Appbar, Avatar, TouchableRipple, useTheme, } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { handleRandomMessage } from '../../utils/handleRandomText'
import { StatusBar } from 'expo-status-bar'
import { getAuth, onAuthStateChanged, } from "firebase/auth";
import { shippingLocations } from '../../data/shipping'
import { updateCurrency } from '../../redux/slices/storeSlice'
import Logo from '../icons/Logo'
import { updateUserCurrency } from '../../redux/slices/userSlice'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase.config'

const Header = (props) => {

  // Hooks.
  const auth = getAuth();
  const dispatch = useDispatch();
  const Dimensions = useWindowDimensions();
  const Theme = useTheme();
  
  // Global state.
  const currency = useSelector(state => state.store.currency);
  const products = useSelector(state => state.store.products);

  // Component state.
  const [ avatarSource, setAvatarSource ] = useState("");
  const [ flag, setFlag ] = useState()
  const [ randomProductNum, setRandomProductNum ] = useState(null);
  const [ randomMessage, setRandomMessage ] = useState("");

  // Calculations.
  const rootElevation = Dimensions.width < 768 ? 4 : 0;
  const logoSize = Dimensions.width > 768 ? 20 : 10;

  useEffect(() => {
    if (currency === "usd") {
      setFlag(shippingLocations[1].flag);
    } else {
      setFlag(shippingLocations[0].flag);
    }
  }, [currency])

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

  // Sets avatar image source & currency on auth state change.
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const currentUser = auth.currentUser;
        setAvatarSource(currentUser.photoURL);
      } else {
        setAvatarSource("");
      }
    });
  }, [auth]);

  // Handles pushing currency update to user document in db, and updating local state.
  const handleCurrencyUpdate = async (currency) => {
    const updatedCurrency = currency === "usd" ? "cad" : "usd";
    if (auth.currentUser) {
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        userCurrency: updatedCurrency,
      })
      .then(() => {
        dispatch(updateUserCurrency(updatedCurrency));
      });
    }
    dispatch(updateCurrency(updatedCurrency));
    props.navigation.navigate("HomeScreen");
  };


  // Render.
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
                      <Image
                        source={{ uri: item.images[1].src }}
                        style={{height: 30, width: 30, margin: 1,}}
                      />
                    </TouchableRipple>
                  )}
                />
              </View>
            ) : (
              <Logo navigation={props.navigation} route={props.route} size={logoSize} />
              )
            }
          <Appbar.Content
            subtitle={randomMessage.toLowerCase() + "."}
            titleStyle={{display: 'none',}}
            style={{margin: 0, padding: 0,}}
          />
          <TouchableRipple
            onPress={() => {
              handleCurrencyUpdate(currency);
            }}
            style={{
              margin: 5,
              borderRadius: Theme.roundness,
            }}
          >
            <Image
              source={{
                uri: flag,
              }}
              style={{
                height: 40,
                width: 40,
              }}
            />
          </TouchableRipple>
          <Appbar.Action
            color={Theme.colors.white}
            icon="bag-personal"
            onPress={() => {props.navigation.navigate("CartScreen")}}
            style={{backgroundColor: Theme.colors.primary}}
          />
          {
            Dimensions.width > 768 ? (
              <TouchableRipple
                onPress={() => {props.navigation.navigate("AccountScreen")} }
                style={{borderRadius: "50%", marginRight: 5,}}
              >
                {
                  auth.currentUser && auth.currentUser.photoURL !== null ? 
                  <Avatar.Image size={35} source={{uri: avatarSource}} /> : 
                  <Avatar.Icon size={35} icon="account" />
                }
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