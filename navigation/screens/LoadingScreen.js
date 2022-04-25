import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ActivityIndicator, Headline, useTheme } from 'react-native-paper'

const LoadingScreen = (props) => {

  const Theme = useTheme();

  return (
    <View style={[styles.container,]}>
      <Headline style={[styles.headline, {}]}>Colorblock Shoes</Headline>
      <View style={[styles.flexDirectionRow]}>
        <ActivityIndicator color={Theme.colors.colorblockRed} size={20} style={{margin: 10,}}/>
        <ActivityIndicator color={Theme.colors.colorblockBlue} size={20} style={{margin: 10,}}/>
        <ActivityIndicator color={Theme.colors.colorblockYellow} size={20} style={{margin: 10,}}/>
      </View>
      <View style={{height: 75,}}></View>
    </View>
  )
}

export default LoadingScreen

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