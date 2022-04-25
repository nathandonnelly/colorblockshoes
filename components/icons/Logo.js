import React from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableRipple, useTheme } from 'react-native-paper'

const Logo = (props) => {

  const Theme = useTheme();
  const size = props.size || 20;

  return (
    <TouchableRipple
      onPress={() => {props.navigation.navigate("HomeScreen")}}
      style={[{borderRadius: Theme.roundness, padding: 2,}]}
    >
      <View style={[styles.flexDirectionRow, {flexShrink: 1,}]}>
        <View style={{backgroundColor: Theme.colors.primary, borderRadius: "50%", height: size, margin: size / 4, width: size,}}></View>
        <View style={{backgroundColor: Theme.colors.accent, borderRadius: "50%", height: size, margin: size / 4, width: size,}}></View>
        <View style={{backgroundColor: Theme.colors.tertiary, borderRadius: "50%", height: size, margin: size / 4, width: size,}}></View>
      </View>
    </TouchableRipple>
  )
}

export default Logo

const styles = StyleSheet.create({
  flexDirectionRow: {
    flexDirection: 'row',
  },
})