import React from 'react'
import { Image, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native'
import { Button, Divider, Headline, IconButton, Subheading, Text, useTheme } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux';
import { handleCartShippingMessage, handleCartSubtotal } from '../../utils/handleCartCosts'
import { handleProductName } from '../../utils/handleProductName';
import { addOneQuantity, removeOneQuantity, removeFromCart } from '../../redux/slices/storeSlice';
import ProductCategory from '../../components/submodules/ProductCategory';
import Footer from '../../components/layouts/Footer';

const CartScreen = (props) => {

  const dispatch = useDispatch();
  const Dimensions = useWindowDimensions();
  const Theme = useTheme();
  const cartContents = useSelector(state => state.store.cartContents);
  const productImageSize = Dimensions.width > 400 ? 150 : 75;

  return (
    <ScrollView>
      <View style={[styles.flexDirectionRow, styles.flexWrap,]}>
        <View style={[styles.flexOne, {minWidth: 350,}]}>
          <View style={{margin: 20,}}>
            <Headline style={[styles.headline,]}>Bag</Headline>
          </View>
          {cartContents.length === 0 ? (
            <View style={{marginHorizontal: 20,}}>
              <Subheading>There are no items in your bag.</Subheading>
            </View>
          ) : (
            <View style={{marginHorizontal: 20,}}>
              {
                cartContents.map(item => (
                  <View
                    key={item.product.id + item.product.slug + item.product.size}
                    style={[styles.flexDirectionRow, styles.flexWrap, {marginBottom: 10,}]}
                  >
                    <View style={[styles.alignItemsCenter, styles.justifyContentCenter, {backgroundColor: Theme.colors.greyscale, borderRadius: Theme.roundness}]}>
                      <Image
                        source={{ uri: item.product.images[0].src }}
                        style={{ height: productImageSize, width: productImageSize, margin: 20,}}
                      />
                    </View>
                    <View style={[styles.flexOne, {marginHorizontal: 20,}]}>
                      <View style={[styles.flexDirectionRow, styles.flexWrap, styles.justifyContentSpaceBetween,]}>
                        <Subheading style={[styles.bold]}>{handleProductName(item.product)}</Subheading>
                        <Subheading>${parseFloat((item.product.price * item.quantity).toFixed(2))}</Subheading>
                      </View>
                      <View style={{marginVertical: 5,}}>
                        <ProductCategory product={item.product} size={12} />
                      </View>
                      <View style={[styles.alignItemsCenter, styles.flexDirectionRow, {marginTop: 5,}]}>
                        <Text>Size {item.size}</Text>
                      </View>
                      <View style={[styles.alignItemsCenter, styles.flexDirectionRow]}>
                        <Text>Quantity</Text>
                        <IconButton
                          icon="minus"
                          onPress={() => { dispatch(removeOneQuantity(item)); }}
                          size={14} 
                        />
                        <Text>{item.quantity}</Text>
                        <IconButton
                          icon="plus"
                          onPress={() => { dispatch(addOneQuantity(item)); } }
                          size={14}
                        />
                      </View>
                      <View style={[styles.flexOne, {alignItems: 'flex-end', justifyContent: 'flex-end',}]}>
                        <IconButton
                          icon="delete"
                          onPress={() => { dispatch(removeFromCart(item)); }}
                          size={20}
                          style={{margin: 0, padding: 0,}}
                        />
                      </View>
                      <Divider />
                    </View>
                  </View>
                ))
              }
            </View>
          )}
        </View>
        <View style={{margin: 20, minWidth: 350,}}>
          <View>
            <Headline style={[styles.headline,]}>Summary</Headline>
          </View>
          <View style={[styles.flexDirectionRow, styles.justifyContentSpaceBetween, ]}>
            <Subheading>Subtotal</Subheading>
            <Subheading>${handleCartSubtotal(cartContents)}</Subheading>
          </View>
          <View style={[styles.flexDirectionRow, styles.justifyContentSpaceBetween, ]}>
            <Subheading>Shipping</Subheading>
            <Subheading>{handleCartShippingMessage(cartContents)}</Subheading>
          </View>
          <View style={[styles.flexDirectionRow, styles.justifyContentSpaceBetween, ]}>
            <Subheading>Taxes</Subheading>
            <Subheading>Included</Subheading>
          </View>
          <View style={{marginTop: 20,}}>
            <Button
              mode="contained"
              onPress={() => { 
                props.navigation.navigate("CheckoutScreen");
              }}
            >
              Checkout
            </Button>
          </View>
        </View>
      </View>
      <Footer navigation={props.navigation} route={props.route} />
    </ScrollView>
  )
}

export default CartScreen

const styles = StyleSheet.create({
  alignItemsCenter: {
    alignItems: 'center',
  },
  bold: {
    fontWeight: "600",
  },
  headline: {
    fontSize: 30,
    fontWeight: "600",
    lineHeight: 30,
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
  justifyContentSpaceBetween: {
    justifyContent: 'space-between',
  },
})