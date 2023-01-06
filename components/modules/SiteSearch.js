import React, { useState } from 'react'
import { StyleSheet, } from 'react-native'
import { Searchbar, TextInput } from 'react-native-paper'

const SiteSearch = (props) => {

  const [ searchText, setSearchText] = useState("");

  const handleSearchSubmit = () => {
    console.log("Searching for:", searchText);
    props.navigation.navigate("SearchScreen", {
      query: searchText,
    })
    setSearchText("");
  }

  return (
    <Searchbar
      onChangeText={(text) => {setSearchText(text)}}
      onIconPress={() => { handleSearchSubmit() }}
      onSubmitEditing={() => { handleSearchSubmit() }}
      placeholder="Find shoes..."
      style={[styles.searchbar, {}]}
      value={searchText}
    />
  )
}

export default SiteSearch

const styles = StyleSheet.create({
  searchbar: {
    elevation: 2,
  },
})