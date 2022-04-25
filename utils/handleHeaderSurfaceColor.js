import { Platform } from 'react-native'

export const handleHeaderSurfaceColor = () => {

  const colorArray = ["Black", "Blue", "Brown", "Green", "Grey", "Orange", "Pink", "Purple", "Red", "White", "Yellow"]

  if (Platform.OS === "web") {

    let documentTitle = document.title.toLowerCase();

    if (documentTitle.includes("women")) {
      return "#ff80ff"
    } else if (documentTitle.includes("Men")) {
      return "#69afff"
    } else if (documentTitle.includes("black")) {
      return "black"
    } else if (documentTitle.includes("blue")) {
      return "blue"
    } else if (documentTitle.includes("brown")) {
      return "blue"
    } else if (documentTitle.includes("green")) {
      return "blue"
    } else if (documentTitle.includes("grey")) {
      return "grey"
    } else if (documentTitle.includes("orange")) {
      return "orange"
    } else if (documentTitle.includes("pink")) {
      return "pink"
    } else if (documentTitle.includes("purple")) {
      return "purple"
    } else if (documentTitle.includes("red")) {
      return "red"
    } else if (documentTitle.includes("white")) {
      return "white"
    } else if (documentTitle.includes("yellow")) {
      return "yellow"
    }
  } else return "yellow";
  return "#000000";
}