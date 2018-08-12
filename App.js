import React from 'react';
import {Alert, StatusBar, TouchableHighlight,  TouchableNativeFeedback, FlatList, StyleSheet, Text,  Dimensions, AppRegistry, View, Image, TouchableOpacity, TextInput, Platform} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';

import myColor from "./color.js"
import dimens from "./dimensi.js"
import fileName from "./mapData/file.js"
import {mapSchema,poiSchema} from "./schema.js"

const lebarLayar = Dimensions.get('window').width;
const panjangLayar = Dimensions.get('window').height;

const Realm = require('realm');

function importDb(realm){
  const poiObj = require("./mapData/POI.json");
  for(i =0; i<poiObj.length;i++){
      realm.write(() => {
        realm.create('poi',{
          id : poiObj[i].id,
          nama : poiObj[i].nama,
          jenis : poiObj[i].jenis,
          gedung : poiObj[i].gedung,
          lantai : poiObj[i].lantai,
          deskripsi :poiObj[i].deskripsi,
          jambuka : poiObj[i].jambuka,
          jamtutup : poiObj[i].jamtutup,
          pointx : poiObj[i].pointx,
          pointy : poiObj[i].pointy,
          mapId : poiObj[i].mapId
      });
    });
  }

  const mapObj = require("./mapData/map.json");
  for(i =0; i<mapObj.length;i++){
      realm.write(() => {
        realm.create('map',{
          id : mapObj[i].id,
          nama : mapObj[i].nama,
          jenis : mapObj[i].jenis,
          width : mapObj[i].width,
          height : mapObj[i].height,
          pointX :mapObj[i].pointX,
          pointY : mapObj[i].pointY
      });
    });
  }
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
  constructor(props){
    super(props);
    this.state = {searchText:"",searchResults:null,query:null};
  }

  search(){
    let query = "nama CONTAINS '"+this.state.searchText+"'";
    let searchResults = this.props.realm.objects("poi").filtered(query);
    this.setState({searchResults:searchResults});
    this.setState({query:query});
  }

  render(){
    if(this.state.searchResults){
      var info = "";

      for(i=0;i<this.state.searchResults.length;i++){
        info = info + this.state.searchResults[i].id+" ";
      }

      return(
        <View>
          <View style={[styles.searchBar,styles.elevated]}>
            <TextInput
              onChangeText={(text)=>{this.setState({searchText:text});}}
              onSubmitEditing={()=>{this.search()}}
              style={styles.searchInput}
              placeholder="Search here"
            />
          </View>
          <View>
            <FlatList
              style={styles.searchList}
            data={this.state.searchResults}
            renderItem={({item}) =>
                    <TouchableNativeFeedback style={styles.item}>
                      <View>
                        <Text>{item.nama}</Text>
                      </View>
                    </TouchableNativeFeedback>}
            keyExtractor={(item, index) => item.id.toString()}
            />
          </View>
        </View>

      );
    }else{
      return(
        <View style={[styles.searchBar,styles.elevated]}>
          <TextInput
            onChangeText={(text)=>{this.setState({searchText:text});}}
            onSubmitEditing={()=>{this.search()}}
            style={styles.searchInput}
            placeholder="Search here"
          />
        </View>
      );
    }

  }
}

class FAB extends React.Component{
  render(){
    return(
      <View style={[styles.fab,styles.elevated]}>
        <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackgroundBorderless()} onPress={this.props.onClickAction}>
          <View style={styles.fabIn}>
            <Image
              style={[styles.searchLogo]}
              source={require("./res/search.png")}
            />
          </View>
        </TouchableNativeFeedback>
      </View>




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
          <SearchBox realm={this.state.realm}/>

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
  fabIn: {
    justifyContent:'center',
    alignItems: 'center',
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
    maxWidth:dimens.fab.iconSize,
    maxHeight:dimens.fab.iconSize
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
  },
  searchList:{
    top:dimens.searchBar.margin,
    backgroundColor:myColor.appBg,
    elevation:3,
    flexGrow:0,
    paddingBottom:dimens.searchBar.margin
  },
  item:{
    height:dimens.searchResult.itemHeight
  }
});
