import * as ImagePicker from 'expo-image-picker';

const getImage = async () => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  console.log("Selected image:", result);

  if (!result.cancelled) {
    return result.uri;
  } else {
    console.log("Cancelled image upload.")
    return;
  }
}

export default getImage;