import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Portal, Snackbar, Subheading, Surface, Text, TextInput, useTheme, } from 'react-native-paper';
import { useDispatch, useSelector, } from 'react-redux';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, } from 'firebase/auth';
import { updateIsAuthenticated } from '../../redux/slices/userSlice'
import { db } from '../../config/firebase.config'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

const UserAuthentication = (props) => {

  // Hooks.
  const auth = getAuth();
  const Theme = useTheme();
  const dispatch = useDispatch();

  // Global state.
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const currency = useSelector(state => state.store.currency);

  // Screen state.
  const [ errorMessage, setErrorMessage ] = useState("");
  const [ isSignUp, setIsSignUp ] = useState(false);
  const [ isSecureTextEntry, setIsSecureTextEntry ] = useState(true);
  const [ isSnackbarVisible, setIsSnackbarVisible ] = useState(false);
  const [ signUpEmail, setSignUpEmail ] = useState("");
  const [ signUpFirstName, setSignUpFirstName ] = useState("");
  const [ signUpLastName, setSignUpLastName ] = useState("");
  const [ signUpPassword, setSignUpPassword ] = useState("");
  const [ signUpConfirmPassword, setSignUpConfirmPassword ] = useState("");

  // Authentication runs when button is pressed.
  const handleAuthentication = async () => {
    if (isSignUp) {
      if (signUpFirstName !== "" && signUpLastName !== "") {
        if (signUpPassword === signUpConfirmPassword) {
          createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
          .then(async (userCredential) => {
            // Signed in 
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
              email: signUpEmail,
              firstName: signUpFirstName,
              id: user.uid,
              lastLoginTimestamp: serverTimestamp(),
              lastName: signUpLastName,
              photoGsURI: null,
              photoURL: null,
              signUpTimestamp: serverTimestamp(),
              theme: "system",
              userCurrency: currency,
            });
            dispatch(updateIsAuthenticated(true));
            // ...
          })
          .catch((error) => {
            console.error("Error code:", error.code);
            console.error("Error message:", error.message);
            setErrorMessage(error.code);
            onToggleSnackBar();
            // ..
          });
        } else {
          setErrorMessage("Passwords do not match.");
          onToggleSnackBar();
        }
      } else {
        setErrorMessage("Missing fields.");
        onToggleSnackBar();
      }
    } else {
      signInWithEmailAndPassword(auth, signUpEmail, signUpPassword)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        dispatch(updateIsAuthenticated(true));
        // ...
      })
      .catch((error) => {
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        setErrorMessage(error.code);
        onToggleSnackBar();
      });
    }
  };

  // Runs when authentication state is changed.
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User detected.", user);
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        dispatch(updateIsAuthenticated(true));
      } else {
        console.log("No user detected.",);
        // User is signed out
        // Reset state of authentication components.
        dispatch(updateIsAuthenticated(false));
      }
    });
  }, [auth]);


  // Snackbar functions for displaying error messages.
  const onToggleSnackBar = () => setIsSnackbarVisible(!isSnackbarVisible);
  const onDismissSnackBar = () => {
    setIsSnackbarVisible(false);
    setErrorMessage("");
  };
  // Switches through different possibilities of error messages to pretty them up for users.
  const handleErrorMessage = (errorMessage) => {
    switch(errorMessage) {
      case "auth/invalid-email":
        return "Invalid email.";
      case "auth/missing-email":
        return "Missing email";
      case "auth/user-not-found":
        return "User not found."
      case "auth/wrong-password":
        return "Wrong password."
      case "auth/too-many-requests":
        return "Too many attempts have been made to login. Try again later."
      default:
        if (errorMessage !== "") {
          return errorMessage;
        }
        else return "Error";
    }
  };

  return (
    <View>
      <View style={{marginVertical: 20,}}>
        <Surface style={{padding: 10,}}>
          <Subheading style={[styles.bold,]}>{ isSignUp ? "Sign Up" : "Sign In" }</Subheading>
          {
            isSignUp ? (
              <View>
                <TextInput
                  label="First Name"
                  left={<TextInput.Icon icon="card-account-details" />}
                  onChangeText={(text) => { setSignUpFirstName(text) }}
                  mode="outlined"
                  value={signUpFirstName}
                />
                <TextInput
                  label="Last Name"
                  left={<TextInput.Icon icon="card-account-details" />}
                  onChangeText={(text) => { setSignUpLastName(text) }}
                  mode="outlined"
                  value={signUpLastName}
                />
              </View>
            ) : null
          }
          <TextInput
            label="Email Address"
            left={<TextInput.Icon icon="account"/>}
            onChangeText={(text) => { setSignUpEmail(text) }}
            mode="outlined"
            value={signUpEmail}
          />
          <TextInput
            label="Password"
            left={<TextInput.Icon icon="lock" />}
            onChangeText={(text) => { setSignUpPassword(text) }}
            mode="outlined"
            value={signUpPassword}
            secureTextEntry={isSecureTextEntry}
            right={
              <TextInput.Icon
                icon={isSecureTextEntry ? "eye" : "eye-off"}
                onPress={() => setIsSecureTextEntry(!isSecureTextEntry)}
              />
            }
          />
          {
            isSignUp ? (
              <View>
                <TextInput
                  label="Confirm Password"
                  left={<TextInput.Icon icon="lock" />}
                  onChangeText={(text) => { setSignUpConfirmPassword(text) }}
                  mode="outlined"
                  value={signUpConfirmPassword}
                  secureTextEntry={isSecureTextEntry}
                  right={
                    <TextInput.Icon 
                      icon={isSecureTextEntry ? "eye" : "eye-off"}
                      onPress={() => setIsSecureTextEntry(!isSecureTextEntry)}
                    />
                  }
                />
              </View>
            ) : null
          }
          <Button
            mode="contained"
            onPress={() => { handleAuthentication() }}
            style={{marginVertical: 10,}}
          >
            { isSignUp ? "Sign Up" : "Sign In" }
          </Button>
          <Button
            onPress={() => { setIsSignUp(!isSignUp) }}
            style={[styles.alignItemsCenter, styles.justifyContentCenter,]}
          >
            { isSignUp ? "Back to Sign In" : "No Account, Sign Up" }
          </Button>
        </Surface>
      </View>
      <Portal>
        <Snackbar
          action={{
            label: 'Close',
            labelStyle: {
              color: Theme.colors.white,
            },
            onPress: () => { onDismissSnackBar(); },
            style: {
              backgroundColor: Theme.colors.colorblockRedDark,
            },
          }}
          duration={3000}
          onDismiss={onDismissSnackBar}
          style={{
            backgroundColor: Theme.colors.background,
          }}
          visible={isSnackbarVisible}
        >
          <Text>{handleErrorMessage(errorMessage)}</Text>
        </Snackbar>
      </Portal>
    </View>
  )
}

export default UserAuthentication

const styles = StyleSheet.create({
  alignItemsCenter: {
    alignItems: 'center'
  },
  bold: {
    fontWeight: "bold",
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
})