import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Subheading, Text, TouchableRipple, useTheme, } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { getAuth, } from 'firebase/auth'
import * as Clipboard from 'expo-clipboard'
import UserAvatar from './UserAvatar'

const UserInformation = (props) => {

  // Hooks.
  const auth = getAuth();
  const Theme = useTheme();

  // Global state.
  const firstName = useSelector(state => state.user.firstName);
  const lastName = useSelector(state => state.user.lastName);
  const signUpTimestamp = useSelector(state => state.user.signUpTimestamp);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(auth.currentUser.uid);
  };

  return (
    <View>
      <Subheading style={[styles.bold,]}>User Information</Subheading>
      <View style={[ styles.flexDirectionRow, ]}>
        <UserAvatar navigation={props.navigation} route={props.route} />
        <View style={{margin: 10,}}>
          <Text>{firstName + " " + lastName}</Text>
          <Text style={{ fontSize: 12, }}>Member Since: { signUpTimestamp.split(" ").splice(1, 3).join(" ") }</Text>
          <View style={[styles.alignItemsCenter, styles.flexDirectionRow,]}>
            <Text style={{fontSize: 10,}}>ID: {auth?.currentUser?.uid}</Text>
            <TouchableRipple
              onPress={copyToClipboard}
              style={{
                borderColor: Theme.colors.greyscaleDark,
                borderRadius: Theme.roundness,
                borderWidth: .5,
                marginHorizontal: 5,
                padding: 2,
              }}
            >
              <Text style={{fontSize: 10,}}>Click to Copy</Text>
            </TouchableRipple>
          </View>
        </View>
      </View>
    </View>
  )
}

export default UserInformation

const styles = StyleSheet.create({
  alignItemsCenter: {
    alignItems: 'center',
  },
  bold: {
    fontWeight: "bold",
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
})