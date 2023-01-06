import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { Divider, Headline, IconButton, Subheading, Text, useTheme, } from 'react-native-paper'
import Logo from '../icons/Logo'
import DownloadOnTheAppStore from '../icons/DownloadOnTheAppStore'
import GetItOnGooglePlay from '../icons/GetItOnGooglePlay'
import SiteSearch from '../modules/SiteSearch'
import MailingList from '../submodules/MailingList'

const Footer = (props) => {

  const isWebTrafficSecure = Platform.OS === "web" && location.protocol.includes("https") ? true : false;

  return (
    <View>
      <Divider />
      <MailingList />
      <Divider />
      <View
        style={[
          styles.flexDirectionRow, styles.flexWrap, styles.justifyContentSpaceBetween,
          { margin: 10, }
        ]}
      >
        <View style={{margin: 10, maxWidth: 350,}}>
          <View style={[styles.alignItemsCenter, styles.flexDirectionRow]}>
            <Logo size={20} navigation={props.navigation} route={props.route} />
            <Text style={{marginLeft: 5,}}>be good, make good choices.</Text>
          </View>
          <Headline style={[styles.bold]}>Colorblock Shoes™</Headline>
          <Text>Colorblock Shoes is the original source for multi-colored sneakers.</Text>
          <View style={{marginVertical: 10,}}>
            <SiteSearch navigation={props.navigation} route={props.route} />
          </View>
        </View>
        <View style={[styles.justifyContentFlexEnd, {margin: 10, maxWidth: 350,}]}>
          <Subheading style={[styles.bold]}>Shop</Subheading>
          <View style={{flexDirection: 'row',}}>
            <View style={{marginRight: 20,}}>
              <Text>All Shoes</Text>
              <Text>Women's Shoes</Text>
              <Text>Men's Shoes</Text>
              <Text>Black Shoes</Text>
              <Text>Blue Shoes</Text>
              <Text>Brown Shoes</Text>
              <Text>Green Shoes</Text>
            </View>
            <View>
              <Text>Grey Shoes</Text>
              <Text>Orange Shoes</Text>
              <Text>Pink Shoes</Text>
              <Text>Purple Shoes</Text>
              <Text>Red Shoes</Text>
              <Text>White Shoes</Text>
              <Text>Yellow Shoes</Text>
            </View>
          </View>
        </View>
        <View style={[styles.justifyContentFlexEnd, { margin: 10, maxWidth: 350, }]}>
          {
            Platform.OS === "web" ? (
              <View>
                {/* <View style={[styles.alignItemsCenter, styles.flexDirectionRow,]}>
                  <View style={{marginTop: 2, marginRight: 5,}}>
                    <DownloadOnTheAppStore width={120} height={40} />
                  </View>
                  <View style={{marginRight: 5,}}>
                    <GetItOnGooglePlay width={132} height={44} />
                  </View>
                </View> */}
                <View style={[styles.alignItemsCenter, styles.flexDirectionRow, {marginTop: 10,}]}>
                  <IconButton color={isWebTrafficSecure ? "green" : "red"} icon="shield" onPress={() => {}} size={14} style={{margin: 0, marginRight: 10, padding: 0,}} />
                  <Subheading style={{fontSize: 14}}>{isWebTrafficSecure ? "Secured with SSL" : "Not Secured with SSL"}</Subheading>
                </View>
              </View>
            ) : null
          }
          <View style={{marginTop: 10,}}>
            <View style={[styles.alignItemsCenter, styles.flexDirectionRow, styles.flexWrap,]}>
              <Text style={{fontSize: 12, marginRight: 10}}>Terms</Text>
              <Text style={{fontSize: 12, marginRight: 10}}>Privacy</Text>
              <Text style={{fontSize: 12, marginRight: 10}}>Cookies</Text>
              <Text style={{fontSize: 12, marginRight: 10,}}>Return Policy</Text>
            </View>
          </View>
        </View>
      </View>
      <Divider />
    </View>
  )
}

export default Footer

const styles = StyleSheet.create({
  alignItemsCenter: {
    alignItems: 'center',
  },
  alignItemsFlexEnd: {
    alignItems: 'flex-end',
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
  justifyContentFlexEnd: {
    justifyContent: 'flex-end'
  },
  justifyContentSpaceBetween: {
    justifyContent: 'space-between',
  },
})