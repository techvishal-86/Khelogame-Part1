import React from 'react';
import normalize from 'react-native-normalize';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { StyleSheet, Text, Alert, NetInfo, Picker, Image, Animated, Share, Button, Easing, View, RefreshControl, Clipboard, Linking, ToastAndroid, BackHandler, ScrollView, Switch, ProgressBarAndroid, TouchableOpacity, TextInput, Dimensions, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { height, mheight, mwidth, styles, width } from "../styles"

import { dataAPI } from './../Utils';

export default class OngoingScreen extends React.Component {
  state = {
    data: [],
    progress: true,
    refreshing: false
  }

  constructor(props) {
    super(props)
    this._emitter = this.props.screenProps.eventEmitter
  }

  async componentDidMount() {

    try {
      let response = await fetch(
        dataAPI + '/match',
      );
      let responseJson = await response.json();
      if (responseJson && responseJson.length) {
        responseJson.sort(function (a, b) {
          var c = new Date(a.time);
          var d = new Date(b.time);
          return c - d;
        });
        this.setState({ data: responseJson.reverse(), progress: false })
      }
    } catch (error) {
      console.error(error);
    }
    var items = []

    //   this.watch = this.watch.bind(this)
  }

  _onRefresh = () => {
    // this.setState({refreshing: true});
    //this.props.screenProps.eventEmitter.emit("reload")
    //this.setState({refreshing: false});

  }

  componentWillMount() {
    this._emitter.addListener('reloaded', () => {
      this.setState({ refreshing: false });
    })

    this._emitter.addListener('back', () => {
      console.log("ongoing back")
      // BackHandler.exitApp()
      // this block of code executes when 'eventName' is emitted
    });


  }
  watch(url) {
    try {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("Don't know how to open URI: " + this.props.url);
        }
      });
    }
    catch (error) {
      ToastAndroid.show("No Live Stream Available", ToastAndroid.SHORT)
    }

  }



  tConv24(time24) {
    var ts = time24;
    var H = +ts.substr(0, 2);
    var h = (H % 12) || 12;
    h = (h < 10) ? ("0" + h) : h;  // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
  }
  render() {
    const shadowOpt = {

      height: 220,
      width: 340,
      color: "#FF1B1B",
      border: 2,
      radius: 3,
      opacity: 1,
      x: 3,
      y: 7,
      style: { marginVertical: 5 }
    }
    var any = false
    this.state.data.map((obj) => {
      if (obj.status == "ONGOING") {
        any = true
      }
    })

    if (this.state.progress) {
      return (
        <View style={[styles.View, {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: this.props.screenProps.theme.bgcolor
        }]}>
          <AnimatedCircularProgress
            size={120}
            width={10}
            fill={100}
            tintColor={this.props.screenProps.theme.btncolor}
            onAnimationComplete={() => console.log('onAnimationComplete')}
            backgroundColor="#3d5875" />
        </View>
      )

    }
    else if (this.state.data.length > 0) {
      if (any) {
        const { width, heights } = Dimensions.get('window');
        return (
          <ScrollView refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh()}
            />
          } style={{ height: heights, backgroundColor: this.props.screenProps.theme.bgcolor }}>

            <View style={[styles.View, { backgroundColor: this.props.screenProps.theme.bgcolor }]}>

              {this.state.data.map((obj) => {
                if (obj.status == "ONGOING") {

                  try {
                    //2019-09-26T05:34:00.000Z

                    var d = obj.time.substring(0, obj.time.indexOf("T"))
                    var m = d.split("-")[1]
                    var da = d.split("-")[2]
                    var y = d.split("-")[0]
                    var date = da + "/" + m + "/" + y
                    var t = obj.time.substring(obj.time.indexOf("T") + 1, obj.time.length - 8)
                    var tt = new Date(obj.time).toLocaleTimeString()
                    tt = tt.substring(0, 5)
                    h = tt.substring(0, 2)
                    m = tt.substring(3, 5)
                    if (parseInt(h) > 12) {
                      nh = parseInt(h) - 12
                      tt = nh + ":" + m + " PM"
                    } else {
                      tt = tt + " AM"
                    }
                    var url = ""
                    if (obj.vidurl != undefined)
                      url = obj.vidurl
                    var dt = "Time: " + date + " at " + tt
                  }
                  catch (error) { var dt = "" }
                  //    this.setState({img:{uri:obj.image.url}})
                  let img = require('../assets/pubgtboys.jpeg')
                  try {
                    img = { uri: dataAPI + '/images/' + obj.image }

                    if (obj.image == undefined || obj.image == "")
                      img = require('../assets/pubgtboys.jpeg')
                  } catch (error) {

                  }
                  return (
                    <View style={{ marginBottom: 20 }}>

                      <View style={
                        styles.carditem}>
                        <Image source={img} defaultSource={require('../assets/pubgtboys.jpeg')} resizeMode="stretch" style={{ margin: 5, marginTop: 0, marginStart: 0, borderTopLeftRadius: 5, borderTopRightRadius: 5, width: normalize(340, 'width'), height: normalize(200, 'height') }} />


                        <Text style={{ color: "black", fontWeight: "bold", fontSize: 20, marginStart: 10, padding: 5 }}>{obj.name}</Text>

                        <View style={{ flexDirection: "row", marginStart: 10, alignItems: "center" }}>
                          <Icon name="clock-o" size={15} margin={2} color="black" style={{ padding: 4 }} />
                          <Text style={{ color: "black", fontSize: 15, padding: 4, marginStart: 3 }}>{dt}</Text>

                        </View>



                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>




                          <View style={{ flex: 1, justifyContent: 'flex-start', marginStart: 10 }}>
                            <View style={{ flexDirection: "row", marginStart: 5 }}>
                              <Text style={{ color: "black", fontFamily: "antonio_regular", fontSize: 15, padding: 4 }}>Per Kill:</Text>
                              <Text style={{ color: "black", fontFamily: "antonio_bold", fontSize: 15, padding: 4 }}>{obj.perkill}</Text>
                            </View>
                            <View style={{ flexDirection: "row", marginStart: 5 }}>
                              <Text style={{ color: "black", fontFamily: "antonio_regular", fontSize: 15, padding: 4 }}>Entry Fee:</Text>
                              <Text style={{ color: "black", fontFamily: "antonio_bold", fontSize: 15, padding: 4 }}>{obj.entryfee}</Text>
                            </View>

                            <View style={{ flexDirection: "row", marginStart: 5 }}>
                              <Text style={{ color: "black", fontFamily: "antonio_regular", fontSize: 15, padding: 4 }}>Third Rank:</Text>
                              <Text style={{ color: "black", fontFamily: "antonio_bold", fontSize: 15, padding: 4 }}>{obj.thirdposprize}</Text>
                            </View>
                          </View>

                          <View style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end', marginEnd: 10
                          }}>
                            <View style={{ flexDirection: "row", marginStart: 5 }}>
                              <Text style={{ color: "black", fontFamily: "antonio_regular", fontSize: 14, padding: 4 }}>Chicken Dinner:</Text>
                              <Text style={{ color: "black", fontFamily: "antonio_bold", fontSize: 15, padding: 4 }}>{obj.chickendinner}</Text>
                            </View>

                            <View style={{ flexDirection: "row", marginStart: 5 }}>
                              <Text style={{ color: "black", fontFamily: "antonio_regular", fontSize: 15, padding: 4 }}>Map</Text>
                              <Text style={{ color: "black", fontFamily: "antonio_bold", fontSize: 15, padding: 4 }}>{obj.map}</Text>
                            </View>
                            <View style={{ flexDirection: "row", marginStart: 5 }}>
                              <Text style={{ color: "black", fontFamily: "antonio_regular", fontSize: 15, padding: 4 }}>Runner Up:</Text>
                              <Text style={{ color: "black", fontFamily: "antonio_bold", fontSize: 15, padding: 4 }}>{obj.runnerupprize}</Text>
                            </View>
                          </View>
                          <View style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end', marginEnd: 10
                          }}>
                            <View style={{ flexDirection: "row", marginStart: 5 }}>
                              <Text style={{ color: "black", fontFamily: "antonio_regular", fontSize: 15, padding: 4 }}>Type:</Text>
                              <Text style={{ color: "black", fontFamily: "antonio_bold", fontSize: 15, padding: 4 }}>{obj.teamtype}</Text>
                            </View>
                            <View style={{ flexDirection: "row", marginStart: 5 }}>
                              <Text style={{ color: "black", fontFamily: "antonio_regular", fontSize: 15, padding: 4 }}>Mode:</Text>
                              <Text style={{ color: "black", fontFamily: "antonio_bold", fontSize: 15, padding: 4 }}>{obj.mode}</Text>
                            </View>
                            <View style={{ flexDirection: "row", marginStart: 5 }}>
                              <Text style={{ color: "black", fontFamily: "antonio_regular", fontSize: 15, padding: 4 }}>Highest Kill:</Text>
                              <Text style={{ color: "black", fontFamily: "antonio_bold", fontSize: 15, padding: 4 }}>{obj.highestkillprize}</Text>
                            </View>
                          </View>

                        </View>
                        <TouchableOpacity onPress={() => this.watch(url)} style={{ margin: 20, marginEnd: 8, alignSelf: "center" }}>
                          <View style={{ justifyContent: "center", backgroundColor: this.props.screenProps.theme.primaryColor, borderRadius: 2 }}>
                            <Text style={[styles.Text, { fontFamily: "antonio_regular", color: "white", width: normalize(80, 'width'), padding: 5, height: normalize(30, 'height'), alignSelf: "center", textAlign: "center" }]}>SPECTATE</Text>
                          </View>
                        </TouchableOpacity>


                      </View>

                    </View>

                  )

                }
              })
              }
            </View>
          </ScrollView>

        )
      } else {
        //wogoo
        return (

          <View style={[styles.View, { backgroundColor: this.props.screenProps.theme.bgcolor }]}>
            <Image source={this.props.screenProps.theme.noneimage} resizeMode="stretch" style={{ width: normalize(300, 'width'), height: normalize(400, 'height') }} />

            <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, textAlign: "center", padding: 5, fontWeight: "bold", fontSize: 20 }}>No Ongoing Matches</Text>
            <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, textAlign: "center", padding: 5, fontSize: 15 }}>There are no ongoing matches currently please check back in some time.</Text>

          </View>)
      }

    } else {
      return (

        <View style={[styles.View, { backgroundColor: this.props.screenProps.theme.bgcolor }]}>
          <Image source={this.props.screenProps.theme.noneimage} resizeMode="stretch" style={{ width: normalize(300, 'width'), height: normalize(400, 'height') }} />

          <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, textAlign: "center", padding: 5, fontWeight: "bold", fontSize: 20 }}>No Ongoing Matches</Text>
          <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, textAlign: "center", padding: 5, fontSize: 15 }}>There are no ongoing matches currently please check back in some time.</Text>

        </View>)

    }

  }
}
