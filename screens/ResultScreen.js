import React from 'react';
import normalize from 'react-native-normalize';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { StyleSheet, Text, Alert, NetInfo, Picker, Image, Animated, Share, Button, Easing, View, RefreshControl, Clipboard, Linking, ToastAndroid, BackHandler, ScrollView, Switch, ProgressBarAndroid, TouchableOpacity, TextInput, Dimensions, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { height, mheight, mwidth, styles, width } from "../styles"

import { dataAPI } from './../Utils';

export default class ResultScreen extends React.Component {
  state = {
    data: [],
    list: true,
    resultData: [],
    detail: false,
    match: {},
    players: [],
    refreshing: false,
    progress: true
  }
  _onRefresh = () => {
    //this.setState({refreshing: true});
    //this.props.screenProps.eventEmitter.emit("reload")
    // this.setState({refreshing: false})
  }

  constructor(props) {
    super(props)


    this.result = this.result.bind(this)

    this._emitter = this.props.screenProps.eventEmitter
  }
  async componentDidMount() {

    try {
      this.setState({ progress: true })
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

    try {
      this.setState({ progress: true })
      let response2 = await fetch(
        dataAPI + '/result',
      );
      let responseJson2 = await response2.json();

      this.setState({ resultData: responseJson2, progress: false })
    } catch (error) {
      console.error(error);
    }

    try {
      this.setState({ progress: true })
      let response = await fetch(
        dataAPI + '/player?key=YOYOHONEYSINGH',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
      responseJson = await response.json();
      this.setState({ players: responseJson, progress: false })

    } catch (error) {
      console.error(error);
    }
  }

  componentWillMount() {
    this.props.screenProps.eventEmitter.addListener('reloaded', () => {


      this.setState({ refreshing: false });
      // this block of code executes when 'eventName' is emitted
    });
    this._emitter.addListener('back', () => {
      console.log("result back")
      if (this.state.detail == false) {
        console.log(this.state.detail)
        BackHandler.exitApp()
        // return

      }

      if (this.state.detail == true) {
        // BackHandler.exitApp()
        console.log(this.state.detail)
        this.setState({ detail: false, list: true })
        //return

      }


      // this block of code executes when 'eventName' is emitted
    });
  }

  componentWillUnmount() {
    this._emitter.removeAllListeners();

  }
  result(match) {

    this.setState({ list: false, detail: true, match: match })
  }

  repeat(url) {
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
      ToastAndroid.show("No Repeat Video Available", ToastAndroid.SHORT)
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
      if (obj.status == "FINISHED") {
        any = true
      }
    })
    if (this.state.progress) {

      //   return <ProgressBarAndroid style={{position: 'absolute', left: width/2, height: height/2, justifyContent:'center',alignItems:'center'}}/>  

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
    else if (this.state.data.length > 0 && this.state.resultData.length > 0 && this.state.players.length > 0) {
      if (any) {
        const { width, heights } = Dimensions.get('window');
        if (this.state.list && !this.state.detail) {
          return (
            <ScrollView refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />} style={{ height: heights, backgroundColor: this.props.screenProps.theme.bgcolor }}>


              <View style={[styles.View, { backgroundColor: this.props.screenProps.theme.bgcolor }]}>

                {this.state.data.map((obj) => {
                  if (obj.status == "FINISHED") {
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
                    let img = require('../assets/pubgtboys.jpeg')
                    try {
                      img = { uri: dataAPI + "/images/" + obj.image }

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
                          <View style={{ flexDirection: "row", alignSelf: "center", justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => this.result(obj)} style={{ margin: 20, marginEnd: 8, alignSelf: "center" }}>
                              <View style={{ justifyContent: "center", backgroundColor: this.props.screenProps.theme.primaryColor, borderRadius: 2 }}>
                                <Text style={[styles.Text, { fontFamily: "antonio_regular", color: "white", width: normalize(80, 'width'), padding: 5, height: normalize(30, 'height'), alignSelf: "center", textAlign: "center" }]}>RESULTS</Text>
                              </View>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.repeat(url)} style={{ margin: 20, marginEnd: 8, alignSelf: "center" }}>
                              <View style={{ justifyContent: "center", backgroundColor: this.props.screenProps.theme.primaryColor, borderRadius: 2 }}>
                                <Text style={[styles.Text, { fontFamily: "antonio_regular", color: "white", width: normalize(80, 'width'), padding: 5, height: normalize(30, 'height'), alignSelf: "center", textAlign: "center" }]}>REPEAT</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>

                      </View>


                    )
                  }

                })}
              </View>
            </ScrollView>

          )
        } else if (this.state.detail && !this.state.list && this.state.match != {}) {
          var players = []
          this.state.resultData.map((obj) => {
            if (obj.mid == this.state.match._id) {
              players = obj.players
            }
          })
          try {
            //2019-09-26T05:34:00.000Z
            var d = this.state.match.time.substring(0, this.state.match.time.indexOf("T"))
            var m = d.split("-")[1]
            var da = d.split("-")[2]
            var y = d.split("-")[0]
            var date = da + "/" + m + "/" + y
            var t = this.state.match.time.substring(this.state.match.time.indexOf("T") + 1, this.state.match.time.length - 8)
            var tt = new Date(this.state.match.time).toLocaleTimeString()
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
            if (this.state.match.vidurl != undefined)
              url = this.state.match.vidurl
            var dt = "Time: " + date + " at " + tt
            var p1counter = 0;
            var p2counter = 0;
            var p3counter = 0;
            var hkills = 0
            var hkillcounter = 0
            players.map((p, i) => {

              if (p.priority == 1) {

                p1counter++

              } else if (p.priority == 2) {

                p2counter++


              } else if (p.priority == 3) {

                p3counter++

              }

              if (p.kills > hkills) {
                hkills = p.kills

              }

            })
            players.map((p, i) => {
              if (p.kills == hkills) {
                hkillcounter++
              }
            })
          } catch (error) { var dt = "" }
          //  if(p1counter>10000){

          return (
            <ScrollView style={{ height: heights, backgroundColor: this.props.screenProps.theme.bgcolor }}>
              <View style={[styles.View, { justifyContent: "flex-start", backgroundColor: this.props.screenProps.theme.bgcolor }]}>
                <View style={{ backgroundColor: "white", width: normalize(330, 'width'), alignItems: "center", elevation: 3, flex: 1 }}>
                  <Text style={{ color: "black", fontWeight: "bold", fontSize: 20, marginStart: 10, padding: 5 }}>{this.state.match.name}</Text>

                  <View style={{ flexDirection: "row", marginStart: 10, alignItems: "center" }}>
                    <Icon name="clock-o" size={15} margin={2} color="black" style={{ padding: 4 }} />
                    <Text style={{ color: "black", fontSize: 15, padding: 4, marginStart: 3 }}>{dt}</Text>

                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ flexDirection: "column", margin: 10, marginEnd: 30 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>ENTRY FEE</Text>
                      <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{this.state.match.entryfee}</Text>
                    </View>
                    <View style={{ flexDirection: "column", margin: 10, marginEnd: 30 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>PER KILL</Text>
                      <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{this.state.match.perkill}</Text>
                    </View>
                    <View style={{ flexDirection: "column", margin: 10 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>CHICKEN DINNER</Text>
                      <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{this.state.match.chickendinner}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ flexDirection: "column", margin: 10, marginEnd: 30 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>THIRD RANK</Text>
                      <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{this.state.match.thirdposprize}</Text>
                    </View>
                    <View style={{ flexDirection: "column", margin: 10, marginEnd: 30 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>RUNNER UP</Text>
                      <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{this.state.match.runnerupprize}</Text>
                    </View>
                    <View style={{ flexDirection: "column", margin: 10 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>HIGHEST KILL</Text>
                      <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{this.state.match.highestkillprize}</Text>
                    </View>
                  </View>
                </View>



                <View style={{ backgroundColor: "white", marginTop: 30, flex: 1, width: normalize(330, 'width'), alignItems: "center", elevation: 3 }}>
                  <Text style={[styles.Text, { color: "white", width: normalize(330, 'width'), backgroundColor: this.props.screenProps.theme.btncolor, textAlign: "center" }]}>CHICKEN DINNER</Text>
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ flexDirection: "column", margin: 10, marginEnd: 5 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: this.props.screenProps.theme.primaryColor, textAlign: "center" }}>#</Text>
                      {


                        players.map((p, i) => {

                          if (p.priority == 1) {

                            return (

                              <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{i + 1}</Text>

                            )
                          }
                        })
                      }


                    </View>
                    <View style={{ flexDirection: "column", margin: 10, marginEnd: 30 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: this.props.screenProps.theme.primaryColor, textAlign: "center" }}>NAME</Text>
                      {
                        players.map((p, i) => {
                          var mname = "Unknown"
                          this.state.players.map((o) => { if (o._id == p.player) { mname = o.name } })

                          if (p.priority == 1) {

                            return (

                              <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{mname}</Text>

                            )
                          }

                        })
                      }
                    </View>
                    <View style={{ flexDirection: "column", margin: 10 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: this.props.screenProps.theme.primaryColor, textAlign: "center" }}>KILLS</Text>
                      {
                        players.map((p, i) => {

                          if (p.priority == 1) {

                            return (

                              <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{p.kills}</Text>

                            )
                          }

                        })
                      }
                    </View>
                    <View style={{ flexDirection: "column", margin: 10 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: this.props.screenProps.theme.primaryColor, textAlign: "center" }}>WINNING</Text>

                      {


                        players.map((p, i) => {
                          var winning = p.kills * this.state.match.perkill
                          if (p.priority == 1)
                            winning = winning + (this.state.match.chickendinner / p1counter)

                          if (p.priority == 1) {

                            return (

                              <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{winning}</Text>

                            )
                          }

                        })
                      }
                    </View>
                  </View>
                </View>



                <View style={{ backgroundColor: "white", marginTop: 30, flex: 1, width: normalize(330, 'width'), alignItems: "center", elevation: 3 }}>
                  <Text style={[styles.Text, { color: "white", width: normalize(330, 'width'), backgroundColor: this.props.screenProps.theme.btncolor, textAlign: "center" }]}>RUNNERS UP</Text>

                  <View style={{ flexDirection: "row" }}>
                    <View style={{ flexDirection: "column", margin: 10, marginEnd: 30 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: this.props.screenProps.theme.primaryColor, textAlign: "center" }}>#</Text>
                      {
                        players.map((p, i) => {
                          if (p.priority == 2) {

                            return (

                              <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{i + 1}</Text>

                            )
                          }
                        })
                      }


                    </View>
                    <View style={{ flexDirection: "column", margin: 10, marginEnd: 30 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: this.props.screenProps.theme.primaryColor, textAlign: "center" }}>NAME</Text>
                      {
                        players.map((p, i) => {
                          var mname = "Unknown"
                          this.state.players.map((o) => { if (o._id == p.player) { mname = o.name } })

                          if (p.priority == 2) {

                            return (

                              <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{mname}</Text>

                            )
                          }

                        })
                      }
                    </View>
                    <View style={{ flexDirection: "column", margin: 10 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: this.props.screenProps.theme.primaryColor, textAlign: "center" }}>KILLS</Text>
                      {
                        players.map((p, i) => {

                          if (p.priority == 2) {

                            return (

                              <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{p.kills}</Text>

                            )
                          }

                        })
                      }
                    </View>
                    <View style={{ flexDirection: "column", margin: 10 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: this.props.screenProps.theme.primaryColor, textAlign: "center" }}>WINNING</Text>

                      {


                        players.map((p, i) => {
                          var winning = p.kills * this.state.match.perkill

                          if (p.priority == 2) {
                            winning = winning + (this.state.match.runnerupprize / p2counter)

                            return (

                              <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{winning}</Text>

                            )
                          }

                        })
                      }
                    </View>
                  </View>
                </View>


                <View style={{ backgroundColor: "white", marginTop: 30, flex: 1, width: normalize(330, 'width'), alignItems: "center", elevation: 3 }}>
                  <Text style={[styles.Text, { color: "white", width: normalize(330, 'width'), backgroundColor: this.props.screenProps.theme.btncolor, textAlign: "center" }]}>THIRD POSITION</Text>

                  <View style={{ flexDirection: "row" }}>
                    <View style={{ flexDirection: "column", margin: 10, marginEnd: 30 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: this.props.screenProps.theme.primaryColor, textAlign: "center" }}>#</Text>
                      {
                        players.map((p, i) => {
                          if (p.priority == 3) {

                            return (

                              <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{i + 1}</Text>

                            )
                          }
                        })
                      }


                    </View>
                    <View style={{ flexDirection: "column", margin: 10, marginEnd: 30 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: this.props.screenProps.theme.primaryColor, textAlign: "center" }}>NAME</Text>
                      {
                        players.map((p, i) => {
                          var mname = "Unknown"
                          this.state.players.map((o) => { if (o._id == p.player) { mname = o.name } })

                          if (p.priority == 3) {

                            return (

                              <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{mname}</Text>

                            )
                          }

                        })
                      }
                    </View>
                    <View style={{ flexDirection: "column", margin: 10 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: this.props.screenProps.theme.primaryColor, textAlign: "center" }}>KILLS</Text>
                      {
                        players.map((p, i) => {

                          if (p.priority == 3) {

                            return (

                              <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{p.kills}</Text>

                            )
                          }

                        })
                      }
                    </View>
                    <View style={{ flexDirection: "column", margin: 10 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: this.props.screenProps.theme.primaryColor, textAlign: "center" }}>WINNING</Text>

                      {


                        players.map((p, i) => {
                          var winning = p.kills * this.state.match.perkill

                          if (p.priority == 3) {

                            winning = winning + (this.state.match.thirdposprize / p3counter)
                            return (

                              <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{winning}</Text>

                            )
                          }

                        })
                      }
                    </View>
                  </View>
                </View>




                <View style={{ backgroundColor: "white", marginTop: 30, flex: 1, width: normalize(330, 'width'), alignItems: "center", elevation: 3 }}>
                  <Text style={[styles.Text, { color: "white", width: normalize(330, 'width'), backgroundColor: this.props.screenProps.theme.btncolor, textAlign: "center" }]}>HIGHEST KILL</Text>

                  <View style={{ flexDirection: "row" }}>
                    <View style={{ flexDirection: "column", margin: 10, marginEnd: 30 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: this.props.screenProps.theme.primaryColor, textAlign: "center" }}>#</Text>
                      {
                        players.map((p, i) => {
                          if (p.kills == hkills) {

                            return (

                              <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{i + 1}</Text>

                            )
                          }
                        })
                      }


                    </View>
                    <View style={{ flexDirection: "column", margin: 10, marginEnd: 30 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: this.props.screenProps.theme.primaryColor, textAlign: "center" }}>NAME</Text>
                      {
                        players.map((p, i) => {
                          var mname = "Unknown"
                          this.state.players.map((o) => { if (o._id == p.player) { mname = o.name } })

                          if (p.kills == hkills) {

                            return (

                              <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{mname}</Text>

                            )
                          }

                        })
                      }
                    </View>
                    <View style={{ flexDirection: "column", margin: 10 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: this.props.screenProps.theme.primaryColor, textAlign: "center" }}>KILLS</Text>
                      {
                        players.map((p, i) => {

                          if (p.kills == hkills) {

                            return (

                              <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{p.kills}</Text>

                            )
                          }

                        })
                      }
                    </View>
                    <View style={{ flexDirection: "column", margin: 10 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: this.props.screenProps.theme.primaryColor, textAlign: "center" }}>WINNING</Text>

                      {


                        players.map((p, i) => {
                          var winning = p.kills * this.state.match.perkill

                          if (p.kills == hkills) {
                            winning = winning + (this.state.match.highestkillprize / hkillcounter)
                            return (

                              <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{winning}</Text>

                            )
                          }

                        })
                      }
                    </View>
                  </View>
                </View>



                <View style={{ backgroundColor: "white", marginTop: 30, height: heights, width: normalize(330, 'width'), alignItems: "center", alignSelf: "center", elevation: 3 }}>
                  <Text style={[styles.Text, { color: "white", width: normalize(330, 'width'), backgroundColor: this.props.screenProps.theme.btncolor, textAlign: "center" }]}>OTHERS</Text>
                  <View style={{ flexDirection: "row", marginStart: 45, justifyContent: "space-evenly", width: width }}>
                    <View style={{ flexDirection: "column", margin: 10, marginEnd: 30 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: this.props.screenProps.theme.primaryColor, textAlign: "center" }}>#</Text>
                    </View>
                    <View style={{ flexDirection: "column", margin: 10, marginEnd: 30 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: this.props.screenProps.theme.primaryColor, textAlign: "center" }}>NAME</Text>
                    </View>
                    <View style={{ flexDirection: "column", margin: 10, marginEnd: 30 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: this.props.screenProps.theme.primaryColor, textAlign: "center" }}>KILLS</Text>
                    </View>
                    <View style={{ flexDirection: "column", margin: 10, marginEnd: 40 }}>
                      <Text style={{ fontFamily: "antonio_regular", color: this.props.screenProps.theme.primaryColor, textAlign: "center" }}>WINNING</Text>
                    </View>

                  </View>
                  <View style={{ height: heights, backgroundColor: "white", alignSelf: "center" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: normalize(330, 'width'), alignItems: "center" }}>
                      <View style={{ flexDirection: "column", margin: 10, marginEnd: 30 }}>
                        {
                          players.map((p, i) => {
                            if (p.priority > 3 || p.priority == 0) {

                              return (

                                <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{i + 1}</Text>

                              )
                            }
                          })
                        }


                      </View>
                      <View style={{ flexDirection: "column", margin: 10, marginEnd: 30 }}>
                        {
                          players.map((p, i) => {
                            var mname = "Unknown"
                            this.state.players.map((o) => { if (o._id == p.player) { mname = o.name } })

                            if (p.priority > 3 || p.priority == 0) {

                              return (

                                <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{mname.substring(0, 10)}</Text>

                              )
                            }

                          })
                        }
                      </View>
                      <View style={{ flexDirection: "column", margin: 10 }}>
                        {
                          players.map((p, i) => {

                            if (p.priority > 3 || p.priority == 0) {

                              return (

                                <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{p.kills}</Text>

                              )
                            }

                          })
                        }
                      </View>
                      <View style={{ flexDirection: "column", margin: 10, marginEnd: 45 }}>

                        {


                          players.map((p, i) => {
                            var winning = p.kills * this.state.match.perkill

                            if (p.priority > 3 || p.priority == 0) {

                              return (

                                <Text style={{ fontFamily: "antonio_regular", color: "black", textAlign: "center" }}>{winning}</Text>

                              )
                            }

                          })
                        }
                      </View>
                    </View>
                  </View>

                </View>
              </View>
            </ScrollView>

          )

          /*}else{
            return (
              <ScrollView style={{height:heights,backgroundColor:this.props.screenProps.theme.bgcolor}}>
              <View style={[styles.View,{justifyContent:"flex-start",backgroundColor:this.props.screenProps.theme.bgcolor}]}>
                  <View style={{backgroundColor:"white",height:150,width:330,alignItems:"center",elevation:3}}>
                      <Text style={{color:"black",fontWeight:"bold",fontSize:20,marginStart:10,padding:5}}>{this.state.match.name}</Text>
                         
                      <View style={{flexDirection:"row",marginStart:10,alignItems:"center"}}>
                      <Icon name="clock-o" size={15} margin={2} color="black" style={{padding:4}} />
                      <Text style={{color:"black",fontSize:15,padding:4,marginStart:3}}>{dt}</Text>
                     
                      </View>
                      <View style={{flexDirection:"row"}}>
                          <View style={{flexDirection:"column",margin:10,marginEnd:30}}>
                             <Text style={{fontFamily:"antonio_regular",color:"black",textAlign:"center"}}>ENTRY FEE</Text>
                             <Text style={{fontFamily:"antonio_regular",color:"black",textAlign:"center"}}>{this.state.match.entryfee}</Text>
                          </View>
                          <View style={{flexDirection:"column",margin:10,marginEnd:30}}>
                             <Text style={{fontFamily:"antonio_regular",color:"black",textAlign:"center"}}>PER KILL</Text>
                             <Text style={{fontFamily:"antonio_regular",color:"black",textAlign:"center"}}>{this.state.match.perkill}</Text>
                          </View>
                          <View style={{flexDirection:"column",margin:10}}>
                             <Text style={{fontFamily:"antonio_regular",color:"black",textAlign:"center"}}>CHICKEN DINNER</Text>
                             <Text style={{fontFamily:"antonio_regular",color:"black",textAlign:"center"}}>{this.state.match.chickendinner}</Text>
                          </View>
                      </View>
                  </View>
                
  
  
                  <View style={{backgroundColor:"white",marginTop:30,height:100,width:330,alignItems:"center",elevation:3}}>
                      <Text style={[styles.Text,{color:"white",width:330,backgroundColor:this.props.screenProps.theme.btncolor,textAlign:"center"}]}>CHICKEN DINNER</Text>
                      <View style={{flexDirection:"row"}}>
                          <View style={{flexDirection:"column",margin:10,marginEnd:30}}>
                             <Text style={{fontFamily:"antonio_regular",color:this.props.screenProps.theme.primaryColor,textAlign:"center"}}>#</Text>
                             {  
                                
  
                                players.map((p,i) => {
  
                                  if(p.priority==1){
  
                                    return (
  
                                      <Text style={{fontFamily:"antonio_regular",color:"black",textAlign:"center"}}>{i+1}</Text>
                  
                                    )
                                  }
                                })
                              }
                          
                            
                          </View>
                          <View style={{flexDirection:"column",margin:10,marginEnd:30}}>
                             <Text style={{fontFamily:"antonio_regular",color:this.props.screenProps.theme.primaryColor,textAlign:"center"}}>NAME</Text>
                             {  
                              players.map((p,i) => {
                                var mname = "Unknown"
                                this.state.players.map((o)=>{if(o._id==p.player){mname=o.name}})
                                
                                if(p.priority==1){
                                 
                                return (
  
                                  <Text style={{fontFamily:"antonio_regular",color:"black",textAlign:"center"}}>{mname}</Text>
              
                                )   
                                }
                                
                              })
                            }
                          </View>
                          <View style={{flexDirection:"column",margin:10}}>
                             <Text style={{fontFamily:"antonio_regular",color:this.props.screenProps.theme.primaryColor,textAlign:"center"}}>KILLS</Text>
                              {  
                              players.map((p,i) => {
                                
                                if(p.priority==1){
                                 
                                return (
  
                                  <Text style={{fontFamily:"antonio_regular",color:"black",textAlign:"center"}}>{p.kills}</Text>
               
                                 )   
                                }
                                
                              })
                            }
                          </View>
                          <View style={{flexDirection:"column",margin:10}}>
                          <Text style={{fontFamily:"antonio_regular",color:this.props.screenProps.theme.primaryColor,textAlign:"center"}}>WINNING</Text>
                          
                           {  
              
                            
                           players.map((p,i) => {
                             var winning = p.kills*this.state.match.perkill
                              if(p.priority==1)
                                winning=winning+this.state.match.chickendinner
                                
                                if(p.priority==1){
                                 
                             return (
  
                              <Text style={{fontFamily:"antonio_regular",color:"black",textAlign:"center"}}>{winning}</Text>
           
                             )   
                                }
                                
                           })
                         }
                       </View>
                      </View>
                  </View>
  
  
                  
                  <View style={{backgroundColor:"white",marginTop:30,height:100,width:330,alignItems:"center",elevation:3}}>
                      <Text style={[styles.Text,{color:"white",width:330,backgroundColor:this.props.screenProps.theme.btncolor,textAlign:"center"}]}>RUNNERS UP</Text>
                    
                      <View style={{flexDirection:"row"}}>
                          <View style={{flexDirection:"column",margin:10,marginEnd:30}}>
                             <Text style={{fontFamily:"antonio_regular",color:this.props.screenProps.theme.primaryColor,textAlign:"center"}}>#</Text>
                             {  
                                players.map((p,i) => {
                                  if(p.priority==2){
  
                                    return (
  
                                      <Text style={{fontFamily:"antonio_regular",color:"black",textAlign:"center"}}>{i+1}</Text>
                  
                                    )
                                  }
                                })
                              }
                          
                            
                          </View>
                          <View style={{flexDirection:"column",margin:10,marginEnd:30}}>
                             <Text style={{fontFamily:"antonio_regular",color:this.props.screenProps.theme.primaryColor,textAlign:"center"}}>NAME</Text>
                             {  
                              players.map((p,i) => {
                                var mname = "Unknown"
                                this.state.players.map((o)=>{if(o._id==p.player){mname=o.name}})
                                
                                if(p.priority==2){
                                 
                                return (
  
                                  <Text style={{fontFamily:"antonio_regular",color:"black",textAlign:"center"}}>{mname}</Text>
              
                                )   
                                }
                                
                              })
                            }
                          </View>
                          <View style={{flexDirection:"column",margin:10}}>
                             <Text style={{fontFamily:"antonio_regular",color:this.props.screenProps.theme.primaryColor,textAlign:"center"}}>KILLS</Text>
                              {  
                              players.map((p,i) => {
                                
                                if(p.priority==2){
                                 
                                return (
  
                                  <Text style={{fontFamily:"antonio_regular",color:"black",textAlign:"center"}}>{p.kills}</Text>
               
                                 )   
                                }
                                
                              })
                            }
                          </View>
                          <View style={{flexDirection:"column",margin:10}}>
                          <Text style={{fontFamily:"antonio_regular",color:this.props.screenProps.theme.primaryColor,textAlign:"center"}}>WINNING</Text>
                          
                           {  
              
                            
                           players.map((p,i) => {
                             var winning = p.kills*this.state.match.perkill
                                
                                if(p.priority==2){
                                 
                             return (
  
                              <Text style={{fontFamily:"antonio_regular",color:"black",textAlign:"center"}}>{winning}</Text>
           
                             )   
                                }
                                
                           })
                         }
                       </View>
                      </View>
                  </View>
  
  
                  
  
                  
                  <View style={{backgroundColor:"white",marginTop:30,height:heights,width:330,alignItems:"center",alignSelf:"center",elevation:3}}>
                      <Text style={[styles.Text,{color:"white",width:330,backgroundColor:this.props.screenProps.theme.btncolor,textAlign:"center"}]}>OTHERS</Text>
                      <View style={{flexDirection:"row",marginStart:45,justifyContent:"space-evenly",width:width}}>
                      <View style={{flexDirection:"column",margin:10,marginEnd:30}}>
                         <Text style={{fontFamily:"antonio_regular",color:this.props.screenProps.theme.primaryColor,textAlign:"center"}}>#</Text>
                     </View>
                     <View style={{flexDirection:"column",margin:10,marginEnd:30}}>
                         <Text style={{fontFamily:"antonio_regular",color:this.props.screenProps.theme.primaryColor,textAlign:"center"}}>NAME</Text>
                     </View>
                     <View style={{flexDirection:"column",margin:10,marginEnd:30}}>
                         <Text style={{fontFamily:"antonio_regular",color:this.props.screenProps.theme.primaryColor,textAlign:"center"}}>KILLS</Text>
                     </View>
                     <View style={{flexDirection:"column",margin:10,marginEnd:40}}>
                         <Text style={{fontFamily:"antonio_regular",color:this.props.screenProps.theme.primaryColor,textAlign:"center"}}>WINNING</Text>
                     </View>
                     
                     </View>  
                      <View style={{height:heights,backgroundColor:"white",alignSelf:"center"}}>
                      <View style={{flexDirection:"row",justifyContent:"space-evenly",width:330,alignItems:"center"}}>
                          <View style={{flexDirection:"column",margin:10,marginEnd:30}}>
                            {  
                                players.map((p,i) => {
                                  if(p.priority>3 || p.priority==0){
  
                                    return (
  
                                      <Text style={{fontFamily:"antonio_regular",color:"black",textAlign:"center"}}>{i+1}</Text>
                  
                                    )
                                  }
                                })
                              }
                          
                            
                          </View>
                          <View style={{flexDirection:"column",margin:10,marginEnd:30}}>
                             {  
                              players.map((p,i) => {
                                var mname = "Unknown"
                                this.state.players.map((o)=>{if(o._id==p.player){mname=o.name}})
                                
                                if(p.priority>3|| p.priority==0){
                                 
                                return (
  
                                  <Text style={{fontFamily:"antonio_regular",color:"black",textAlign:"center"}}>{mname.substring(0,10)}</Text>
              
                                )   
                                }
                                
                              })
                            }
                          </View>
                          <View style={{flexDirection:"column",margin:10}}>
                              {  
                              players.map((p,i) => {
                                
                                if(p.priority>3|| p.priority==0){
                                 
                                return (
  
                                  <Text style={{fontFamily:"antonio_regular",color:"black",textAlign:"center"}}>{p.kills}</Text>
               
                                 )   
                                }
                                
                              })
                            }
                          </View>
                          <View style={{flexDirection:"column",margin:10,marginEnd:45}}>
                          
                           {  
              
                            
                           players.map((p,i) => {
                            var winning = p.kills*this.state.match.perkill
                                
                                if(p.priority>3|| p.priority==0){
                                 
                             return (
  
                              <Text style={{fontFamily:"antonio_regular",color:"black",textAlign:"center"}}>{winning}</Text>
           
                             )   
                                }
                                
                           })
                         }
                       </View>
                      </View>
                      </View>
                      
                  </View>
                  </View>
              </ScrollView>
  
            )
         
          }*/
        } else {
          return (

            <View style={[styles.View, { backgroundColor: this.props.screenProps.theme.bgcolor }]}>
              <Image source={this.props.screenProps.theme.noneimage} resizeMode="stretch" style={{ width: normalize(300, 'width'), height: normalize(400, 'height') }} />

              <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, textAlign: "center", padding: 5, fontWeight: "bold", fontSize: 20 }}>No Results</Text>
              <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, textAlign: "center", padding: 5, fontSize: 15 }}>There are no results currently please check back in some time.</Text>

            </View>)
        }



      } else {
        return (

          <View style={[styles.View, { backgroundColor: this.props.screenProps.theme.bgcolor }]}>
            <Image source={this.props.screenProps.theme.noneimage} resizeMode="stretch" style={{ width: normalize(300, 'width'), height: normalize(400, 'height') }} />

            <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, textAlign: "center", padding: 5, fontWeight: "bold", fontSize: 20 }}>No Results</Text>
            <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, textAlign: "center", padding: 5, fontSize: 15 }}>There are no results currently please check back in some time.</Text>

          </View>
        )

      }
    } else {
      return (

        <View style={[styles.View, { backgroundColor: this.props.screenProps.theme.bgcolor }]}>
          <Image source={this.props.screenProps.theme.noneimage} resizeMode="stretch" style={{ width: normalize(300, 'width'), height: normalize(400, 'height') }} />

          <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, textAlign: "center", padding: 5, fontWeight: "bold", fontSize: 20 }}>No Results</Text>
          <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, textAlign: "center", padding: 5, fontSize: 15 }}>There are no results currently please check back in some time.</Text>

        </View>
      )

    }

  }
}


