import axios from "axios";
import { WORDPRESS_URL } from "../data/constants"

// Defines WordPress API.
export const WordPressAPI = axios.create({
  baseURL: WORDPRESS_URL + "/wp-json/wp/v2",
})

// Defines WooCommerce API.
export const WooCommerceAPI = axios.create({
  baseURL: WORDPRESS_URL + "/wp-json/wc/v3",
  auth: {
    username: process.env.WOOCOMMERCE_CONSUMER_KEY,
    password: process.env.WOOCOMMERCE_CONSUMER_SECRET,
  },
})

// Fetch paginated products by 50.
export const getProducts = async (pageNum) => {
  const productData = await WooCommerceAPI.get("/products", {
    params: {
      page: pageNum,
      per_page: 50,
      status: "publish",
      stock_status: "instock",
      _fields: "attributes,categories,id,images,name,price,sku,slug,tags,variations,"
    },
  })
  .then(response => response.data)
  .then(data => {
    return data;
  })
  .catch(error => { console.error(error) })
  .finally(() => {  })
  return productData;
};

// Create an order.
export const createOrder = async ( 
  paymentMethod,
  paymentMethodTitle,
  isPaid,
  billingObject,
  shippingObject,
  lineItemsArray,
  shippingLinesArray 
) => {
  const createdOrder = await WooCommerceAPI.post("/orders", {
    params: {
      payment_method: paymentMethod,
      payment_method_title: paymentMethodTitle,
      set_paid: isPaid,
      billing: billingObject,
      shipping: shippingObject,
      line_items: lineItemsArray,
      shipping_lines: shippingLinesArray,
    }
  })
  .then(response => response.data)
  .then(data => {
    return data
  })
  .catch(error => { console.error(error) })
  .finally(() => {})
  return createdOrder
}

// Fetch ACF content on specified page.
export const getPageACF = async (pageSlug) => {
  const pageACFData = await WordPressAPI.get("/pages", {
    params: {
      slug: pageSlug,
      _fields: "acf",
    },
  })
  .then(response => response.data)
  .then(data => {
    return data[0].acf;
  })
  .catch(error => { console.error(error) })
  .finally(() => {  })
  return pageACFData;
}