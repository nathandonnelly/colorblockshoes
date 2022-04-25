import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Divider, Headline, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper'
import { handleProductName } from '../../utils/handleProductName'
import ProductCategory from '../submodules/ProductCategory'

const ProductCard = (props) => {

  const Theme = useTheme();
  const product = props.product
  const productColorsArray = product.attributes[1].name === "Color" ? product.attributes[1].options : Theme.colors.background;

  const getProductColor = (num) => {
    if (productColorsArray[num] && typeof productColorsArray[num].toLowerCase() === "string") {
      return productColorsArray[num].toLowerCase();
    } else return Theme.colors.background;
  }

  if (product) {
    return (
      <TouchableRipple onPress={() => {props.navigation.navigate("ProductScreen", {slug: product.slug})}}>
        <Surface style={{borderRadius: Theme.roundness, elevation: props.elevation, padding: 10,}}>
          <View style={[styles.flexDirectionRow, styles.flexOne, styles.justifyContentFlexEnd]}>
            <View style={{backgroundColor: getProductColor(0), borderColor: Theme.colors.greyscale, borderWidth: 2, borderRadius: "50%", height: 25, marginLeft: 10, width: 25,}}></View>
            <View style={{backgroundColor: getProductColor(1), borderColor: Theme.colors.greyscale, borderWidth: 2, borderRadius: "50%", height: 25, marginLeft: 10, width: 25,}}></View>
          </View>
          <View style={[styles.alignItemsCenter, styles.justifyContentCenter,]}>
            <Image
              source={{
                uri: product.images[0].src,
              }}
              style={{
                height: 150,
                width: 150,
              }}
            />
          </View>
          <View style={{paddingHorizontal: 10,}}>
            <Headline style={[styles.headline]}>{handleProductName(product)}</Headline>
            <View style={{marginVertical: 5,}}>
              <ProductCategory size={10} product={product} />
            </View>
            <Text style={[styles.bold, {fontSize: 20,}]}>${product.price}</Text>
            <Divider style={{backgroundColor: Theme.colors.primary, marginVertical: 5, width: 75,}} />
          </View>
        </Surface>
      </TouchableRipple>
    )
  } else return (
    <Text>Product failed to load.</Text>
  )

}

export default ProductCard

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
  headline: {
    fontSize: 15,
    height: 40,
    lineHeight: 15,
    width: 200,
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  justifyContentFlexEnd: {
    justifyContent: 'flex-end',
  },
})