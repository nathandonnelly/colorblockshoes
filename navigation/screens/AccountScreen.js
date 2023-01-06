import React from 'react'
import { ScrollView, StyleSheet, } from 'react-native'
import AccountOptions from '../../components/modules/AccountOptions'
import Footer from '../../components/layouts/Footer'

const AccountScreen = (props) => {
  return (
    <ScrollView>
      <AccountOptions navigation={props.navigation} route={props.route} />
      <Footer navigation={props.navigation} route={props.route} />
    </ScrollView>
  )
}

export default AccountScreen

const styles = StyleSheet.create({})