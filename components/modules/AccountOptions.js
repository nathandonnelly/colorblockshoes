import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Headline, Surface, } from 'react-native-paper'
import { useSelector } from 'react-redux';
import UserAuthentication from '../submodules/UserAuthentication'
import UserInformation from '../submodules/UserInformation';
import UserThemes from '../submodules/UserThemes';
import UserSignOut from '../submodules/UserSignOut';

const AccountOptions = (props) => {

  // Global state.
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);

  return (
    <View>
      <View style={{margin: 20,}}>
        <Headline style={[styles.bold, styles.headline,]}>
          { isAuthenticated ? "My Account" : "Account" }
        </Headline>
        <View>
          {
            isAuthenticated ? (
              <View style={{marginVertical: 20,}}>
                <Surface style={{padding: 10,}}>
                  <UserInformation navigation={props.navigation} route={props.route} />
                  <UserThemes navigation={props.navigation} route={props.route} />
                  <View style={{marginTop: 10,}}>
                    <UserSignOut navigation={props.navigation} route={props.route} />
                  </View>
                </Surface>
              </View>
            ) : (
              <UserAuthentication navivgation={props.navigation} route={props.route} />
            )
          }
        </View>
      </View>
    </View>
  )
}

export default AccountOptions

const styles = StyleSheet.create({
  bold: {
    fontWeight: "bold",
  },
  headline: {
    fontSize: 30,
    lineHeight: 30,
  },
})