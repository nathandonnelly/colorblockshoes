import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { Text, TouchableRipple, useTheme, } from 'react-native-paper'

const ProductColorsFlatList = (props) => {

  const colorArray = ["Black", "Blue", "Brown", "Green", "Grey", "Orange", "Pink", "Purple", "Red", "White", "Yellow"]
  const Theme = useTheme();

  return (
    <FlatList
      data={colorArray}
      keyExtractor={item => item}
      horizontal={true}
      renderItem={({item}) => (
        <TouchableRipple  
          onPress={() => { props.navigation.navigate("ProductAttributesScreen", {attribute: item.toLowerCase()}) }}
          style={{borderRadius: "50%", margin: 10,}}
        >
          <View
            style={{
              backgroundColor: item.toLowerCase(),
              borderColor: Theme.colors.greyscale,
              borderRadius: "50%",
              borderWidth: 3,
              elevation: 6,
              height: 50,
              width: 50,
            }}>  
          </View>
        </TouchableRipple>
      )}
    />
  )
}

export default ProductColorsFlatList

const styles = StyleSheet.create({})