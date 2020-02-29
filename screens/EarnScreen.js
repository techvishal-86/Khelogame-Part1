import React from 'react';
import normalize from 'react-native-normalize';
import { StyleSheet, Text, Alert, NetInfo, Picker, Image, Animated, Share, Button, Easing, View, RefreshControl, Clipboard, Linking, ToastAndroid, BackHandler, ScrollView, Switch, ProgressBarAndroid, TouchableOpacity, TextInput, Dimensions, AsyncStorage } from 'react-native';
import { height, mheight, mwidth, styles, width } from "../styles"

import { dataAPI } from './../Utils';

export default class EarnScreen extends React.Component {
  state = {
    responseJson: {},
    p: undefined
  }
  async componentDidMount() {
    var email = ""
    var password = ""
    AsyncStorage.multiGet(['email', 'password']).then((data) => {
      email = data[0][1];
      password = data[1][1];

      //Your logic
    });
    try {
      let response = await fetch(
        dataAPI + '/player?key=YOYOHONEYSINGH&email=' + email.toLowerCase(),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
      responseJson = await response.json();
      this.setState({ responseJson: responseJson })
      responseJson.forEach((obj) => {
        if (email.toLowerCase() == obj.email.toLowerCase() && password == obj.password) {
          this.setState({ p: obj })
        }
      })
    }
    catch (error) { }
  }

  constructor(props) {
    super(props)
    this.copy = this.copy.bind(this)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    this._emitter = this.props.screenProps.eventEmitter
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

  }

  handleBackButtonClick = () => {
    this._emitter.emit("back")
    //ToastAndroid.show("Pressed",ToastAndroid.LONG)
    this.setState({ mode: "MENU" })
    return true
  }

  copy() {
    Clipboard.setString(this.state.p.name);
    ToastAndroid.show("Copied Code", ToastAndroid.SHORT)
  }

  share() {
    if (this.state.p.name.length > 0) {
      Share.share({ message: "Download app from this https://khelogame.net/khelogame.apk link and use '" + this.state.p.name.toString() + "' Refer code for signing up. So that you will get an instant bounus of 5 Coins after signing up.", title: "Khelo Game" })
        //after successful share return result
        .then(result => console.log(result))
        //If any thing goes wrong it comes here
        .catch(errorMsg => console.log(errorMsg));
    }

  }

  render() {

    if (!this.props.screenProps.logined) {
      return (
        <View style={[styles.View, { backgroundColor: this.props.screenProps.theme.bgcolor }]}>


          <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, fontWeight: "bold", width: normalize(350, 'width'), textAlign: "center", padding: 5, marginBottom: 10 }}>You Have Not Logged</Text>

          <TouchableOpacity style={{ height: normalize(30, 'height'), marginBottom: 20, width: width, marginTop: 20 }} onPress={() => { this.props.screenProps.logins() }}>
            <View style={{ backgroundColor: this.props.screenProps.theme.secondaryColor, elevation: 2, padding: 8, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

              <Text style={[styles.Text, { color: this.props.screenProps.theme.oppositetxtcolor, fontSize: 15, marginStart: 5, padding: 0, alignSelf: "center" }]}>Login</Text>
            </View>
          </TouchableOpacity>
        </View>)
    } else if (this.state.responseJson.length > 0) {

      if (this.state.p != undefined) {
        return (
          <ScrollView style={{ backgroundColor: this.props.screenProps.theme.bgcolor }}>

            <View style={[styles.View, { backgroundColor: this.props.screenProps.theme.bgcolor }]}>
              <Image source={require('../assets/referimg.png')} resizeMode="stretch" style={{ width: normalize(350, 'width'), height: normalize(400, 'height') }} />
              <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, fontWeight: "bold", width: normalize(350, 'width'), textAlign: "center", padding: 5, marginBottom: 10 }}>Share this refer code with your friends and ask them to use this when they Sign Up. You both will get a bonus of 5 coins!</Text>
              <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, fontWeight: "bold", fontSize: 20, backgroundColor: this.props.screenProps.theme.secondaryColor, height: normalize(50, 'height'), width: normalize(200, 'width'), borderRadius: 2, borderColor: this.props.screenProps.theme.borderColor, textAlign: "center", borderStyle: "dotted", padding: 5, borderWidth: 3 }}>{this.state.p.name}</Text>
              <View style={{ flexDirection: "row", alignSelf: "center", justifyContent: 'space-between', alignItems: 'center' }}>

                <TouchableOpacity onPress={() => this.copy()}>
                  <View style={{ margin: 15, justifyContent: "center", backgroundColor: this.props.screenProps.theme.btncolor, borderRadius: 2, height: normalize(30, 'height'), width: normalize(100, 'width') }}>
                    <Text style={[styles.Text, { color: "white", alignSelf: "center" }]}>COPY CODE</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.share()}>
                  <View style={{ margin: 15, justifyContent: "center", backgroundColor: this.props.screenProps.theme.btncolor, borderRadius: 2, height: normalize(30, 'height'), width: normalize(100, 'width') }}>
                    <Text style={[styles.Text, { color: "white", alignSelf: "center" }]}>SHARE CODE</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        );

      } else {
        return (
          <View style={[styles.View, { backgroundColor: this.props.screenProps.theme.bgcolor }]}>


            <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, fontWeight: "bold", width: normalize(350, 'width'), textAlign: "center", padding: 5, marginBottom: 10 }}>Error occured,try again later</Text>
          </View>
        );

      }
    } else {
      return (
        <View style={[styles.View, { backgroundColor: this.props.screenProps.theme.bgcolor }]}>


          <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, fontWeight: "bold", width: normalize(350, 'width'), textAlign: "center", padding: 5, marginBottom: 10 }}>Error occured,try again later</Text>
        </View>
      );

    }
  }
}
