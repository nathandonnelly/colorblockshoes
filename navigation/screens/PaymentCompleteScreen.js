import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ActivityIndicator, Headline, Subheading, Text, } from 'react-native-paper';
import { WooCommerceAPI } from '../../api/WordPressAPI';
import { db } from '../../config/firebase.config'
import { getAuth } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux/slices/storeSlice';
import Footer from '../../components/layouts/Footer'

const PaymentCompleteScreen = (props) => {

  // Params.
  const { orderId, payment_intent, payment_intent_client_secret, redirect_status } = props.route.params;

  // Hooks.
  const auth = getAuth();
  const dispatch = useDispatch();

  // State.
  const [ orderUpdated, setOrderUpdated ] = useState(false);
  const [ orderInformation, setOrderInformation ] = useState(null);
  

  useEffect(async () => {
    console.log("Params:", orderId, payment_intent, payment_intent_client_secret, redirect_status);
    if ( orderId, payment_intent, payment_intent_client_secret, redirect_status) {
      if (redirect_status === "succeeded" && orderId) {
        WooCommerceAPI.put(`/orders/${orderId}`, {
          status: "processing",
          transaction_id: payment_intent,
        })
        .then(response => response.data)
        .then(async (data) => {
          console.log("Order Information:", data);
          if (auth.currentUser !== null) {
            await setDoc(doc(db, "users", auth.currentUser.uid, "orders", orderId), {
              billingEmail: data.billing.email,
              billingPhone: data.billing.phone,
              createdVia: data.created_via,
              currency: data.currency,
              id: orderId,
              orderKey: data.order_key,
              paymentMethod: data.payment_method,
              store: window.location.host,
              timestamp: serverTimestamp(),
              total: data.total,
              transactionId: data.transaction_id,
            })
          };
          setOrderInformation(data);
          console.log("orderInformation State:", orderInformation);
          setOrderUpdated(true);
          console.log("orderUpdated State:", orderUpdated)
        })
        .catch(error => console.error(error))
        .finally(() => {
          dispatch(clearCart());
          console.log("Order updated in WooCommerce, Cloud Firestore & cartContents cleared.");
        })
      }
    }
  }, [payment_intent]);

  if (props.route.params) {
    if (orderInformation === null || orderUpdated === false) {
      return (
        <View>
          <View style={[{margin: 20,}]}>
            <Headline style={[styles.bold]}>Your order status is updating.</Headline>
            <Subheading>Do not refresh this page. If this message doesn't update, save this information and reach out to support.</Subheading>
            <Text>Your order number is {orderId}</Text>
            <Text>Your payment intent number is {payment_intent}</Text>
            <Text>Redirect status: {redirect_status}</Text>
          </View>
          <Footer navigation={props.navigation} route={props.route} />
        </View>
      )
    } else if (orderInformation !== null && orderUpdated !== false) {
      return (
        <View>
          <View style={[{margin: 20,}]}>
            <Headline style={[styles.bold]}>Thanks for placing an order.</Headline>
            <Subheading>Your order status has been updated.</Subheading>
            <Text style={[styles.bold]}>You order information has been emailed to {orderInformation.billing.email}</Text>
            <Text>Your order number is {orderId}</Text>
          </View>
          <Footer navigation={props.navigation} route={props.route} />
        </View>
      )
    }
  } else {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator />
      </View>
    )
  }
}

export default PaymentCompleteScreen

const styles = StyleSheet.create({
  bold: {
    fontWeight: "bold",
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
})