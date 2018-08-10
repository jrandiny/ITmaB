import React from 'react';
import {Alert, StatusBar, StyleSheet, Text,  Dimensions, AppRegistry, View, Image, TouchableOpacity, TextInput, Platform} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';

import myColor from "./color.js"
import dimens from "./dimensi.js"
import fileName from "./file.js"
import {mapSchema,poiSchema} from "./schema.js"

const lebarLayar = Dimensions.get('window').width;
const panjangLayar = Dimensions.get('window').height;

const Realm = require('realm');

function importDb(realm){
  //TODO import from json
  realm.write(() => {
    const obyek = realm.create('map',{
      id: 0,
      nama:"Peta utama",
      jenis:1,
      width:1725,
      height:3067,
      pointX:0,
      pointY:0});
    });
}

class MapView extends React.Component{
  moveMap(){
    this.refs.petaUtama.centerOn({ x: 100, y: 100, scale:2, duration:1000 });
  }

  render(){
    const mainMap = this.props.realm.objects("map").filtered("id = "+this.props.mapId);
    const mapTile = fileName[mainMap[0].id].file;

    let minScale = 0.5;

    if(mainMap[0].height > mainMap[0].width){
      minScale = panjangLayar / mainMap[0].height;
    }else {
      minScale = lebarLayar / mainMap[0].width;
    }

    return(
      <ImageZoom
        ref = "petaUtama"
        cropWidth  = {lebarLayar}
        cropHeight = {panjangLayar}
        imageWidth = {mainMap[0].width}
        imageHeight = {mainMap[0].height}
        minScale = {minScale}
        enableCenterFocus={false}
        style = {styles.mapArea}>
        <Image style={{width:mainMap[0].width, height:mainMap[0].height}}
          source={mapTile}/>
      </ImageZoom>
    );
  }
}

class SearchBox extends React.Component{
  render(){
    return(
      <View style={[styles.searchBar,styles.elevated]}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search here"
        />
      </View>
    );
  }
}

class FAB extends React.Component{
  render(){
    return(
      <TouchableOpacity onPress={this.props.onClickAction} style={[styles.fab,styles.elevated]}>
        <Image
          style={[styles.searchLogo]}
          source={{uri:'https://png.icons8.com/metro/1600/search.png'}}
        />
      </TouchableOpacity>

    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { realm: null};

    this.initDb();
  }

  initDb() {
    Realm.open({
      schema: [mapSchema,poiSchema]
    }).then(realm => {
      if(realm.objects("map").length<1){
        importDb(realm);
      }

      this.setState({ realm });
    });


  }

  render() {

    if(this.state.realm){
      return (
        <View style={styles.container}>
          <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0.3)"/>
          <SearchBox/>

          <MapView ref={instance => { this.mapChild = instance; }} mapId={0} realm={this.state.realm}/>

          <FAB onClickAction={()=>{this.mapChild.moveMap(); }}/>

        </View>
      );
    }else {
      return (
        <View style={styles.container}>
          <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0.3)"/>
          <SearchBox/>

          <FAB />
        </View>
      );
    }


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
    alignItems:'center',
    paddingTop:dimens.statusBarHeight
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
    flex:1,
    marginLeft:dimens.searchBar.textMargin
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
