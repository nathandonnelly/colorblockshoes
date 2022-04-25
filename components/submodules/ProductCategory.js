import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ActivityIndicator, Subheading, Text, useTheme } from 'react-native-paper'
import { handleProductCategoryColor } from '../../utils/handleProductCategoryColor'

const ProductCategory = (props) => {

  const product = props.product;
  const productCategory = product.categories[0].name;
  const size = props.size || 10;
  
  const Theme = useTheme();



  if (!props.product) {
    return (
      <ActivityIndicator />
    )
  } else return (
    <View style={[styles.alignItemsCenter, styles.flexDirectionRow,]}>
      <View style={{backgroundColor: handleProductCategoryColor(productCategory), marginRight: size / 2, borderRadius: "50%", height: size, width: size,}}>
      </View>
      <Subheading style={{fontSize: size + 2, lineHeight: size,}}>{productCategory}</Subheading>
    </View>
  )
}

export default ProductCategory

const styles = StyleSheet.create({
  alignItemsCenter: {
    alignItems: 'center',
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
})