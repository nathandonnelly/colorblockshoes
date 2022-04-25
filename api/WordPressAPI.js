import axios from "axios";
import { WORDPRESS_URL } from "../data/constants"

export const WordPressAPI = axios.create({
  baseURL: WORDPRESS_URL + "/wp-json/wp/v2",
})

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