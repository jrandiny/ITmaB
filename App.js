import React from 'react';
import {Alert, StyleSheet, Text,  Dimensions, AppRegistry, View, Image, TouchableOpacity, TextInput, Platform} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';

import myColor from "./color.js"
import dimens from "./dimensi.js"

const lebarLayar = Dimensions.get('window').width;
const panjangLayar = Dimensions.get('window').height;

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.searchBar,styles.elevated]}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search here"
          />
        </View>

        <ImageZoom
          cropWidth  = {lebarLayar}
          cropHeight = {panjangLayar}
          imageWidth = {500}
          imageHeight = {1000}
          minScale = {1}
          enableCenterFocus = {false}
          style = {styles.mapArea}>
          <Image style={{width:500, height:1000}}
            source={{uri:'https://picsum.photos/500/1000'}}/>
        </ImageZoom>

        <TouchableOpacity onPress={()=>{Alert.alert("test")}} style={[styles.fab,styles.elevated]}>
          <Image
            style={[styles.searchLogo]}
            source={{uri:'https://png.icons8.com/metro/1600/search.png'}}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapArea:{
    position:"absolute",
    top:0,
    left:0,
    zIndex:-999
  },
  container: {
    flex: 1,
    backgroundColor: myColor.appBg,
    flexDirection:'column',
    alignItems:'center'
  },
  fab: {
    backgroundColor:myColor.primary,
    position:'absolute',
    justifyContent:'center',
    alignItems: 'center',
    bottom:dimens.fab.margin,
    right:dimens.fab.margin,
    width:dimens.fab.size,
    height:dimens.fab.size,
    borderRadius:dimens.fab.size/2
  },
  elevated: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  searchLogo: {
    width:dimens.fab.iconSize,
    height:dimens.fab.iconSize
  },
  searchInput:{
    flex:1
  },
  searchBar: {
    top:dimens.searchBar.margin,
    width: lebarLayar-(2*dimens.searchBar.margin),
    height: dimens.searchBar.height,
    backgroundColor: myColor.appBg,
    flexDirection:"row",
    alignItems:"center"
  }
});
