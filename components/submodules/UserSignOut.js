import React from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { StyleSheet, View } from 'react-native'
import { Button, } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { updateIsAuthenticated } from '../../redux/slices/userSlice'


const UserSignOut = (props) => {

  // Hooks.
  const auth = getAuth();
  const dispatch = useDispatch();
  
  // Handles signing out.
  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      dispatch(updateIsAuthenticated(false));
    }).catch((error) => {
      // An error happened.
      console.error(error);
    });
  };

  // Render.
  return (
    <View>
      <Button
        mode="contained"
        onPress={() => { handleSignOut() }}
      >
        Sign Out
      </Button>
    </View>
  )
}

export default UserSignOut

const styles = StyleSheet.create({})