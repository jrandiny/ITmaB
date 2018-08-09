import React from 'react';
import {Alert, StyleSheet, Text,  Dimensions, AppRegistry, View, Image, TouchableOpacity, TextInput} from 'react-native';

var widthScreen = Dimensions.get('window').width;

export default class App extends React.Component {
  render() {
    return (
        <View style={{flex: 1, flexDirection: 'column',alignItems: 'center'}}>
            <View style={[styles.searchBar,styles.elevationLow]}>
              <View style={{padding: 15}}>
                <TextInput
                  style={{height: 16, textColor : 'white'}}
                  placeholder="Search here"
                />
              </View>
          </View>
          <TouchableOpacity onPress={()=>{Alert.alert("test")}} style={[styles.bulat,styles.elevationLow,{backgroundColor:"lightblue"}]}>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection:'column'
  },
  bulat: {
    position:'absolute',
    justifyContent:'center',
    alignItems: 'center',
    bottom:20,
    right:20,
    width:70,
    height:70,
    borderRadius:35
  },
  elevationLow: {
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
    width:30,
    height:30
  },
  searchBar: {
    top:40,
    width: widthScreen-20,
    height: 40,
    backgroundColor: 'white'
  }
});
