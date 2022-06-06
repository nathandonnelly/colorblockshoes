import React, { useEffect, useState } from "react";
import { StyleSheet, View } from 'react-native'
import { ActivityIndicator, Button, Chip, Portal, Snackbar, Subheading, Text, TextInput, useTheme } from "react-native-paper";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  // Hooks.
  const stripe = useStripe();
  const elements = useElements();
  const Theme = useTheme();
  // Functional state.
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  // Shipping information.
  const [isChipSelectedCanada, setIsChipSelectedCanada] = useState(true);
  const [isChipSelectedUS, setIsChipSelectedUS] = useState(false);
  const [country, setCountry] = useState("Canada");

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
  // Shipping.
  const handleChipSelectionCanada = () => {
      setCountry("Canada");
      setIsChipSelectedUS(false);
      setIsChipSelectedCanada(true);
  }
  const handleChipSelectionUS = () => {
    setCountry("United States");
    setIsChipSelectedCanada(false);
    setIsChipSelectedUS(true);
  }

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
        console.log("Payment succeed.")
      }
    })
  }, [stripe]);

  // Handle payment.
  const handleSubmit = async () => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://" + window.location.host + "/payment-complete",
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
      <Subheading style={[styles.subheading,]}>Shipping Information</Subheading>
      <Text style={[styles.stripeText]}>Email</Text>
      <TextInput
        activeOutlineColor={Theme.colors.stripeActiveOutline}
        dense={true}
        elevation={8}
        label="email@example.com"
        mode="outlined"
        outlineColor={Theme.colors.stripeOutline}
        style={[styles.textInput]}
      />
      <Text style={[styles.stripeText]}>Phone Number</Text>
      <TextInput
        activeOutlineColor={Theme.colors.stripeActiveOutline}
        dense={true}
        elevation={8}
        label="+1 (800) 267-2001"
        mode="outlined"
        outlineColor={Theme.colors.stripeOutline}
        style={[styles.textInput]}
      />
      <Text style={[styles.stripeText]}>First Name</Text>
      <TextInput
        activeOutlineColor={Theme.colors.stripeActiveOutline}
        dense={true}
        elevation={8}
        label="Alex"
        mode="outlined"
        outlineColor={Theme.colors.stripeOutline}
        style={[styles.textInput]}
      />
      <Text style={[styles.stripeText]}>Last Name</Text>
      <TextInput
        activeOutlineColor={Theme.colors.stripeActiveOutline}
        dense={true}
        elevation={8}
        label="Smith"
        mode="outlined"
        outlineColor={Theme.colors.stripeOutline}
        style={[styles.textInput]}
      />
      <Text style={[styles.stripeText]}>Country</Text>
      <View style={[styles.flexDirectionRow,]}>
        <Chip
          icon="flag"
          mode="outlined"
          onPress={() => { handleChipSelectionCanada() }}
          selected={isChipSelectedCanada}
          style={[{margin: 5,}]}
        >
          Canada
        </Chip>
        <Chip
          icon="flag"
          mode="outlined"
          onPress={() => { handleChipSelectionUS() }}
          selected={isChipSelectedUS}
          style={[{margin: 5,}]}
        >
          United States
        </Chip>
      </View>
      {
        
      }
      <TextInput
        activeOutlineColor={Theme.colors.stripeActiveOutline}
        dense={true}
        elevation={8}
        label="Address #1"
        mode="outlined"
        outlineColor={Theme.colors.stripeOutline}
        style={[styles.textInput]}
      />
      <TextInput
        activeOutlineColor={Theme.colors.stripeActiveOutline}
        dense={true}
        elevation={8}
        label="Address #2"
        mode="outlined"
        outlineColor={Theme.colors.stripeOutline}
        style={[styles.textInput]}
      />
      <Subheading style={[styles.subheading, {marginVertical: 10,}]}>Billing Information</Subheading>
      <PaymentElement id="payment-element" />
      <Button
        disabled={isLoading || !stripe || !elements}
        mode="contained"
        onPress={handleSubmit}
        style={[styles.button, {backgroundColor: Theme.colors.colorblockRedDark,}]}
      >
        {isLoading ? <ActivityIndicator /> : "Pay Now"}
      </Button>
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
  subheading: {
    fontWeight: "600",
  },
  stripeText: {
    color: "#4a4b55",
    fontSize: 15,
    letterSpacing: .5,
  },
  textInput: {
    backgroundColor: "white",
  },
})