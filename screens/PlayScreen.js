import React from 'react';
import normalize from 'react-native-normalize';
import Modal from "react-native-modal";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { StyleSheet, Text, Alert, NetInfo, Picker, Image, Animated, Share, Button, Easing, View, RefreshControl, Clipboard, Linking, ToastAndroid, BackHandler, ScrollView, Switch, ProgressBarAndroid, TouchableOpacity, TextInput, Dimensions, AsyncStorage, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import firebase from 'react-native-firebase';

import { dataAPI } from './../Utils';

import { height, mheight, mwidth, styles, width } from "../styles"

export default class PlayScreen extends React.Component {
  state = {
    data: [],
    balance: 0,
    spinAnim: new Animated.Value(0),
    pay: false,
    progress: true,
    email: "",
    mpid: "Not found",
    mcid: "Not found",
    refreshing: false,
    modalMessage: "",
    tlimit: "",
    mtime: "",
    isModalVisible: false,
    id: ""
  }
  _onRefresh = () => {
    // this.setState({refreshing: true});
    // this.props.screenProps.eventEmitter.emit("reload")
    // this.setState({refreshing: false});

  }
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  bbtn = () => {
    Alert.alert(
      'Exit App',
      'Exiting the application?', [{
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      }, {
        text: 'OK',
        onPress: () => BackHandler.exitApp()
      },], {
      cancelable: false
    }
    )
    return true;


  }
  componentWillMount() {
    this._emitter.addListener('reloaded', () => {


      this.setState({ refreshing: false });
      // this block of code executes when 'eventName' is emitted
    });
    this._emitter.addListener('back', () => {
      console.log("ongoing back")
      //  BackHandler.exitApp()

    })

    BackHandler.addEventListener('hardwareBackPress', this.bbtn);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.bbtn);
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
    var email = ""
    var password = ""
    AsyncStorage.multiGet(['email', 'password', 'pubgid', 'characterid']).then(async (data) => {
      email = data[0][1];
      password = data[1][1];


      this.setState({ email: email, mpid: data[2][1], mcid: data[3][1] })
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
            this.setState({ balance: obj.balance, id: obj._id, tlimit: obj.timeLimit })
            // this portion for notification
            this.notificationSection();
          }
        })
      }
      catch (error) { }
      //Your logic
    });
    Animated.loop(Animated.timing(
      this.state.spinAnim,
      {
        toValue: -100,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true
      }
    )).start(() => { this.setState({ spinAnim: new Animated.Value(0) }) });
    //this.props.screenProps.bbtn.bind(this)
  }


  constructor(props) {
    super(props)
    this.pay = this.pay.bind(this)
    this.toggleModal = this.toggleModal.bind(this)

    this.updateTime = this.updateTime.bind(this)
    this._emitter = this.props.screenProps.eventEmitter

    this._ls = this.props.screenProps.logins.bind(this)
  }
  async pay(entryfee, matchid, players, limit, tleft) {

    if (!this.state.progress) {

      var limitdate = new Date(this.state.tlimit)

      var frdate2 = new Date()
      var differenceTravel2 = limitdate.getTime() - frdate2.getTime();
      timelimitleft = Math.floor((differenceTravel2) / (1000));

      if (!this.props.screenProps.logined) {
        this._ls()
        return
      }
      var email = this.state.email
      console.log(tleft)
      if (tleft <= 0) {
        ToastAndroid.show("Time is up join another contest", ToastAndroid.LONG)
        return
      }

      if (this.state.id == undefined || this.state.id == "") {
        ToastAndroid.show("Login problem, please login again", ToastAndroid.SHORT)
        return
      }
      var h = Math.floor((differenceTravel2 / (1000 * 60 * 60)) % 24);


      /*if(h>0){
        ToastAndroid.show("You can join this contest after "+h+" hours",ToastAndroid.LONG)
        return
      }*/
      if (players.length < limit) {
        if (this.state.balance >= entryfee) {
          this.setState({ progress: true })
          const calculatedBal = this.state.balance - entryfee

          const refundBal = calculatedBal + entryfee
          if (players.filter(function (x) { x.player == email }).length > 0) {
            ToastAndroid.show("You have already joined this match", ToastAndroid.LONG)
          } else {
            var futurelimit = new Date()
            futurelimit.setHours(futurelimit.getHours() + 12);/*limit*/
            var futurelimitm = futurelimit.toISOString()

            try {
              fetch(dataAPI + '/player/' + this.state.id, {
                method: 'PUT',
                headers: {

                  'Content-Type': 'application/json',
                },
                body: '{"balance":' + '"' + calculatedBal + '","key":"YOYOHONEYSINGH","timelimit":' + '"' + futurelimitm + '"}',
              }).then(async (data) => {
                if (data.status == 200) {
                  try {
                    let response = await fetch(
                      dataAPI + '/player?key=YOYOHONEYSINGH&email=' + this.state.email.toLowerCase(),
                      {
                        method: 'GET',
                        headers: {
                          'Content-Type': 'application/json',
                        }
                      });
                    responseJson = await response.json();
                    responseJson.forEach(async (obj) => {

                      if (obj.email == this.state.email) {
                        //  alert("c"+calculatedBal+"b"+obj.balance)
                        if (calculatedBal == obj.balance) {
                          try {
                            try {
                              await fetch(dataAPI + '/match/' + matchid, {
                                method: 'PUT',
                                headers: {

                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ playername: this.state.email, key: "YOYOHONEYSINGH", pubgname: obj.name, characterid: obj.characterid }),
                              }).then(async (data) => {
                                this.setState({ progress: false })

                                try {
                                  if (data.status == 200) {



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
                                        this.setState({ data: responseJson.reverse() })
                                      }
                                    } catch (error) {
                                      console.error(error);
                                    }

                                    //                   this.props.screenProps.eventEmitter.emit("reload")
                                    ToastAndroid.show("Joined match successfully", ToastAndroid.LONG)


                                    this.setState({ progress: false })
                                  } else {

                                    ToastAndroid.show("Seats exhausted at last moment, you are being refunded", ToastAndroid.LONG)
                                    this.setState({ progress: true })
                                    fetch(dataAPI + '/player/' + this.state.id, {
                                      method: 'PUT',
                                      headers: {

                                        'Content-Type': 'application/json',
                                      },
                                      body: '{"balance":' + '"' + refundBal + '","key":"YOYOHONEYSINGH"}',
                                    }).then(async (data) => {

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
                                          this.setState({ data: responseJson.reverse() })
                                        }

                                      } catch (error) {
                                        console.error(error);
                                      }

                                      //  this.props.screenProps.eventEmitter.emit("reload")
                                    })

                                  }
                                } catch (e) {

                                  this.setState({ progress: false })

                                  ToastAndroid.show("Error: " + e, ToastAndroid.LONG)
                                }
                              })
                                .then((data) => {



                                });
                            } catch (error) {

                              this.setState({ progress: false })
                              ToastAndroid.show(String(error), ToastAndroid.LONG)
                            }



                          } catch (error) {

                            this.setState({ progress: false })
                            ToastAndroid.show(String(error), ToastAndroid.LONG)
                          }
                        }
                      }
                    })




                  } catch (error) {

                    this.setState({ progress: false })
                    ToastAndroid.show(String(error), ToastAndroid.LONG)
                  }





                } else {


                  ToastAndroid.show("Unknown error occured (PlayScreen)", ToastAndroid.LONG)
                }
              });
            } catch (error) {
              ToastAndroid.show(String(error), ToastAndroid.LONG)
            }
          }
        }
        else {

          ToastAndroid.show("Recharge your wallet please, You don't have enough balance", ToastAndroid.SHORT)


        }
      } else {

        ToastAndroid.show("Sorry you are late, all seats are booked", ToastAndroid.SHORT)


      }

    }
  }
  //  alert(""+entryfee)

  creds(id, pwd) {
    if (id == "" || pwd == "") {
      // alert("Credentials will be updated soon")
      this.setState({ modalMessage: "Credentials will be updated before 15 minutes of match" })
      this.toggleModal()
    } else {
      //alert("The credentials are : \n Room Id: "+id+"\n Room Password:"+pwd)
      this.setState({ modalMessage: "The credentials are : \n Room Id: " + id + "\n Room Password:" + pwd })
      this.toggleModal()
    }
  }

  successCallback() {
    ToastAndroid.show("Initialized Successfully", ToastAndroid.SHORT)
  }
  failureCallback() {
    ToastAndroid.show("Not Inititalized", ToastAndroid.SHORT)
  }

  tConv24(time24) {
    var ts = time24;
    var H = +ts.substr(0, 2);
    var h = (H % 12) || 12;
    h = (h < 10) ? ("0" + h) : h;  // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
    return time24.toLocaleTimeString();
  }


  updateTime(frdate) {
    this.setState({ mtime: frdate - new Date() })

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

    const shadowOpt2 = {

      height: 250,
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
      if (obj.status == "FUTRE") {
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

    else if (this.state.data.length > 0 && !this.state.pay) {

      if (any) {
        const { width, heights } = Dimensions.get('window');
        return (
          <ScrollView refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />} style={{ height: heights, backgroundColor: this.props.screenProps.theme.bgcolor }}>

            <Modal isVisible={this.state.isModalVisible}>
              <View style={{ alignItems: "center", alignSelf: "center", backgroundColor: this.props.screenProps.theme.secondaryColor, borderRadius: 5, width: normalize(300, 'width'), height: normalize(250, 'height') }}>
                <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, fontSize: 18, backgroundColor: this.props.screenProps.theme.dialogTitle, width: normalize(300, 'width'), textAlign: 'center', marginTop: 2, padding: 10 }}>Credentials</Text>

                <Text style={{ margin: 20, color: this.props.screenProps.theme.oppositetxtcolor, fontSize: 15, width: normalize(200, 'width'), textAlign: "center" }}>{this.state.modalMessage}</Text>
                <TouchableOpacity onPress={() => { this.toggleModal() }} style={{ margin: 15 }}>
                  <View style={{ margin: 20, justifyContent: "center", backgroundColor: this.props.screenProps.theme.primaryColor, borderRadius: 2, height: normalize(40, 'height'), width: normalize(80, 'width') }}>
                    <Text style={[styles.Text, { color: "white", alignSelf: "center" }]}>Ok</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Modal>
            <View style={[styles.View, { backgroundColor: this.props.screenProps.theme.bgcolor }]}>


              {this.state.data.map((obj) => {
                if (obj.status == "FUTRE") {

                  var totalSeconds = 0
                  var timelimitleft = 0
                  try {
                    //2019-09-26T05:34:00.000Z
                    var tls = ""
                    var tldate = new Date(obj.time)

                    var frdate = new Date()
                    var differenceTravel = tldate.getTime() - frdate.getTime();
                    totalSeconds = Math.floor((differenceTravel) / (1000));


                    //   ToastAndroid.show("Limit"+limitdate+" diff")
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
                    var dt = "Time: " + date + " at " + tt
                  }
                  catch (error) { var dt = "" }

                  var email = this.state.email
                  var participated = false
                  var me = obj.players.filter(function (p) { return p.player == email })
                  if (me.length > 0) {
                    participated = true
                  }

                  if (participated) {
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

                          <Text style={{ color: this.props.screenProps.theme.primaryColor, fontSize: 15, padding: 4, marginStart: 10, borderBottomColor: this.props.screenProps.theme.primaryColor, borderBottomWidth: 1 }}>Participated</Text>


                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>

                            <Text style={{ flex: 1, color: "black", fontWeight: "bold", fontSize: 20, marginStart: 10, padding: 5, marginBottom: 5 }}>{obj.name}</Text>

                            {/* <TimerCountdown
                         initialMilliseconds={totalSeconds*1000}
                         onTick={()=>{}}
                         onExpire={() => console.log("complete")}
                         formatMilliseconds={(milliseconds) => {
                           if(milliseconds<0){
                             return "Time Left: "+ 0 + 0 + 'm : ' + 0 + "s";                           
                           }
                           const remainingSec = Math.round(milliseconds / 1000);
                           const seconds = parseInt((remainingSec % 60).toString(), 10);
                           const minutes = parseInt(((remainingSec / 60) % 60).toString(), 10);
                           const hours = parseInt((remainingSec / 3600).toString(), 10);
                           const s = seconds < 10 ? '0' + seconds : seconds;
                           const m = minutes < 10 ? '0' + minutes : minutes;
                           let h = hours < 10 ? '0' + hours : hours;
                           h = h === '00' ? '' : h + 'h : ';
                           return "Time Left: "+h + m + 'm : ' + s + "s";
                         }}
                         allowFontScaling={true}
                         style={{ fontSize: 15,margin:20,marginBottom:5,backgroundColor:"green",color:"white",padding:8,borderRadius:4 }}
                       /> */}
                          </View>

                          <Text style={{ width: normalize(340, "width"), color: "black", fontWeight: "bold", fontSize: 20, textAlign: "center" }}>Total Prize:{obj.totalprize}</Text>


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
                          <TouchableOpacity onPress={() => this.creds(obj.roomid, obj.roompwd)} style={{ margin: 20, marginEnd: 8, alignSelf: "center" }}>

                            <View style={{ justifyContent: "center", backgroundColor: this.props.screenProps.theme.primaryColor, borderRadius: 2 }}>
                              <Text style={[styles.Text, { fontFamily: "antonio_regular", color: "white", width: normalize(150, 'width'), padding: 5, height: normalize(30, 'height'), alignSelf: "center", textAlign: "center" }]}>Get Room ID/Password</Text>
                            </View>
                          </TouchableOpacity>
                        </View>

                      </View>

                    )
                  } else {
                    var efee = 1000
                    try {
                      efee = obj.entryfee
                    } catch (error) {

                    }
                    let img = require('../assets/pubgtboys.jpeg')
                    try {
                      img = { uri: dataAPI + "/images/" + obj.image }

                      if (obj.image == undefined || obj.image == "")
                        img = require('../assets/pubgtboys.jpeg')
                    } catch (error) {

                    }
                    return (
                      <View style={{ marginBottom: 20 }}>

                        <View style={[
                          styles.carditem]}>
                          <Image source={img} defaultSource={require('../assets/pubgtboys.jpeg')} resizeMode="stretch" style={{ margin: 5, marginTop: 0, marginStart: 0, borderTopLeftRadius: 5, borderTopRightRadius: 5, width: normalize(340, 'width'), height: normalize(200, 'height') }} />

                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>

                            <Text style={{ flex: 1, color: "black", fontWeight: "bold", fontSize: 20, marginStart: 10, padding: 5, marginBottom: 5 }}>{obj.name}</Text>


                            {/* <TimerCountdown
                           initialMilliseconds={totalSeconds*1000}
                           onTick={()=>{}}
                           onExpire={() => console.log("complete")}
                           formatMilliseconds={(milliseconds) => {
                             if(milliseconds<0){
                               return "Time Left: "+ 0 + 0 + 'm : ' + 0 + "s";                           
                             }
                             const remainingSec = Math.round(milliseconds / 1000);
                             const seconds = parseInt((remainingSec % 60).toString(), 10);
                             const minutes = parseInt(((remainingSec / 60) % 60).toString(), 10);
                             const hours = parseInt((remainingSec / 3600).toString(), 10);
                             const s = seconds < 10 ? '0' + seconds : seconds;
                             const m = minutes < 10 ? '0' + minutes : minutes;
                             let h = hours < 10 ? '0' + hours : hours;
                             h = h === '00' ? '' : h + 'h : ';
                             return "Time Left: "+h + m + 'm : ' + s + "s";
                           }}
                           allowFontScaling={true}
                           style={{ fontSize: 15,margin:20,marginBottom:5,backgroundColor:"green",color:"white",padding:8,borderRadius:4 }}
                         />
                        */}
                          </View>



                          <Text style={{ width: normalize(340, "width"), color: "black", fontWeight: "bold", fontSize: 20, textAlign: "center" }}>Total Prize:{obj.totalprize}</Text>

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
                          <View style={{ flexDirection: "row", width: normalize(340, 'width'), justifyContent: "space-between", alignItems: 'center' }}>
                            <View style={{ flexDirection: "column" }}>
                              <ProgressBarAndroid style={{ margin: 15, width: normalize(200, 'width'), marginBottom: 0 }} color={this.props.screenProps.theme.primaryColor} styleAttr="Horizontal" progress={obj.players.length / obj.limit} indeterminate={false} />
                              <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
                                {
                                  (obj.limit - obj.players.length) <= 0 ?
                                    <Text style={{ color: "black", fontSize: 10, padding: 4, marginStart: 3 }}>Contest full, please join another</Text>
                                    : <Text style={{ color: "black", fontSize: 10, padding: 4, marginStart: 3 }}>Only {obj.limit - obj.players.length} spots left</Text>

                                }

                                <Text style={{ color: "black", fontSize: 10, padding: 4, marginStart: 3 }}>{obj.players.length}/{obj.limit}</Text>
                              </View>
                            </View>
                            <TouchableOpacity onPress={() => { this.pay(efee, obj._id, obj.players, obj.limit, totalSeconds) }} style={{ margin: 20, marginEnd: 15 }}>

                              <View style={{ justifyContent: "center", backgroundColor: this.props.screenProps.theme.primaryColor, borderRadius: 2 }}>
                                <Text style={[styles.Text, { fontFamily: "antonio_regular", color: "white", width: normalize(80, 'width'), padding: 5, height: normalize(30, 'height'), alignSelf: "center", textAlign: "center" }]}>JOIN</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>

                      </View>

                    )
                  }


                }

              })}
            </View>
          </ScrollView>

        )
      } else {


        return (

          <View style={[styles.View, { backgroundColor: this.props.screenProps.theme.bgcolor }]}>
            <Image source={this.props.screenProps.theme.noneimage} resizeMode="stretch" style={{ width: normalize(300, 'width'), height: normalize(400, 'height') }} />

            <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, textAlign: "center", padding: 5, fontWeight: "bold", fontSize: 20 }}>No Future Matches</Text>
            <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, textAlign: "center", padding: 5, fontSize: 15 }}>There are no future matches currently please check back in some time.</Text>

          </View>)

      }

    } else {



      //   return <ProgressBarAndroid style={{position: 'absolute', left: width/2, height: height/2, justifyContent:'center',alignItems:'center'}}/>  

      return (

        <View style={[styles.View, { backgroundColor: this.props.screenProps.theme.bgcolor }]}>
          <Image source={this.props.screenProps.theme.noneimage} resizeMode="stretch" style={{ width: normalize(300, 'width'), height: normalize(400, 'height') }} />

          <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, textAlign: "center", padding: 5, fontWeight: "bold", fontSize: 20 }}>No Future Matches</Text>
          <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, textAlign: "center", padding: 5, fontSize: 15 }}>There are no future matches currently please check back in some time.</Text>

        </View>
      )
    }

  }
}
