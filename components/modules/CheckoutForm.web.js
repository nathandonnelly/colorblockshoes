import React, { useEffect, useState } from "react";
import { StyleSheet, View } from 'react-native'
import {
  ActivityIndicator,
  Button, 
  Divider, 
  Portal, 
  Snackbar, 
  Subheading, 
  Text, 
  TextInput, 
  useTheme 
} from "react-native-paper";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { WooCommerceAPI } from "../../api/WordPressAPI";
import { handleCartShipping, handleCartSubtotal } from "../../utils/handleCartCosts";
import { Picker } from '@react-native-picker/picker';
import { shippingLocations } from "../../data/shipping";

const CheckoutForm = () => {
  // Hooks.
  const stripe = useStripe();
  const elements = useElements();
  const Theme = useTheme();
  // Global state.
  const cartContents = useSelector(state => state.store.cartContents);
  const currency = useSelector(state => state.store.currency);
  // Functional state.
  const [ message, setMessage ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isSnackbarVisible, setIsSnackbarVisible ] = useState(false);
  // Billing information.
  const [ emailAddress, setEmailAddress ] = useState("");
  const [ phoneNumber, setPhoneNumber ] = useState("");
  // Shipping information.
  const [ country, setCountry] = useState("US");
  const [ firstName, setFirstName ] = useState("");
  const [ lastName, setLastName ] = useState("");
  const [ addressLineOne, setAddressLineOne ] = useState("");
  const [ addressLineTwo, setAddressLineTwo ] = useState("");
  const [ city, setCity ] = useState("");
  const [ state, setState ] = useState("");
  const [ postCode, setPostCode ] = useState("");
  // Calculations.
  const cartSubtotal = handleCartSubtotal(cartContents);
  const cartShipping = handleCartShipping(cartContents);
  const paymentIntentAmount = (cartSubtotal + cartShipping).toFixed(2);

  console.log(state);


  // Component functions.
  // Snackbar.
  const onToggleSnackbar = () => {
    console.log("Toggled Snackbar!")
    setIsSnackbarVisible(!isSnackbarVisible)
  };
  const onDismissSnackbar = () => {
    setIsSnackbarVisible(false);
    setMessage(null);
  }
  useEffect(() => {
    if (currency === "usd") {
      setCountry("US")
    } else {
      setCountry("CA")
    }
  }, [currency])

  // Create an order.
  const postOrder = () => {

    // Changes ActivityIndicator component on Pay Now button.
    setIsLoading(true);

    // Get line items from cartContents.
    let lineItems = [];
    for (let i = 0; i < cartContents.length; i++) {
      lineItems.push({
        product_id: cartContents[i].product.id,
        variation_id: cartContents[i].variation,
        quantity: cartContents[i].quantity,
      })
    }
    console.log("Line items for WooCommerce order:", lineItems);
    
    // Posts order information to WooCommerce.
    WooCommerceAPI.post("/orders/", {
      billing: {
        email: emailAddress,
        phone: phoneNumber,
      },
      currency: currency.toUpperCase(),
      line_items: lineItems,
      payment_method: "stripe",
      payment_method_title: "Stripe",
      prices_include_tax: true,
      set_paid: false,
      shipping: {
        first_name: firstName,
        last_name: lastName,
        address_1: addressLineOne,
        address_2: addressLineTwo,
        city: city,
        state: state,
        postcode: postCode,
        country: country,
      },
    })
    .then((response) => response.data)
    .then((data) => {
      console.log("Order data:", data);
      //Submit order information to Stripe.
      handleSubmit(data.id);
    })
    .catch((error) => console.error(error))
    .finally(() => {});
  };


  // Stripe receives the payment intent.
  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret)
    .then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          onToggleSnackbar();
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          onToggleSnackbar();
          break;
        default:
          setMessage("Something went wrong.");
          onToggleSnackbar();
          break;
      }
    })
    .then(() => {
      if (paymentIntent.status === "succeeded") {
        console.log("Payment succeed.");
      }
    })
  }, [stripe]);

  // Handle payment.
  const handleSubmit = async (orderId) => {

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setMessage("Payment processor failed to load.");
      onToggleSnackbar();
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://" + window.location.host + `/payment-complete?orderId=${orderId}`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
      onToggleSnackbar();
    } else {
      setMessage("An unexpected error occured.");
      onToggleSnackbar();
    }

    setIsLoading(false);
  };

  return (
    <View>
      {/* Shipping and Billing Container */}
      <View style={[styles.flexDirectionRow, styles.flexOne, styles.flexWrap,]}>
        {/* Shipping Container */}
        <View style={[styles.flexOne, { margin: 20, minWidth: 350, }]}>
          <Subheading style={[styles.bold, styles.subheading,]}>Shipping Information</Subheading>
          <TextInput
            autoComplete="name-given"
            dense={true}
            elevation={8}
            label="First Name"
            mode="outlined"
            onChangeText={(text) => setFirstName(text)}
            placeholder="Alex"
            style={[styles.textInput]}
            value={firstName}
          />
          <TextInput
            autoComplete="name-family"
            dense={true}
            elevation={8}
            label="Last Name"
            mode="outlined"
            onChangeText={(text) => setLastName(text)}
            placeholder="Smith"
            style={[styles.textInput]}
            value={lastName}
          />
          <View style={[styles.flexDirectionRow,]}>
            <Text style={[styles.stripeText]}>Country: </Text>
            <Text style={[styles.bold, styles.stripeText,]}>
              {country === "US" ? "United States" : "Canada"}
            </Text>
          </View>
          <Picker
            onValueChange={(itemValue, itemIndex) =>
              setState(itemValue)
            }
            selectedValue={state}
            style={{
              backgroundColor: Theme.colors.background,
              borderColor: Theme.colors.text,
              borderRadius: Theme.roundness,
              borderWidth: 1,
              color: Theme.colors.text,
              elevation: 0,
              height: 45,
              marginVertical: 5,
              paddingHorizontal: 10,
            }}
          >
              {
                shippingLocations[currency === "usd" ? 1 : 0].states.map(state => (
                  <Picker.Item key={state.name} label={state.name} value={state.abbreviation} />
                ))
              }
          </Picker>
          <TextInput
            autoComplete="postal-address-region"
            dense={true}
            elevation={8}
            label="City"
            mode="outlined"
            onChangeText={(text) => setCity(text)}
            placeholder="Springfield"
            style={[styles.textInput]}
            value={city}
          />
          <TextInput
            autoComplete="street-address"
            dense={true}
            elevation={8}
            label="Address #1"
            mode="outlined"
            onChangeText={(text) => setAddressLineOne(text)}
            placeholder="123 Main Street"
            style={[styles.textInput]}
            value={addressLineOne}
          />
          <TextInput
            dense={true}
            elevation={8}
            label="Address #2"
            mode="outlined"
            onChangeText={(text) => setAddressLineTwo(text)}
            placeholder="Unit 2"
            style={[styles.textInput]}
            value={addressLineTwo}
          />
          <TextInput
            autoComplete="postal-code"
            dense={true}
            elevation={8}
            label="Postal / Zip Code"
            mode="outlined"
            onChangeText={(text) => setPostCode(text)}
            maxLength={currency === "usd" ? 5 : 6}
            placeholder={currency === "usd" ? "12345" : "A0A0A0"}
            style={[styles.textInput]}
            value={postCode}
          />
        </View>
        {/* Billing Container */}
        <View style={[styles.flexOne, { margin: 20, minWidth: 350, }]}>
          <Subheading style={[styles.bold, styles.subheading,]}>Billing Information</Subheading>
          <TextInput
            autoComplete="email"
            dense={true}
            elevation={8}
            keyboardType="email-address"
            label="Email"
            mode="outlined"
            onChangeText={text => setEmailAddress(text)}
            placeholder="email@example.com"
            style={[styles.textInput]}
            value={emailAddress}
          />
          <TextInput
            autoComplete="tel"
            dense={true}
            elevation={8}
            keyboardType="phone-pad"
            label="Phone Number"
            maxLength={11}
            mode="outlined"
            onChangeText={(text) => setPhoneNumber(text)}
            placeholder="18881234567"
            style={[styles.textInput]}
            value={phoneNumber}
          />
        </View>
      </View>
      <Divider />
      {/* Payment Container */}
      <View style={{margin: 20,}}>
        <Subheading style={[styles.bold, styles.subheading, {marginBottom: 10,}]}>Payment Information</Subheading>
        <PaymentElement id="payment-element" />
        <Text style={[styles.bold, styles.stripeText, {marginTop: 20,}]}>You will be billed ${ paymentIntentAmount } in { currency.toUpperCase() }</Text>
        <Button
          disabled={isLoading || !stripe || !elements}
          mode="contained"
          onPress={postOrder}
          style={[styles.button, {backgroundColor: Theme.colors.colorblockRedDark,}]}
        >
          {isLoading ? <ActivityIndicator /> : "Pay Now"}
        </Button>
      </View>
      {/* Show any error or success messages */}
      {
        message === null ? null : (
          <Portal>
            <Snackbar
              action={{
                label: "Close",
                labelStyle: {
                  color: Theme.colors.white,
                },
                onPress: () => {
                  onDismissSnackbar();
                },
                style: {
                  backgroundColor: Theme.colors.colorblockRedDark,
                },
              }}
              duration={2000}
              onDismiss={onDismissSnackbar}
              visible={isSnackbarVisible}
              style={{
                backgroundColor: Theme.colors.background,
              }}
            >
              <Text>{message}</Text>
            </Snackbar>
          </Portal>
        )
      }
    </View>
  );
}

export default CheckoutForm

const styles = StyleSheet.create({
  bold: {
    fontWeight: "bold",
  },
  button: {
    marginVertical: 20,
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  flexDirectionRow: {
    flexDirection: "row",
  },
  flexOne: {
    flex: 1,
  },
  flexWrap: {
    flexWrap: "wrap",
  },
  subheading: {
    fontSize: 20,
    lineHeight: 20,
  },
  stripeText: {
    fontSize: 15,
    letterSpacing: .5,
    marginTop: 5,
  },
  textInput: {

  },
})