import React from 'react';
import normalize from 'react-native-normalize';
import Reinput from 'reinput'
import Modal from "react-native-modal";
import { StyleSheet, Text, Alert, NetInfo, Picker, Image, Animated, Share, Button, Easing, View, RefreshControl, Clipboard, Linking, ToastAndroid, BackHandler, ScrollView, Switch, ProgressBarAndroid, TouchableOpacity, TextInput, Dimensions, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import Razorpay from "./Razorpay"

import { height, mheight, mwidth, styles, width } from "../styles"
import { dataAPI } from './../Utils';
import { NavigationEvents } from 'react-navigation';

export default class ProfileScreen extends React.Component {
  state = {
    mode: "MENU",
    extras: [],
    about: "",
    isChangePWDVisible: false,
    confirmpwd: "",
    newpwd: "",
    cpwd: "",
    pdata: {},
    femail: "",
    darkmode: false,
    pid: "Not found",
    isStateModalVisible: false,
    isDobModalVisible: false,
    cid: "Not found",
    state: "None",
    dob: "None",
    id: ""
  }

  toggleTheme() {
    /*
        if(this.state.darkmode==false){
          
          this.props.screenProps.eventEmitter.emit('darkmode');
        }else{
          this.props.screenProps.eventEmitter.emit('lightmode');
        }*/
    if (this.state.darkmode) {

      AsyncStorage.multiSet([
        ["darkmode", "false"]
      ])
    } else {
      AsyncStorage.multiSet([
        ["darkmode", "true"]
      ])
    }
    this.setState({ darkmode: !this.state.darkmode })
    ToastAndroid.show("Restart app to see changes", ToastAndroid.SHORT)
  }
  constructor(props) {
    super(props)


    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.about = this.about.bind(this)
    this.toggleTheme = this.toggleTheme.bind(this)
    this.reload = this.reload.bind(this)
    this._emitter = this.props.screenProps.eventEmitter
  }

  async componentDidMount() {
    this.reload()
    var id = ""
    AsyncStorage.multiGet(['email', 'darkmode', 'pubgid', 'characterid', 'state', 'dob']).then((data) => {
      mdarkmode = data[1][1]
      if (mdarkmode == "true") {
        this.setState({ darkmode: true })
      }
      else
        this.setState({ darkmode: false })


      this.setState({ pid: data[2][1], cid: data[3][1], state: data[4][1], dob: data[5][1], femail: data[5][1] })

      if (this.state.state == "" || !this.state.state) {
        this.setState({ state: "None" })
      }
      if (this.state.dob == "" || !this.state.dob) {
        this.setState({ dob: "None" })
      }


      if (this.state.femail == "" || !this.state.femail) {
        this.setState({ femail: "None" })
      }



      id = data[0][1]
    });

    try {
      let response22 = await fetch(
        dataAPI + '/player?key=YOYOHONEYSINGH&email=' + id.toLowerCase(),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
      responseJson22 = await response22.json();
      responseJson22.forEach((obj) => {
        if (id.toLowerCase() == obj.email.toLowerCase()) {
          this.setState({ id: obj._id, pid: obj.name, cid: obj.characterid })
        }
      })
    }
    catch (error) { }

  }
  componentWillMount() {
    this._emitter.addListener('back', () => {
      //   console.log("ongoing back")
      if (this.state.mode != "ABOUT") {
        //  BackHandler.exitApp()
        //  BackHandler.exitApp()
      } else {

        this.setState({ mode: "MENU" })
        return true
      }
      // this block of code executes when 'eventName' is emitted
    });
    BackHandler.addEventListener('hardwareBackPress', () => { });

  }

  componentWillUnmount() {
    this._emitter.removeAllListeners();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  openStateDialog() {
    this.setState({ isStateModalVisible: true })
  }

  openDobDialog() {
    this.setState({ isDobModalVisible: true })
  }
  handleBackButtonClick = () => {
    //ToastAndroid.show("Pressed",ToastAndroid.LONG)
    try {

      this.setState({ detail: false, list: true })

    } catch (e) {

    }
    try {


      this.setState({ mode: "MENU" })

    } catch (e) {

    }
    return true
  }


  async reload() {
    try {
      let response = await fetch(
        dataAPI + '/extras',
      );
      responseJson = await response.json();
      this.setState({ extras: responseJson })
      if (this.state.extras.length > 0) {

        this.setState({ about: this.state.extras[0].about })
      }
    } catch (error) {
      console.error(error);
    }
  }
  contact() {
    if (this.state.extras.length > 0) {

      Linking.openURL('mailto:' + this.state.extras[0].conatctemail)
    }
  }

  about() {
    this.setState({ about: true })

  }
  share() {
    if (this.state.extras.length > 0) {

      Linking.openURL(this.state.extras[0].sharelink)
    }
  }

  logout() {
    AsyncStorage.multiSet([
      ["email", ""],
      ["password", ""],
      ["dob", ""],
      ["state", ""],
      ["fcmToken", ""],
    ])
    this.props.screenProps.logouts()
  }

  saveDOBData(obj) {
    obj.key = "YOYOHONEYSINGH"

    try {
      fetch(dataAPI + '/player/' + this.state.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      }).then(async (data) => {
        if (data.status == 200) {
          AsyncStorage.multiSet([
            ["dob", obj.dob]])
          this.setState({ dob: obj.dob })
          ToastAndroid.show("Saved", ToastAndroid.LONG)
        } else {
          ToastAndroid.show("Not saved" + data.message + data.status, ToastAndroid.LONG)
        }
        this.setState({ isDobModalVisible: false })
      })

    } catch (e) {
      ToastAndroid.show("Not Saved" + e, ToastAndroid.LONG)
      this.setState({ isDobModalVisible: false })
    }
  }


  savePassword(pwd, cpwd) {
    if (!(pwd == cpwd)) {
      ToastAndroid.show("Password does not match", ToastAndroid.SHORT)
      return
    }
    var obj = {}
    obj.key = "YOYOHONEYSINGH"
    obj.password = pwd
    try {
      fetch(dataAPI + '/player/' + this.state.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      }).then(async (data) => {
        if (data.status == 200) {
          AsyncStorage.multiSet([
            ["password", obj.password]])
          ToastAndroid.show("Password Changed", ToastAndroid.LONG)
        } else {
          ToastAndroid.show("Password Not Changed", ToastAndroid.LONG)
        }
        this.setState({ isChangePWDModalVisible: false })
      })

    } catch (e) {
      ToastAndroid.show("Password Changed" + e, ToastAndroid.LONG)
      this.setState({ isChangePWDModalVisible: false })
    }
  }

  saveData(obj) {
    obj.key = "YOYOHONEYSINGH"

    try {
      fetch(dataAPI + '/player/' + this.state.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      }).then(async (data) => {
        if (data.status == 200) {
          AsyncStorage.multiSet([
            ["state", obj.state]])
          ToastAndroid.show("Saved", ToastAndroid.LONG)
        } else {
          ToastAndroid.show("Not saved", ToastAndroid.LONG)
        }
        this.setState({ isStateModalVisible: false })
      })

    } catch (e) {
      ToastAndroid.show("Not Saved" + e, ToastAndroid.LONG)
      this.setState({ isStateModalVisible: false })
    }
  }

  render() {

    const { width, heights } = Dimensions.get('window');
    if (!this.props.screenProps.logined) {
      return (
        <View style={[styles.View, { backgroundColor: this.props.screenProps.theme.bgcolor }]}>

<Razorpay/>
          <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, fontWeight: "bold", width: normalize(350, 'width'), textAlign: "center", padding: 5, marginBottom: 10 }}>You Have Not Logged</Text>

          <TouchableOpacity style={{ height: normalize(30, 'height'), marginBottom: 5, width: width, marginTop: 3 }} onPress={() => { this.props.screenProps.logins() }}>
            <View style={{ backgroundColor: this.props.screenProps.theme.secondaryColor, elevation: 2, padding: 8, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

              <Text style={[styles.Text, { color: this.props.screenProps.theme.oppositetxtcolor, fontSize: 15, marginStart: 5, padding: 0, alignSelf: "center" }]}>Login</Text>
            </View>
          </TouchableOpacity>
        </View>)
    }
    else if (this.state.mode == "MENU") {
      return (
        <ScrollView style={{ backgroundColor: this.props.screenProps.theme.bgcolor }}>

          <View style={[styles.View, { justifyContent: 'flex-start', backgroundColor: this.props.screenProps.theme.bgcolor }]}>

            <Modal isVisible={this.state.isStateModalVisible}>
              <View style={{ alignItems: "center", alignSelf: "center", backgroundColor: this.props.screenProps.theme.secondaryColor, borderRadius: 5, width: normalize(300, 'width'), height: normalize(200, 'height') }}>
                <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, fontSize: 18, backgroundColor: this.props.screenProps.theme.dialogTitle, width: normalize(300, 'width'), textAlign: 'center', marginTop: 2, padding: 10 }}>Select your state</Text>


                <Picker
                  selectedValue={this.state.state}
                  style={{ height: normalize(50, 'height'), width: normalize(250, 'width') }}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({ state: itemValue })
                  }}>

                  <Picker.Item label="None" value="None" />

                  <Picker.Item label="Andaman and Nicobar Islands" value="Andaman and Nicobar Islands" />
                  <Picker.Item label="Andhra Pradesh" value="Andhra Pradesh" />
                  <Picker.Item label="Arunachal Pradesh" value="Arunachal Pradesh" />
                  <Picker.Item label="Assam" value="Assam" />
                  <Picker.Item label="Bihar" value="Bihar" />
                  <Picker.Item label="Chandigarh" value="Chandigarh" />
                  <Picker.Item label="Chhattisgarh" value="Chhattisgarh" />
                  <Picker.Item label="Dadra and Nagar Haveli" value="Dadra and Nagar Haveli" />
                  <Picker.Item label="Daman and Diu" value="Daman and Diu" />
                  <Picker.Item label="National Capital Territory of Delhi" value="National Capital Territory of Delhi" />
                  <Picker.Item label="Goa" value="Goa" />
                  <Picker.Item label="Gujarat" value="Gujarat" />
                  <Picker.Item label="Haryana" value="Haryana" />
                  <Picker.Item label="Himachal Pradesh" value="Himachal Pradesh" />
                  <Picker.Item label="Jammu and Kashmir" value="Jammu and Kashmir" />
                  <Picker.Item label="Jharkhand" value="Jharkhand" />
                  <Picker.Item label="Karnataka" value="Karnataka" />
                  <Picker.Item label="Kerala" value="Kerala" />
                  <Picker.Item label="Ladakh" value="Ladakh" />

                  <Picker.Item label="Lakshadweep" value="Lakshadweep" />
                  <Picker.Item label="Madhya Pradesh" value="Madhya Pradesh" />
                  <Picker.Item label="Maharashtra" value="Maharashtra" />

                  <Picker.Item label="Manipur" value="Manipur" />
                  <Picker.Item label="Meghalaya" value="Meghalaya" />
                  <Picker.Item label="Mizoram" value="Mizoram" />
                  <Picker.Item label="Nagaland" value="Nagaland" />
                  <Picker.Item label="Odisha" value="Odisha" />
                  <Picker.Item label="Puducherry" value="Puducherry" />
                  <Picker.Item label="Punjab" value="Punjab" />
                  <Picker.Item label="Rajasthan" value="Rajasthan" />
                  <Picker.Item label="Sikkim" value="Sikkim" />
                  <Picker.Item label="Tamil Nadu" value="Tamil Nadu" />
                  <Picker.Item label="Telangana" value="Telangana" />
                  <Picker.Item label="Tripura" value="Tripura" />
                  <Picker.Item label="Uttar Pradesh" value="Uttar Pradesh" />
                  <Picker.Item label="Uttarakhand" value="Uttarakhand" />
                  <Picker.Item label="West Bengal" value="West Bengal" />
                </Picker>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => { this.saveData({ state: this.state.state }) }}>
                    <View style={{ margin: 20, justifyContent: "center", backgroundColor: this.props.screenProps.theme.primaryColor, borderRadius: 2, height: normalize(40, 'height'), width: 80 }}>
                      <Text style={[styles.Text, { color: "white", alignSelf: "center" }]}>Save</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { this.setState({ isStateModalVisible: false }) }}>
                    <View style={{ margin: 20, justifyContent: "center", borderWidth: 1, borderColor: this.props.screenProps.theme.primaryColor, backgroundColor: "white", borderRadius: 2, height: normalize(40, 'height'), width: normalize(80, 'width') }}>
                      <Text style={[styles.Text, { color: this.props.screenProps.theme.primaryColor, alignSelf: "center" }]}>Cancel</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <Modal isVisible={this.state.isDobModalVisible}>
              <View style={{ alignItems: "center", alignSelf: "center", backgroundColor: this.props.screenProps.theme.secondaryColor, borderRadius: 5, width: normalize(300, 'width'), height: normalize(200, 'height') }}>
                <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, fontSize: 18, backgroundColor: this.props.screenProps.theme.dialogTitle, width: normalize(300, 'width'), textAlign: 'center', marginTop: 2, padding: 10 }}>Enter your Date Of Birth</Text>


                <Reinput
                  style={{ height: normalize(40, 'height'), marginTop: 5, backgroundColor: this.props.screenProps.theme.secondaryColor, width: normalize(200, 'width'), textAlign: "center", borderBottomWidth: 2, borderColor: this.props.screenProps.theme.primaryColor, paddingBottom: 10 }}
                  label="DD/MM/YYYY"
                  keyboardType='numeric'
                  labelcolor={this.props.screenProps.theme.btncolor}
                  labelActiveColor={this.props.screenProps.theme.primaryColor}
                  placeholderColor={this.props.screenProps.theme.primaryColor}
                  color={this.props.screenProps.theme.oppositetxtcolor}
                  activeColor={this.props.screenProps.theme.oppositetxtcolor}
                  onChangeText={(femail) => {

                    var x = femail
                    if (femail.length != this.state.femail - 1) {
                      if (femail.length == 2 || femail.length == 5) {
                        x = femail + '/'
                      }
                    }


                    this.setState({ femail: x })
                  }}
                  value={this.state.femail}
                />
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => { this.saveDOBData({ dob: this.state.femail }) }}>
                    <View style={{ margin: 20, justifyContent: "center", backgroundColor: this.props.screenProps.theme.primaryColor, borderRadius: 2, height: normalize(40, 'height'), width: normalize(80, 'width') }}>
                      <Text style={[styles.Text, { color: "white", alignSelf: "center" }]}>Save</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { this.setState({ isDobModalVisible: false }) }}>
                    <View style={{ margin: 20, justifyContent: "center", borderWidth: 1, borderColor: this.props.screenProps.theme.primaryColor, backgroundColor: "white", borderRadius: 2, height: normalize(40, 'height'), width: normalize(80, 'width') }}>
                      <Text style={[styles.Text, { color: this.props.screenProps.theme.primaryColor, alignSelf: "center" }]}>Cancel</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>


            <Modal isVisible={this.state.isChangePWDVisible}>
              <View style={{ alignItems: "center", alignSelf: "center", backgroundColor: this.props.screenProps.theme.secondaryColor, borderRadius: 5, width: normalize(300, 'width'), height: normalize(200, 'height') }}>
                <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, fontSize: 18, backgroundColor: this.props.screenProps.theme.dialogTitle, width: normalize(300, 'width'), textAlign: 'center', marginTop: 2, padding: 10 }}>Change Password</Text>

                <Reinput
                  style={{ height: normalize(40, 'height'), marginTop: 5, backgroundColor: this.props.screenProps.theme.secondaryColor, width: normalize(200, 'width'), textAlign: "center", borderBottomWidth: 2, borderColor: this.props.screenProps.theme.primaryColor, paddingBottom: 10 }}
                  label="New Password"
                  labelcolor={this.props.screenProps.theme.btncolor}
                  labelActiveColor={this.props.screenProps.theme.primaryColor}
                  placeholderColor={this.props.screenProps.theme.primaryColor}
                  color={this.props.screenProps.theme.oppositetxtcolor}
                  activeColor={this.props.screenProps.theme.oppositetxtcolor}
                  onChangeText={(newpwd) => {

                    var x = newpwd



                    this.setState({ newpwd: x })
                  }}
                  value={this.state.newpwd}
                />


                <Reinput
                  style={{ height: normalize(40, 'height'), marginTop: 5, backgroundColor: this.props.screenProps.theme.secondaryColor, width: normalize(200, 'width'), textAlign: "center", borderBottomWidth: 2, borderColor: this.props.screenProps.theme.primaryColor, paddingBottom: 10 }}
                  label="Confirm New Password"
                  labelcolor={this.props.screenProps.theme.btncolor}
                  labelActiveColor={this.props.screenProps.theme.primaryColor}
                  placeholderColor={this.props.screenProps.theme.primaryColor}
                  color={this.props.screenProps.theme.oppositetxtcolor}
                  activeColor={this.props.screenProps.theme.oppositetxtcolor}
                  onChangeText={(confirmpwd) => {

                    var x = confirmpwd



                    this.setState({ confirmpwd: x })
                  }}
                  value={this.state.confirmpwd}
                />
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => { this.savePassword(this.state.newpwd, this.state.confirmpwd) }}>
                    <View style={{ margin: 20, justifyContent: "center", backgroundColor: this.props.screenProps.theme.primaryColor, borderRadius: 2, height: normalize(40, 'height'), width: normalize(80, 'width') }}>
                      <Text style={[styles.Text, { color: "white", alignSelf: "center" }]}>Save</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { this.setState({ isChangePWDVisible: false }) }}>
                    <View style={{ margin: 20, justifyContent: "center", borderWidth: 1, borderColor: this.props.screenProps.theme.primaryColor, backgroundColor: "white", borderRadius: 2, height: normalize(40, 'height'), width: normalize(80, 'width') }}>
                      <Text style={[styles.Text, { color: this.props.screenProps.theme.primaryColor, alignSelf: "center" }]}>Cancel</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Text style={[styles.Text, { color: this.props.screenProps.theme.btncolor, fontWeight: "bold", fontSize: 25, width: normalize(200, 'width'), textAlign: "center", padding: 5, marginBottom: 10 }]}>Profile</Text>

            {/*<TouchableOpacity style={{height:20,marginBottom:20,width:width,marginTop:3}} onPress={() => {this.about()}}>
          <View style={{backgroundColor:this.props.screenProps.theme.secondaryColor,elevation:2,padding:8,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
          
          <Icon name="info" size={15} color="green" style={{alignSelf:"center",width:30,paddingEnd:5}}/>
          <Text style={[styles.Text,{color:this.props.screenProps.theme.oppositetxtcolor,fontSize:15,marginStart:5,padding:0,alignSelf:"center"}]}>About Us</Text>
         </View>
         </TouchableOpacity>
         <TouchableOpacity style={{height:20,marginBottom:20,width:width,marginTop:3}} onPress={() => {this.contact()}}>
         <View style={{backgroundColor:this.props.screenProps.theme.secondaryColor,elevation:2,padding:8,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
         
         <Icon name="envelope" size={15} color="green" style={{alignSelf:"center",width:30,paddingEnd:5}}/>
         <Text style={[styles.Text,{color:this.props.screenProps.theme.oppositetxtcolor,fontSize:15,marginStart:5,padding:0,alignSelf:"center"}]}>Contact Us</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity style={{height:20,marginBottom:20,width:width,marginTop:3}} onPress={() => {this.share()}}>
        <View style={{backgroundColor:this.props.screenProps.theme.secondaryColor,elevation:2,padding:8,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
        
        <Icon name="share-alt" size={15} color="green" style={{alignSelf:"center",width:30,paddingEnd:5}}/>
        <Text style={[styles.Text,{color:this.props.screenProps.theme.oppositetxtcolor,fontSize:15,marginStart:5,padding:0,alignSelf:"center"}]}>Share</Text>
       </View>
        </TouchableOpacity>*/}


            <View style={{ backgroundColor: this.props.screenProps.theme.secondaryColor, elevation: 2, margin: 8, width: (90 / 100) * width, padding: 8, flexDirection: "row", justifyContent: "center", borderRadius: 4, height: normalize(100, 'height') }}>
              <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
                <Text style={[styles.Text, { color: this.props.screenProps.theme.btncolor, fontSize: 20, marginStart: 5, padding: 0, alignSelf: "center", textAlign: "center" }]}>Total Match Played</Text>
                <Text style={[styles.Text, { color: this.props.screenProps.theme.oppositetxtcolor, fontSize: 20, marginStart: 5, padding: 0, alignSelf: "center" }]}>{this.props.screenProps.mplayed}</Text>
              </View>


              <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
                <Text style={[styles.Text, { color: this.props.screenProps.theme.btncolor, fontSize: 20, marginStart: 5, padding: 0, alignSelf: "center", textAlign: "center" }]}>Total Winning</Text>
                <Text style={[styles.Text, { color: this.props.screenProps.theme.oppositetxtcolor, fontSize: 20, marginStart: 5, padding: 0, alignSelf: "center" }]}>{this.props.screenProps.mwin}</Text>
              </View>
            </View>
            <View style={{ backgroundColor: this.props.screenProps.theme.secondaryColor, elevation: 2, padding: 8, margin: 8, width: width, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

              <Text style={[styles.Text, { color: this.props.screenProps.theme.oppositetxtcolor, fontSize: 15, marginStart: 5, padding: 0, alignSelf: "center" }]}>Character ID:{this.state.cid}</Text>
            </View>
            <View style={{ backgroundColor: this.props.screenProps.theme.secondaryColor, elevation: 2, margin: 8, width: width, padding: 8, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

              <Text style={[styles.Text, { color: this.props.screenProps.theme.oppositetxtcolor, fontSize: 15, marginStart: 5, padding: 0, alignSelf: "center" }]}>Pubg ID:{this.state.pid}</Text>
            </View>

            <TouchableOpacity style={{ height: normalize(30, 'height'), marginBottom: 20, width: width, marginTop: 20 }} onPress={() => { this.openStateDialog() }}>
              <View style={{ backgroundColor: this.props.screenProps.theme.secondaryColor, elevation: 2, padding: 8, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

                <Text style={[styles.Text, { color: this.props.screenProps.theme.oppositetxtcolor, fontSize: 15, marginStart: 5, padding: 0, alignSelf: "center" }]}>State:{this.state.state}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ height: normalize(30, 'height'), marginBottom: 20, width: width, marginTop: 20 }} onPress={() => { this.openDobDialog() }}>
              <View style={{ backgroundColor: this.props.screenProps.theme.secondaryColor, elevation: 2, padding: 8, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

                <Text style={[styles.Text, { color: this.props.screenProps.theme.oppositetxtcolor, fontSize: 15, marginStart: 5, padding: 0, alignSelf: "center" }]}>Date Of Birth:{this.state.dob}</Text>
              </View>
            </TouchableOpacity>


            <TouchableOpacity style={{ height: normalize(30, 'height'), marginBottom: 20, width: width, marginTop: 20 }} onPress={() => { this.setState({ isChangePWDVisible: !this.state.isChangePWDVisible }) }}>
              <View style={{ backgroundColor: this.props.screenProps.theme.secondaryColor, elevation: 2, padding: 8, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

                <Text style={[styles.Text, { color: this.props.screenProps.theme.oppositetxtcolor, fontSize: 15, marginStart: 5, padding: 0, alignSelf: "center" }]}>Reset Password</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ height: normalize(30, 'height'), marginBottom: 20, width: width, marginTop: 20 }} onPress={() => { this.logout() }}>
              <View style={{ backgroundColor: this.props.screenProps.theme.secondaryColor, elevation: 2, padding: 8, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

                <Icon name="power-off" size={15} color="green" style={{ alignSelf: "center", width: normalize(30, 'width'), paddingEnd: 5 }} />
                <Text style={[styles.Text, { color: this.props.screenProps.theme.oppositetxtcolor, fontSize: 15, marginStart: 5, padding: 0, alignSelf: "center" }]}>Logout</Text>
              </View>
            </TouchableOpacity>
            <View style={{ height: normalize(20, 'height'), marginBottom: 20, width: width, marginTop: 20 }} >
              <View style={{ backgroundColor: this.props.screenProps.theme.secondaryColor, elevation: 2, padding: 8, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

                <Text style={[styles.Text, { color: this.props.screenProps.theme.oppositetxtcolor, fontSize: 15, marginStart: 5, padding: 0, alignSelf: "center" }]}>Dark Mode</Text>
                <Switch
                  onValueChange={() => { this.toggleTheme() }}
                  value={this.state.darkmode}
                />
              </View>
            </View>

          </View>

        </ScrollView>

      )

    } else if (this.state.mode == "ABOUT") {
      const { width, heights } = Dimensions.get('window');

      return (
        <ScrollView style={{ height: heights, backgroundColor: this.props.screenProps.theme.bgcolor }}>
          <View style={[styles.View, { justifyContent: 'center', backgroundColor: this.props.screenProps.theme.bgcolor }]}>
            <Text style={{ color: this.props.screenProps.theme.oppositetxtcolor, fontWeight: "bold", width: normalize(350, 'width'), textAlign: "center", padding: 5, marginBottom: 10 }}>{this.state.about}</Text>
          </View>
        </ScrollView>);
    } else {
      return <ProgressBarAndroid />
    }
  }
}
