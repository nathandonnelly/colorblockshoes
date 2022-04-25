import React, { useEffect, useLayoutEffect, useState, } from 'react'
import { FlatList, Image, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native'
import { ActivityIndicator, Button, Divider, Headline, IconButton, Portal, Snackbar, Subheading, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../redux/slices/storeSlice'
import { handleProductName } from '../../utils/handleProductName'
import { handleProductCategoryColor } from '../../utils/handleProductCategoryColor'
import ProductCategory from '../../components/submodules/ProductCategory'
import Footer from '../../components/layouts/Footer'

const ProductScreen = (props) => {
  const { slug } = props.route.params;
  const dispatch = useDispatch();
  const Dimensions = useWindowDimensions();
  const Theme = useTheme();
  const products = useSelector(state => state.store.products);
  const [product, setProduct] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [availableSizes, setAvailableSizes] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const productImageSize = Dimensions.width > 400 ? 300 : 200;
  
  // Checks to see if there's a product and it matches the slug.
  useEffect(() => {
    const foundProduct = products.find(product => product.slug === slug);
    console.log("Product:", foundProduct);
    setProduct(foundProduct);

    return () => { 
      setProduct(null);
      setSelectedSize(null);
      console.log("Clean up for slug change.");
    }
  }, [products, slug]);

  // Changes navigation options title to product name.
  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: product !== null ? product?.name : "Product",
    });

    return () => { 
      props.navigation.setOptions({
        title: "Product",
      });
      console.log("Clean up for navigation changes.");
    }
  }, [props.navigation, product]);

  // Runs after a product is found to find specific data.
  useEffect(() => {
    if (product !== null) {

      setProductImage(product?.images[0].src);

      let sizes;
      for (let i = 0; i < product?.attributes.length; i++) {
        if (product?.attributes[i].name === "Size") {
          sizes = product?.attributes[i].options.slice().sort((a, b) => a - b)
          console.log("Available sizes.", sizes)
        }
      }
      setAvailableSizes(sizes);
      
    }

    return () => {
      setProductImage(null);
      setAvailableSizes(null);
      setSelectedQuantity(1);
      console.log("Clean up for product changes.");
    }
  }, [product])

  // Size selection functions.
  const handleSizeSelection = (size) => {
    if (selectedSize === size) {
      setSelectedSize(null)
    } else setSelectedSize(size);
  }
  const handleSelectedSizeBorderColor = (size) => {
    if (size === selectedSize) {
      return Theme.colors.primary;
    } else return "transparent";
  }

  // Quantity selection functions.
  const increaseQuantity = () => {
    if (selectedQuantity < 9) {
      setSelectedQuantity(selectedQuantity + 1)
    }
  }
  const decreaseQuantity = () => {
    if (selectedQuantity !== 1) {
      setSelectedQuantity(selectedQuantity - 1)
    }
  }

  // Cart functions.
  const handleAddToCart = () => {

    const cartObject = {
      product: product,
      size: selectedSize,
      quantity: selectedQuantity,
    }

    if (product.categories[0].name.toLowerCase().includes("shoes") && selectedSize !== null) {
      dispatch(addToCart(cartObject));
      setSnackbarMessage("You added " + selectedQuantity + " " + product.name + " in size " + selectedSize + " to your bag.");
      onToggleSnackBar();
    } else if (product.categories[0].name.toLowerCase().includes("shoes") === false) {
      dispatch(addToCart(cartObject));
      setSnackbarMessage("You added " + selectedQuantity + " " + product.name + " to your bag.");
      onToggleSnackBar();
    } else {
      setSnackbarMessage("Error adding item to cart. Maybe you forgot to select your size.");
      onToggleSnackBar();
      return;
    }

  }

  // Handle snackbar.
  const onToggleSnackBar = () => setIsSnackbarVisible(!isSnackbarVisible);
  const onDismissSnackBar = () => {
    setIsSnackbarVisible(false);
    setSnackbarMessage(null);
  };

  if (product === null || slug !== product?.slug) {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator />
      </View>
    )
  } else return (
    <ScrollView>
      <View style={{backgroundColor: handleProductCategoryColor(product.categories[0].name), height: 10,}}></View>
      <View style={[styles.alignItemsCenter, styles.flexDirectionRow, styles.flexWrap, styles.justifyContentCenter, {marginHorizontal: 20, marginTop: 20,}]}>
        <Image
          source={{
            uri: productImage,
          }}
          style={{ height: productImageSize, width: productImageSize, }}
        />
        <View style={{margin: 20,}}>
          <Headline style={[styles.headline, {width: 300,}]}>{handleProductName(product)}</Headline>
          <View style={{marginVertical: 5,}}>
            <ProductCategory size={12} product={product} />
          </View>
          <Divider style={{backgroundColor: Theme.colors.primary, width: 125,}}/>
          <Subheading style={[styles.bold, {fontSize: 20, lineHeight: 20, marginVertical: 10,}]}>
            ${product.price}
          </Subheading>
          <View style={[styles.alignItemsCenter, styles.flexDirectionRow]}>
            <Subheading>Quantity</Subheading>
            <IconButton icon="minus" onPress={() => { decreaseQuantity() }} />
            <Text>{selectedQuantity}</Text>
            <IconButton icon="plus" onPress={() => { increaseQuantity() }} />
          </View>
          <Button
            mode="contained"
            onPress={() => { handleAddToCart() }}
            style={{ backgroundColor: Theme.colors.primary }}
          >
            Add to Bag
          </Button>
        </View>
      </View>
      {
        availableSizes === null ? null : (
          <View style={{marginBottom: 20, marginHorizontal: 20,}}>
            <Subheading>Size</Subheading>
            <View
              style={[
                styles.alignItemsCenter, styles.flexDirectionRow, styles.flexWrap, styles.justifyContentCenter,
              ]}
            >
              <FlatList
                data={availableSizes}
                extraData={product}
                horizontal={true}
                keyExtractor={item => item}
                renderItem={({item}) => (
                  <TouchableRipple
                    onPress={() => { handleSizeSelection(item) }}
                    style={{
                      borderRadius: "50%",
                      borderWidth: 2,
                      borderColor: handleSelectedSizeBorderColor(item),
                      elevation: 2,
                      margin: 5,
                    }}
                  >
                    <Surface
                      style={[
                        styles.alignItemsCenter, styles.justifyContentCenter,
                        {borderRadius: "50%", height: 50, width: 50, padding: 2,}
                      ]}
                    >
                      <Text>{item}</Text>
                    </Surface>
                  </TouchableRipple>
                )}
              />
            </View>
          </View>
        )
      }
      <View style={[{ marginBottom: 20, marginHorizontal: 20, }]}>
        <Subheading>Images</Subheading>
        <FlatList
          data={product.images}
          extraData={product}
          horizontal={true}
          keyExtractor={item => item.src}
          renderItem={({item}) => (
            <TouchableRipple onPress={() => { setProductImage(item.src) }} style={{margin: 10,}}>
              <Surface style={{borderRadius: Theme.roundness}}>
                <Image 
                  source={{uri: item.src}}
                  style={{
                    width: 100,
                    height: 100,
                  }}
                />
              </Surface>
            </TouchableRipple>
          )}
        />
      </View>
      <Footer navigation={props.navigation} route={props.route} />
      <Portal>
        <Snackbar
          action={{
            label: "Close",
            labelStyle: {
              color: Theme.colors.white,
            },
            onPress: () => {
              onDismissSnackBar();
            },
            style: {
              backgroundColor: Theme.colors.colorblockRedDark,
            },
          }}
          duration={2000}
          onDismiss={onDismissSnackBar}
          visible={isSnackbarVisible}
          style={{
            backgroundColor: Theme.colors.background,
          }}
        >
          <Text>{snackbarMessage}</Text>
        </Snackbar>
      </Portal>
    </ScrollView>
  )
}

export default ProductScreen

const styles = StyleSheet.create({
  alignItemsCenter: {
    alignItems: 'center',
  },
  bold: {
    fontWeight: "600",
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  headline: {
    fontSize: 30,
    fontWeight: "600",
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
})