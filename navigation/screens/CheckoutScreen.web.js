import React, { useEffect, useState, } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useSelector } from 'react-redux'
import axios from 'axios'

const CheckoutScreen = (props) => {

  const [clientSecret, setClientSecret] = useState("");
  const stripePromise = loadStripe(process.env.STRIPE_TEST_PUBLISHABLE_KEY);
  const cartContents = useSelector(state => state.store.cartContents);

  // Create PaymentIntent as soon as the page loads
  useEffect(() => {

    console.log("Cart Contents:", cartContents);

    axios.post('https://pay.nathandonnelly.com/stripe.php', {
      auth: {
        username: process.env.NATHAN_DONNELLY_BASIC_AUTH_USER,
        password: process.env.NATHAN_DONNELLY_BASIC_AUTH_PASSWORD,
      },
    })
    .then(response => response.data)
    .then(data => {
      console.log(data);
    })
    .catch(error => console.log(error))
    .finally(() => {});

  }, []);

  return (
    <View>
      <Text>CheckoutScreen.web</Text>
    </View>
  )
}

export default CheckoutScreen

const styles = StyleSheet.create({})