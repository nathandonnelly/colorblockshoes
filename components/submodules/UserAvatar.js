import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Avatar, IconButton, Text, TouchableRipple, useTheme } from 'react-native-paper'
import getImage from '../../utils/getImage'
import { db, storage } from '../../config/firebase.config'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { getAuth, updateProfile } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const UserAvatar = (props) => {

  const auth = getAuth();
  const Theme = useTheme();

  const [ updateCount, setUpdateCount ] = useState(0);

  const updateUserAvatar = async () => {
    const imageDataURI = await getImage();
    const storageRef = ref(storage, 'images/profilePhotos/' + auth.currentUser.uid);
    uploadString(storageRef, imageDataURI, 'data_url')
    .then((snapshot) => {
      console.log("Uploaded photo as data_url string. Snapshot:", snapshot);
      const gsURI = ("gs://" + snapshot.metadata.bucket + "/" + snapshot.metadata.fullPath)
      console.log("Photo GS URI:", gsURI);
      getDownloadURL(storageRef)
      .then(async (url) => {
        console.log("Downloadable photo url:", url);
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          photoGsURI: gsURI,
          photoURL: url,
        }).then(async () => {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            console.log("User data:", docSnap.data());
            updateProfile(auth.currentUser, {
              photoURL: docSnap.data().photoURL,
            })
            .then(() => {
              console.log("User avatar updated!")
              setUpdateCount(updateCount + 1);
            })
          } else {
            console.log("User document not found.");
          }
        })
      })
    })
  }

  return (
    <View style={[styles.alignItemsCenter, {marginVertical: 10,}]}>
      <TouchableRipple
        onPress={() => { updateUserAvatar() }}
        style={{ borderRadius: "50%", }}
      >
        <View>
          {
            auth?.currentUser?.photoURL === null ?
            <Avatar.Icon icon="plus" size={40} /> :
            <Avatar.Image size={40} source={{uri: auth?.currentUser?.photoURL}} />
          }
        </View>
      </TouchableRipple>
      <TouchableRipple
        onPress={() => { updateUserAvatar() }}
        style={{ borderRadius: Theme.roundness, marginVertical: 5, padding: 2.5, }}
      >
        <Text style={{ fontSize: 10, }}>Upload Avatar</Text>
      </TouchableRipple>
    </View>
  )
}

export default UserAvatar

const styles = StyleSheet.create({
  alignItemsCenter: {
    alignItems: 'center',
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
})