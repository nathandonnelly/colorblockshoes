import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Divider, IconButton, Subheading, Switch, Text, TouchableRipple, useTheme, } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux';
import { updateTheme } from '../../redux/slices/userSlice';
import { db } from '../../config/firebase.config'; 
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

const UserThemes = (props) => {

  // Hooks.
  const auth = getAuth();
  const dispatch = useDispatch();
  const Theme = useTheme();

  // Global state.
  const userTheme = useSelector(state => state.user.theme);

  // Handles pushing theme update to user document in db, and updating local state.
  const handleThemeUpdate = async (theme) => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(docRef, {
      theme: theme,
    })
    .then(() => {
      dispatch(updateTheme(theme));
    });
  };

  const themes = [
    {
      icon: "theme-light-dark",
      id: "system",
      name: "System",
    },
    {
      icon: "brightness-6",
      id: "light",
      name: "Light",
    },
    {
      icon: "brightness-3",
      id: "dark",
      name: "Dark",
    },
    {
      icon: "eye-minus-outline",
      id: "colorblind",
      name: "Deut.",
    },
    {
      icon: "eye-minus",
      id: "colorblind-dark",
      name: "Deut. Dark",
    },
  ]

  return (
    <View>
      <Subheading style={[styles.bold,]}>Themes</Subheading>
      <View style={[styles.alignItemsCenter, styles.flexDirectionRow, styles.flexOne, styles.flexWrap,]}>
        {
          themes.map(theme => (
            <TouchableRipple
              key={theme.id}
              onPress={() => { handleThemeUpdate(theme.id) }}
              style={[
                styles.alignItemsCenter, styles.justifyContentCenter,
                {
                  backgroundColor: Theme.colors.greyscale,
                  borderColor: userTheme === theme.id ? Theme.colors.greyscaleDark : "transparent",
                  borderRadius: Theme.roundness,
                  borderWidth: 2.5,
                  height: 100,
                  margin: 10,
                  padding: 5,
                  width: 100,
                }
              ]}
            >
              <View style={[ styles.alignItemsCenter, styles.justifyContentCenter, ]}>
                <IconButton
                  icon={theme.icon}
                  onPress={() => { handleThemeUpdate(theme.id) }}
                  style={{margin: 0, padding: 0,}}
                />
                <Text>{theme.name}</Text>
              </View>
            </TouchableRipple>
          ))
        }
      </View>
    </View>
  )
}

export default UserThemes

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
  flexOne: {
    flex: 1,
  },
  flexWrap: {
    flexWrap: "wrap",
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
})