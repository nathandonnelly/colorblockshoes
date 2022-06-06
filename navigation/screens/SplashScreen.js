import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ActivityIndicator, Headline, useTheme } from 'react-native-paper'

const SplashScreen = (props) => {

  const Theme = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: Theme.colors.background}]}>
      <Headline style={[styles.headline, {}]}>Colorblock Shoes</Headline>
      <View style={[styles.flexDirectionRow]}>
        <View style={{backgroundColor: Theme.colors.colorblockRed, borderRadius: "50%", height: 20, margin: 10, width: 20,}}></View>
        <View style={{backgroundColor: Theme.colors.colorblockBlue, borderRadius: "50%", height: 20, margin: 10, width: 20,}}></View>
        <View style={{backgroundColor: Theme.colors.colorblockYellow, borderRadius: "50%", height: 20, margin: 10, width: 20,}}></View>
      </View>
      <View style={{height: 75,}}></View>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  headline: {
    fontWeight: "600",
  },
})