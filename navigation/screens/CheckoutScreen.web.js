import React, { useEffect, useState, } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { ActivityIndicator, Headline, Text, useTheme, } from 'react-native-paper'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, } from '@stripe/react-stripe-js'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { handleCartShipping, handleCartSubtotal, } from '../../utils/handleCartCosts'
import InjectedCheckoutForm from '../../components/modules/CheckoutForm.web'
import Footer from '../../components/layouts/Footer'

// Define stripe variables.
console.log("NODE_ENV:", process.env.NODE_ENV);
let STRIPE_PUBLISHABLE_KEY;
let STRIPE_SERVER;
if (process.env.NODE_ENV === 'development') {
  STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_TEST_PUBLISHABLE_KEY;
  STRIPE_SERVER = "https://cors-proxy.nathandonnelly.workers.dev/?u=https://pay.nathandonnelly.com/stripe-dev.php";
} else {
  STRIPE_PUBLISHABLE_KEY = process.env.MANUAL_STRIPE_PUBLISHABLE_KEY;
  STRIPE_SERVER = "https://cors-proxy.nathandonnelly.workers.dev/?u=https://pay.nathandonnelly.com/stripe.php";
}

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const CheckoutScreen = (props) => {

  console.log("Stripe promise:", stripePromise);
  
  // Define hooks.
  const Theme = useTheme();

  // Define state.
  const [ clientSecret, setClientSecret ] = useState(null);
  const cartContents = useSelector(state => state.store.cartContents);
  const currency = useSelector(state => state.store.currency);

  // Calculate amounts for payment.
  const cartSubtotal = handleCartSubtotal(cartContents);
  const cartShipping = handleCartShipping(cartContents);
  const paymentIntentAmount = parseInt((cartSubtotal + cartShipping).toString().replace(".", ""));

  // Create Stripe PaymentIntent and fetch client secret from server.
  useEffect(() => {

    if (cartSubtotal > 0) {
      console.log("Payment Intent Amount:", paymentIntentAmount);
  
      axios.post(STRIPE_SERVER, {
        paymentIntentAmount: paymentIntentAmount,
        currency: currency,
      })
      .then(response => response.data)
      .then(data => {
        console.log("Payment intent received from server.", data);
        setClientSecret(data.clientSecret);
      })
      .catch(error => console.log(error))
      .finally(() => {});
    }

    return () => {
      setClientSecret(null);
      console.log("Clean up for creating payment intent.");
    };

  }, [currency, paymentIntentAmount]);


  // Create Stripe elements options object.
  const stripeOptions = {
    clientSecret: clientSecret,
    appearance: {
      theme: 'stripe',
      labels: 'floating',
      variables: {
        colorPrimary: Theme.colors.secondary,
      },
    },
  };


  // Render method.
  if (clientSecret === null && cartContents.length === 0) {
    return (
      <ScrollView>
        <View style={{margin: 20,}}>
          <Headline style={[styles.bold, styles.headline,]}>Checkout</Headline>
          <View style={{marginVertical: 20,}}>
            <Text>No items in cart.</Text>
          </View>
        </View>
        <Footer navigation={props.navigation} route={props.route} />
      </ScrollView>
    )
  } else if (clientSecret === null && cartContents.length !== 0) {
    return (
      <ScrollView>
        <View style={{margin: 20,}}>
          <Headline style={[styles.bold, styles.headline,]}>Checkout</Headline>
          <View style={{marginVertical: 50,}}>
            <ActivityIndicator />
          </View>
        </View>
        <Footer navigation={props.navigation} route={props.route} />
      </ScrollView>
    )
  } else return (
    <ScrollView>
      <View style={{margin: 20,}}>
        <Headline style={[styles.bold, styles.headline,]}>Checkout</Headline>
        <View>
          {clientSecret && (            
            <Elements stripe={stripePromise} options={stripeOptions}>
              <InjectedCheckoutForm />
            </Elements>
          )}
        </View>
      </View>
      <Footer navigation={props.navigation} route={props.route} />
    </ScrollView>
  )
}

export default CheckoutScreen

const styles = StyleSheet.create({
  bold: {
    fontWeight: "bold",
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  flexOne: {
    flex: 1,
  },
  headline: {
    fontSize: 30,
    lineHeight: 30,
  },
  textInput: {
    elevation: 2,
    backgroundColor: "#fff",
  },
})