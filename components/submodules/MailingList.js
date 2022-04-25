import React, { useState } from 'react'
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native'
import { Headline, IconButton, Subheading, Surface, TextInput, useTheme } from 'react-native-paper'

const MailingList = (props) => {

  const Dimensions = useWindowDimensions();
  const Theme = useTheme();
  const [ emailAddress, setEmailAddress ] = useState("");

  const handleSubscribeToMailingList = () => {
    setEmailAddress("");
  }

  return (
    <View style={[styles.flexDirectionRow, styles.flexWrap, styles.justifyContentSpaceBetween, {backgroundColor: Theme.colors.greyscale, padding: 20,}]}>
      <Surface 
        style={[
          styles.flexOne, 
          { 
            backgroundColor: Theme.colors.tertiary,
            borderRadius: Theme.roundness,
            minWidth: 300,
            paddingLeft: 20,
          }
        ]}
      >
        <View style={[styles.alignItemsCenter, styles.flexDirectionRow,]}>
          <Headline style={[styles.bold, {marginTop: 10,}]}>Get Our Newsletter.</Headline>
          <IconButton icon="email" onPress={() => {}} size={12} style={{margin: 0, padding: 0,}} />
        </View>
        <Subheading>Be the first to know about new styles.</Subheading>
        <View style={[styles.flexDirectionRow,]}>
          <Image
            source={{
              uri: "https://colorblockshoes-com.stackstaging.com/wp-content/uploads/mens-high-top-canvas-shoes-white-left-62223ca57fe6b.png",
            }}
            style={{
              height: 100,
              width: 100,
            }}
          />
          <View style={[styles.flexOne,]}>
            <TextInput
              activeOutlineColor={Theme.colors.colorblockYellowDark}
              activeUnderlineColor={Theme.colors.colorblockYellowDark}
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              left={<TextInput.Icon name="card-account-mail" onPress={() => {  }} />}
              label="E-Mail Address"
              onChangeText={(text) => { setEmailAddress(text); }}
              onSubmitEditing={() => { handleSubscribeToMailingList() }}
              outlineColor={Theme.colors.colorblockYellowDark}
              right={<TextInput.Icon name="chevron-right" onPress={() => { handleSubscribeToMailingList() }} />}
              style={{margin: 20,}}
              value={emailAddress}
            />
          </View>
        </View>
      </Surface>
    </View>
  )
}

export default MailingList

const styles = StyleSheet.create({
  alignItemsCenter: {
    alignItems: 'center',
  },
  bold: {
    fontWeight: "600",
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  flexOne: {
    flex: 1,
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  justifyContentSpaceBetween: {
    justifyContent: 'space-between',
  },
})