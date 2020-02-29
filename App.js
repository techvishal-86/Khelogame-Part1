import React from 'react';

import { createDrawerNavigator } from 'react-navigation-drawer';
import Drawer from 'react-native-drawer'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import normalize from 'react-native-normalize';


import BouncyDrawer from 'react-native-bouncy-drawer'
import * as Font from 'expo-font'
import Reinput from 'reinput'
import { OffCanvas3D } from 'react-native-off-canvas-menu'
import MenuDrawer from 'react-native-side-drawer'
import CountDown from 'react-native-countdown-component';
import AppIntroSlider from 'react-native-app-intro-slider';
import EventEmitter from 'events';
import MarqueeText from 'react-native-marquee';
import CashfreePG from 'cashfreereactnativepg';
import { BoxShadow } from 'react-native-shadow'
const SideMenu = require('react-native-side-menu');
import SignUp from "./screens/SignUp"
import TextTicker from 'react-native-text-ticker'
// import TimerCountdown from "react-native-timer-countdown";
import Modal from "react-native-modal";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { StyleSheet, WebView, Text, Alert, NetInfo, Picker, Image, Animated, Share, Button, Easing, View, RefreshControl, Clipboard, Linking, ToastAndroid, BackHandler, ScrollView, Switch, ProgressBarAndroid, TouchableOpacity, TextInput, Dimensions, AsyncStorage } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { slides, slides2 } from "./slides"
import { MenuProvider } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/FontAwesome'

import { height, mheight, mwidth, styles, width } from "./styles"
import { getAppContainer } from "./bottomNavigation"
import { lightTheme, darkTheme } from "./Themes"
import { dataAPI, checkOutAPI } from "./Utils"

console.disableYellowBox = true;

export default class App extends React.Component {
  closeControlPanel = () => {
    this._drawer.close()
  };
  openControlPanel = () => {
    this._drawer.open()
  };
  _renderItem = (item) => {
    return (
      <View style={styles.View}>
        <Text style={{ color: "white" }}>{item.title}</Text>
        <Image source={item.image} />
        <Text>{item.text}</Text>
      </View>
    );
  }


  _onDone = () => {

  }
  state = {
    femail: "",
    isModalVisible: false,
    fontsLoaded: false,
    balance: 0,
    logined: false,
    leamil: "",
    lpassword: "",
    recharge: false,
    rechargeMenu: false,
    orderamnt: "0",
    orderId: "0",
    semail: "",
    spassword: "",
    suname: "",
    redeem: false,
    id: "",
    reloaded: true,
    spinAnim: new Animated.Value(0),
    spcode: "",
    signup: false,
    tokenData: "",
    showPassword: true,
    pid: "",
    mplayed: 0,
    mkills: 0,
    mwin: 0,
    about: false,
    ppolicy: false,
    terms: false,
    banned: false,
    menuOpen: false,
    mpid: "Not found",
    mcid: "Not found",
    extras: [],
    firsttime: false,
    obtain: false,
    notice: "",
    cid: "",
    logsin: false,
    verifybox: false,
    responseJson: {},
    payoutModal: false,
    beneid: "",
    payoutAddData: {},
    addBeneError: "",
    theme: {
      primaryColor: "#109445",
      btncolor: "#109445",
      secondaryColor: "white",
      oppositetxtcolor: "black",
      borderColor: "#109445",
      bgcolor: "#f8f8f8",
      navcolor: "#cccbc8",
      dialogTitle: "#F1F2F6",
      noneimage: require('./assets/lightnone.png')
    },
  };
  constructor(props) {
    super(props)

    this.toggleSwitch = this.toggleSwitch.bind(this);
    this.signin = this.signin.bind(this)
    this.signup = this.signup.bind(this)
    this.recharge = this.recharge.bind(this)
    this.rechargeMenu = this.rechargeMenu.bind(this)
    this.createaccnt = this.createaccnt.bind(this)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.redeem = this.redeem.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this._emitter = new EventEmitter();
    this.loginscrn = this.loginscrn.bind(this)

    this.logouts = this.logouts.bind(this)
    this.about = this.about.bind(this)
    this.ppolicy = this.ppolicy.bind(this)
    this.contact = this.contact.bind(this)
    this.share = this.share.bind(this)
    this.telegram = this.telegram.bind(this)
    this.terms = this.terms.bind(this)
    this.nameChangeHandler = this.nameChangeHandler.bind(this)
  }

  nameChangeHandler = (suname) => this.setState({ suname: suname })

  loginscrn() {
    this.setState({ logsin: true })
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  drawerContent = () => {
    return (
      <TouchableOpacity onPress={this.toggleOpen} style={styles.animatedBox}>
        <Text>Close</Text>
      </TouchableOpacity>
    );
  };
  logouts() {
    this.setState({ logined: false, logsin: true })
    this.reload()
  }
  componentWillMount() {
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleConnectivityChange
    )
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    this._emitter.addListener('logout', () => {

    });
    this._emitter.on('Login', () => {
      ToastAndroid.show("YOYOYOYOY", ToastAndroid.LONG)
      this.setState({ logsin: true })
    });
    this._emitter.addListener('darkmode', () => {

      this.setState({ theme: darkTheme })
    });

    this._emitter.addListener('lightmode', () => {

      this.setState({ theme: lightTheme })

    });
    this._emitter.addListener('reload', () => {
      this._emitter.emit("reloaded")
      this.reloadData()
    });
  }

  async reloadData() {
    try {
      let email = null, password = null
      const data = await AsyncStorage.multiGet(['email', 'password']);
      email = data[0][1];
      password = data[1][1];
      this.setState({ progress: true })
      let response = await fetch(
        dataAPI + '/player?key=YOYOHONEYSINGH&email=' + email,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
      responseJson = await response.json();
      this.setState({ responseJson: responseJson })
      responseJson.forEach((obj) => {
        if (email.toLowerCase() == obj.email.toLowerCase() && password == obj.password && !obj.banned) {
          this.setState({ logined: true, logsin: false })
          this.setState({ balance: obj.balance, id: obj._id, redeem: obj.redeem, beneid: obj.beneid || "" });  // new change add beneid


        }
      })


      this.setState({ progress: false })
    } catch (error) {
      console.log(error);
    }
  }
  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.handleConnectivityChange
    }

  }

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ nointernet: false });
      // this.setState({ isConnected });
    } else {
      this.setState({ nointernet: true });


    }
  };
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectivityChange
    )
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    this._emitter.removeAllListeners();
  }

  handleBackButtonClick() {
    if (this.state.signup) {
      this.setState({ signup: false })
      return true
    }
    if (this.state.logsin) {
      this.setState({ logsin: false })
      return true
    }

    if (this.state.rechargeMenu) {
      this.setState({ rechargeMenu: false })
      return true
    }

    if (this.state.plzrecharge) {
      this.setState({ plzrecharge: false, rechargeMenu: true })
      return true

    }

    if (this.state.about) {
      this.setState({ about: false })
      return true
    }

    if (this.state.ppolicy) {
      this.setState({ ppolicy: false })
      return true
    }

    if (this.state.terms) {
      this.setState({ terms: false })
      return true
    }
  }

  notificationNamager = async () => {

  }

  async signin() {
    verify = false
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
      let banned = false;
      responseJson = await response.json();
      this.setState({ players: responseJson, progress: false })
      responseJson.forEach(async (obj) => {
        if (obj.email.toLowerCase() == this.state.lemail.toLowerCase() && obj.password == this.state.lpassword && obj.banned) {

          this.setState({ banned: true });
        }
        if (obj.email.toLowerCase() == this.state.lemail.toLowerCase() && obj.password == this.state.lpassword && !obj.banned) {

          if (obj.verified) {
            this.setState({ progress: true })
            await AsyncStorage.multiSet([
              ["email", this.state.lemail],
              ["password", this.state.lpassword],
              ["pubgid", obj.name],
              ["characterid", obj.characterid],
              ["state", obj.state],
              ["dob", obj.dob]


            ]).then((data) => {
              verify = true
              this.setState({ logined: true, balance: obj.balance, redeem: obj.redeem, id: obj._id, progress: false, logsin: false, beneid: obj.beneid || "" })
            })

          } else {
            ToastAndroid.show("Account not verified, please check your mail to verify it", ToastAndroid.LONG)
            verify = true

          }



        }

      })
    } catch (error) {
      ToastAndroid.show("Unknown error occured (App)" + error, ToastAndroid.LONG)

    }

    if (!this.state.logined && !verify && !this.state.progress) {


      if (this.state.banned) {
        ToastAndroid.show("Your account has been banned", ToastAndroid.LONG)

      } else {
        ToastAndroid.show("Invalid email or password", ToastAndroid.LONG)

      }

      this.setState({ lemail: "", lpassword: "" })
    }



  }

  signup() {

    this.setState({ signup: true })
  }
  toggleSwitch() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return (true)
    }

    return (false)
  }
  async postAccnt(obj, id, bal) {
    obj.key = "YOYOHONEYSINGH"
    if (this.state.reloaded) {
      this.setState({ signup: false })
      this.setState({ suname: "" })

      this.setState({ semail: "", spassword: "", spcode: "", reloaded: false })
      try {
        fetch(dataAPI + '/player', {
          method: 'POST',
          headers: {

            'Content-Type': 'application/json',
          },
          body: JSON.stringify(obj),
        }).then((res) => {

          if (res.status == 200) {

            this.reload()
            if (id != null && bal != null) {
              //  this.updateRefferrer(id,bal)
            } else {
              //        ToastAndroid.show('No Code Applied', ToastAndroid.SHORT)
            }
            //ToastAndroid.show("Account created, now check email and verify your account", ToastAndroid.LONG)
            this.setState({ verifybox: true })
          }
        })
          .then((data) => console.log(data));
      } catch (error) {
        console.log("Error")
      }


      try {
        let response = await fetch(
          dataAPI + '/player?key=YOYOHONEYSINGH',
          {
            method: 'GET', headers: {
              'Content-Type': 'application/json',
            }
          });
        responseJson = await response.json();
        this.setState({ responseJson: responseJson, reloaded: true })

      } catch (error) {
        console.error(error);
      }

    }
  }

  async updateRefferrer(id, bal) {
    try {
      fetch(dataAPI + '/player/' + id, {
        method: 'PUT',
        headers: {

          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ balance: bal, key: "YOYOHONEYSINGH" }),
      }).then((res) => {


      })
        .then((data) => console.log(data));
    } catch (error) {
      console.log(error)
    }
  }
  async createaccnt() {
    if (this.state.responseJson == {}) {
      alert("Data not loaded")
      return
    }

    if (this.state.suname.length == 0) {
      ToastAndroid.show("Pubg ID is empty", ToastAndroid.SHORT)
      this.setState({ suname: "" })
      return
    } else if (this.state.semail.length == 0) {
      ToastAndroid.show("Email is empty", ToastAndroid.SHORT)
      return true
    } else if (this.state.cid.length == 0) {
      ToastAndroid.show('Character ID cannot be empty', ToastAndroid.SHORT)
      return true
    }
    var format = /^[0-9a-zA-Z\_]+$/;
    var nospace = /^\S+$/

    await this.state.responseJson.forEach((obj) => {
      // Alert.alert("Email:"+obj.email+" E Email:"+this.state.semail)
      if (obj.name == this.state.suname) {

        this.setState({ suname: "" })
        return
      } else if (obj.email == this.state.semail) {


        this.setState({ semail: "" })
        return
      } else if (obj.characterid == this.state.cid) {
        this.setState({ cid: "" })
        return
      }

    })
    if (this.state.cid.length == 0) {
      ToastAndroid.show("Character ID already taken", ToastAndroid.SHORT)
      this.setState({ suname: "" })
      return
    } else if (this.state.semail.length == 0) {
      ToastAndroid.show('Email already registered', ToastAndroid.SHORT)
      return true
    } else if (isNaN(this.state.cid)) {
      ToastAndroid.show('Character ID should only contain numbers', ToastAndroid.SHORT)
      return true

    } else if (this.state.cid.length == 0) {
      ToastAndroid.show('Character ID cannot be empty', ToastAndroid.SHORT)
      return true
    } else if (this.state.cid.length < 6) {
      ToastAndroid.show('Character ID should be of atleast 6 digits', ToastAndroid.SHORT)
      return true
    } else {
      if (!nospace.test(this.state.suname)) {
        ToastAndroid.show("Invalid PUBG ID Name", ToastAndroid.SHORT)
        this.setState({ suname: "" })
        return
      } else {


        if (this.ValidateEmail(this.state.semail)) {
          if (this.state.spassword.length > 0) {
            let mobj = {
              email: this.state.semail,
              password: this.state.spassword,
              name: this.state.suname,
              pubgid: this.state.pid,
              characterid: this.state.cid
            }
            // Refer :- 5 coin bonus for downloader
            // 10 coin bonus for referrer
            let id = null
            let bal = null
            if (this.state.spcode.length > 0) {
              if (format.test(this.state.spcode)) {
                await this.state.responseJson.forEach((obj) => {
                  // Alert.alert("Email:"+obj.email+" E Email:"+this.state.semail)

                  if (obj.name == this.state.spcode) {
                    //   mobj.balance = 5
                    id = obj._id
                    mobj.refercode = this.state.spcode
                    //    bal = obj.balance+5

                    this.postAccnt(mobj, id, bal)
                  }

                })

                if (id == null) {
                  ToastAndroid.show("Invalid Refer Code", ToastAndroid.SHORT)
                  this.setState({ spcode: "" })
                  this.postAccnt(mobj, id, bal)
                }

              } else {
                ToastAndroid.show("Invalid Promo Code", ToastAndroid.SHORT)
                this.setState({ spcode: "" })
                return
              }
            } else {
              this.postAccnt(mobj, id, bal)
            }


          } else {
            ToastAndroid.show("Password is empty", ToastAndroid.SHORT)
            this.setState({ spassword: "" })
            return
          }
        } else {
          ToastAndroid.show("Invalid Email Address", ToastAndroid.SHORT)
          this.setState({ semail: "" })
        }

      }

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

  ppolicy() {


    this.setState({ ppolicy: true })


  }

  terms() {


    this.setState({ terms: true })


  }
  telegram() {
    if (this.state.extras.length > 0) {

      Linking.openURL(this.state.extras[0].telegramlink)
    }
  }

  share() {
    if (this.state.extras.length > 0) {

      Linking.openURL(this.state.extras[0].sharelink)
    }
  }

  async componentDidMount() {
    await Font.loadAsync({
      'antonio_bold': require('./assets/fonts/antoniobold.ttf'),
      'antonio_regular': require('./assets/fonts/antonio.regular.ttf')
    });
    this.setState({ fontsLoaded: true });
    let email = "", password = "", firsttime = "", darkmode = false, mpid = "Not found", mcid = "Not found"
    AsyncStorage.multiGet(['email', 'password', 'firsttime', 'darkmode', 'pubgid', 'characterid']).then((data) => {
      email = data[0][1];
      password = data[1][1];
      firsttime = data[2][1]
      darkmode = data[3][1]
      mpid = data[4][1]
      mcid = data[5][1]

      if (mpid != undefined || mpid != "")
        this.setState({ mpid: mpid })

      if (mcid != undefined || mcid != "")
        this.setState({ mcid: mcid })
      if (firsttime == undefined || firsttime == "")
        this.setState({ firsttime: true })
      if (darkmode == "true")
        this.setState({ theme: darkTheme })

      //Your logic
    });
    if (!email) {
      email = ""
    }
    this.setState({ progress: true })
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
      if (responseJson && responseJson.length) {
        responseJson.forEach((obj) => {
          if (email && email.toLowerCase() == obj.email.toLowerCase() && password == obj.password && !obj.banned) {
            this.setState({ logined: true, logsin: false })
            this.setState({ balance: obj.balance, id: obj._id, redeem: obj.redeem, mplayed: obj.noofmatch, mwin: obj.totalwinningamt, mkills: obj.totalkills, beneid: obj.beneid || "" });  // new change add beneid
          }
        })
      }

      this.setState({ progress: false })
    } catch (error) {
      console.error(error);
    }
    this.setState({ progress: true })
    try {
      let response2 = await fetch(
        dataAPI + '/extras',
      );
      responseJson2 = await response2.json();
      this.setState({ extras: responseJson2 })
      if (this.state.extras.length > 0) {

        this.setState({ about: this.state.extras[0].about, notice: this.state.extras[0].notice })
      }
      this.setState({ progress: false })
    } catch (error) {
      console.error(error);
    }
  }

  rechargeMenu() {
    this.setState({ rechargeMenu: true })
  }
  recharge(y) {

    this.setState({ orderamnt: y, orderId: String(Date.now()) }, () => {

      this.setState({ progress: true })
      try {
        fetch(checkOutAPI.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-client-id': checkOutAPI.clientId,
            'x-client-secret': checkOutAPI.clientSecret
          },
          body: JSON.stringify({
            "orderId": this.state.orderId,
            "orderAmount": this.state.orderamnt,
            "orderCurrency": "INR"
          })
        }).then((result) => {
          console.log(result);

          return result.json()
        })
          .then((response) => {
            // this.setState({urlCalled: true, urlResponse: response});
            return response;
          }).then((response) => {
            console.log("response");

            if (response.status === 'OK' && response.message === 'Token generated') {
              this.setState({ recharge: true })
              this.setState({ rechargeMenu: false })
              this.setState({ progress: false })
              this.setState({ tokenData: response.cftoken });
              return
            }
            else {
              ToastAndroid.show("Can't recharge", ToastAndroid.SHORT)
            }
            this.setState({ progress: false })
            throw { name: 'response not success', message: 'response was not successfull \n', response };
          }).catch((err) => {
            console.log("err caught");
            console.log(err);
          })
      } catch (error) {
        ToastAndroid.show("Error " + error, ToastAndroid.SHORT)
      }
    })
  }
  async reload() {
    this.setState({ progress: true })
    try {
      let response = await fetch(
        dataAPI + '/player?key=YOYOHONEYSINGH',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
      responseJson = await response.json();
      this.setState({ responseJson: responseJson }, () => {

        this.setState({ progress: false })
      })
    } catch (error) {
      console.error(error);
    }
  }
  async redeem() {
    // code start
    const { beneid } = this.state;
    if (this.state.redeem || this.state.balance <= 0) {
      ToastAndroid.show("Redeem request has been already sent", ToastAndroid.LONG)
    } else {
      if (beneid === "") {
      } else {
      }
      // code end

      // old api call which is now in redeemprocess function
      // try {
      //   fetch(dataAPI + '/player/' + this.state.id, {
      //     method: 'PUT',
      //     headers: {

      //       'Content-Type': 'application/json',
      //     },
      //     body: '{"redeem":"true","redeemmoney":"' + this.state.balance + '","balance":"0","key":"YOYOHONEYSINGH"}',
      //   }).then((res) => {

      //     if (res.status == 200) {


      //       ToastAndroid.show("Money will be transferred to you soon ", ToastAndroid.LONG)
      //       this.setState({ balance: 0, redeem: true })
      //       this.reload()
      //     } else {
      //       ToastAndroid.show("Unknown error occured (Redeem App)", ToastAndroid.LONG)
      //     }
      //   })
      //     .then((data) => console.log(data));
      // } catch (error) {
      //   ToastAndroid.show(error, ToastAndroid.LONG)
      // }

      // code start
    }
    // code end

  }


  async forgotPassword() {
    if (this.ValidateEmail(this.state.femail)) {
      this.setState({ isModalVisible: !this.state.isModalVisible })
      try {

        ToastAndroid.show("Link to reset password sent please check your email", ToastAndroid.SHORT)
        let response = await fetch(
          dataAPI + '/resetpasswordm?email=' + this.state.femail,
        );
      } catch (error) {
        console.error(error);
      }


    } else {
      ToastAndroid.show("Enter a valid email address", ToastAndroid.SHORT)
    }
  }
  toggleModal() {
    this.setState({ isModalVisible: !this.state.isModalVisible })
  }
  handleMenu() {
    this.setState({
      menuOpen: !this.state.menuOpen
    })
  }
  render() {
    const drawerStyles = {
      drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
      main: { paddingLeft: 3 },
    }

    const AppContainer = getAppContainer(this.state.theme)
    const { width, heights } = Dimensions.get('window');
    if (this.state.firsttime == true) {
      return <AppIntroSlider slides={slides} onDone={() => {
        this.setState({ firsttime: false })
        AsyncStorage.multiSet([
          ["firsttime", "nope"]
        ])
      }
      } />;

    } else if (this.state.obtain == true) {
      return <AppIntroSlider slides={slides2} onDone={() => { this.setState({ obtain: false }) }} />

    } else if (this.state.about == true) {
      return (<MixComponent theme={this.state.theme} text={"About Us"} uri={"https://khelogame.net/about.html"} stateAttribute={this.state.extras[0].about} back={this.handleBackButtonClick} />);


    } else if (this.state.ppolicy == true) {
      return (<MixComponent theme={this.state.theme} text={"Privacy Policy"} uri={"https://khelogame.net/privacy-policy.html"} stateAttribute={this.state.extras[0].privacypolicy} back={this.handleBackButtonClick} />);
    }
    else if (this.state.terms == true) {
      return (<MixComponent theme={this.state.theme} text={"Terms"} uri={"https://khelogame.net/terms.html"} stateAttribute={this.state.extras[0].terms} back={this.handleBackButtonClick} />);
    }
    else if (this.state.progress) {

      //   return <ProgressBarAndroid style={{position: 'absolute', left: width/2, height: height/2, justifyContent:'center',alignItems:'center'}}/>  
      return <ProgressScreen theme={this.state.theme} />
    } else if (this.state.fontsLoaded && !this.state.recharge && !this.state.rechargeMenu && this.state.plzrecharge) {
      const preDefinedAmounts = ["10", "50", "100", "500"]
      return (
        <View style={{ flex: 2 }}>

          <View style={[styles.header, {
            flex: 0.2,
            flexDirection: 'row', backgroundColor: this.state.theme.bgcolor, alignItems: "center"
          }]}>
            <TouchableOpacity onPress={() => { this.handleBackButtonClick() }}>
              <Icon name="arrow-left" size={25} color={this.state.theme.oppositetxtcolor} style={{ margin: 5, padding: 8 }} />

            </TouchableOpacity>
            <Text style={{ color: this.state.theme.oppositetxtcolor, fontSize: 27, fontWeight: "bold", margin: 5, padding: 8, alignSelf: "flex-end" }}>Recharge</Text>


          </View>
          <View style={[styles.View, { flexDirection: "column", justifyContent: "flex-start", flex: 1.8, backgroundColor: this.state.theme.secondaryColor }]}>
            {preDefinedAmounts.map((data, index) => {
              return <TouchableOpacity style={{ height: hp('3.5%'), marginBottom: hp('5%'), width: width, marginTop: hp('5%') }} onPress={() => { this.recharge(data) }}>
                <View style={{ backgroundColor: this.state.theme.bgcolor, elevation: 2, padding: 8, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="money" size={15} color="green" style={{ alignSelf: "center", width: normalize(30, 'width'), paddingEnd: 5 }} />
                  <Text style={[styles.Text, { color: this.state.theme.oppositetxtcolor, fontSize: 15, marginStart: 5, padding: 0, alignSelf: "center" }]}>{data}</Text>
                </View>
              </TouchableOpacity>
            })}
            <Text style={[styles.Text, { fontFamily: "antonio_regular", marginTop: 30, color: this.state.theme.btncolor, alignSelf: "center" }]}>All transactions are powered by CashFree</Text>
          </View>
        </View>

      )
    }
    else if (this.state.fontsLoaded && !this.state.recharge && this.state.rechargeMenu && !this.state.logined && !this.state.logsin) {
      return (
        <View style={[styles.View, { backgroundColor: this.state.theme.bgcolor }]}>


          <Text style={{ color: this.state.theme.oppositetxtcolor, fontWeight: "bold", width: normalize(350, 'width'), textAlign: "center", padding: 5, marginBottom: 10 }}>You Have Not Logged</Text>

          <TouchableOpacity style={{ height: hp('5%'), marginBottom: hp('2%'), width: width, marginTop: hp('2%') }} onPress={() => { this.loginscrn() }}>
            <View style={{ backgroundColor: this.state.theme.secondaryColor, elevation: 2, padding: 8, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

              <Text style={[styles.Text, { color: this.state.theme.oppositetxtcolor, fontSize: 15, marginStart: 5, padding: 0, alignSelf: "center" }]}>Login</Text>
            </View>
          </TouchableOpacity>
        </View>)
    }
    else if (this.state.fontsLoaded && !this.state.recharge && this.state.rechargeMenu && this.state.logined) {

      const { width, heights } = Dimensions.get('window');
      return (
        <View style={{ flex: 2 }}>
          <View style={[styles.header, {
            flex: 0.2,
            flexDirection: 'row', backgroundColor: this.state.theme.bgcolor, alignItems: "center"
          }]}>
            <TouchableOpacity onPress={() => { this.handleBackButtonClick() }}>
              <Icon name="arrow-left" size={25} color={this.state.theme.oppositetxtcolor} style={{ margin: 5, padding: 8 }} />

            </TouchableOpacity>
            <Text style={{ color: this.state.theme.oppositetxtcolor, fontSize: 27, fontWeight: "bold", margin: 5, padding: 8, alignSelf: "flex-end" }}>My Wallet</Text>


          </View>
          <View style={[styles.View, { flexDirection: "column", justifyContent: "flex-start", flex: 1.8, backgroundColor: this.state.theme.secondaryColor }]}>

            <View style={{ flexDirection: "column" }}>
              <View style={{ backgroundColor: this.state.theme.bgcolor, elevation: 1, width: width }}>
                <Text style={[styles.Text, { color: this.state.theme.oppositetxtcolor, fontSize: 23, margin: 0, padding: 0, alignSelf: "center" }]}>Available Balance</Text>
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                  <Icon name="money" size={15} color="green" style={{ alignSelf: "center", width: normalize(30, 'width'), paddingEnd: 5 }} />
                  <Text style={[styles.Text, { color: this.state.theme.oppositetxtcolor, fontSize: 27, margin: 5, padding: 8, alignSelf: "center" }]}>{this.state.balance}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={{ height: hp('3.5%'), marginBottom: hp('4%'), width: width, marginTop: hp('2%') }} onPress={() => { this.setState({ rechargeMenu: false, plzrecharge: true }) }}>
              <View style={{ backgroundColor: this.state.theme.bgcolor, elevation: 1, padding: 8 }}>
                <Text style={[styles.Text, { color: this.state.theme.oppositetxtcolor, fontSize: 15, marginStart: 5, padding: 0, alignSelf: "flex-start" }]}>Buy Coins</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ height: hp('3.5%'), marginBottom: hp('2%'), width: width, marginTop: hp('2%') }} onPress={() => { this.redeem(); }}>
              <View style={{ backgroundColor: this.state.theme.bgcolor, elevation: 1, padding: 8 }}>
                <Text style={[styles.Text, { color: this.state.theme.oppositetxtcolor, fontSize: 15, marginStart: 5, padding: 0, alignSelf: "flex-start" }]}>Redeem Coins</Text>
              </View>
            </TouchableOpacity>
            <Text style={[styles.Text, { fontFamily: "antonio_regular", marginTop: 30, color: this.state.theme.btncolor, alignSelf: "center" }]}>All transactions are powered by CashFree</Text>


          </View>
        </View>
      );
    }
    else if (this.state.fontsLoaded && this.state.recharge && !this.state.rechargeMenu) {
      let userData = {};
      if (this.state.id !== "" && this.state.responseJson !== {}) {
        userData = this.state.responseJson.filter(x => x._id === this.state.id);
      }
      return (
        <View style={[styles.View, { backgroundColor: 'white' }]}>
          <CashfreePG
            appId={checkOutAPI.clientId}
            orderId={this.state.orderId}
            orderAmount={this.state.orderamnt}
            orderCurrency="INR"
            orderNote="This is an order note"
            source="reactsdk"
            customerName={userData[0].name || "John"}
            customerEmail={userData[0].email || "abc@email.com"}
            customerPhone="1234561234"
            notifyUrl=""
            paymentModes=""
            env="test" //blank for prod
            tokenData={this.state.tokenData}
            callback={async (eventData) => {
              this.setState({ recharge: false })
              if (JSON.parse(eventData).txStatus == "SUCCESS") {
                let email = null, password = null
                let id = ""
                let curbal = 0
                AsyncStorage.multiGet(['email', 'password']).then(async (data) => {
                  console.log('this.state.responseJson===>>' + JSON.stringify(this.state.responseJson));
                  email = data[0][1];
                  password = data[1][1];
                  this.state.responseJson.map((obj) => {
                    if (obj.email.toLowerCase() == email.toLowerCase()) {
                      id = obj._id
                      curbal = obj.balance
                    }
                  })
                  let newbal = Number(this.state.orderamnt) + curbal
                  if (id != "") {
                    try {
                      await fetch(dataAPI + '/player/' + id, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ balance: newbal, key: "YOYOHONEYSINGH" }),
                      }).then((res) => {
                        console.log("pay api===>", JSON.stringify(res));
                        if (res.status == 200) {
                          ToastAndroid.show("Balance Recharged", ToastAndroid.LONG)
                          this.setState({ balance: newbal })
                          // this.reload()
                          this.reloadData()
                        } else {
                          ToastAndroid.show("Unable to update recharge", ToastAndroid.LONG)
                        }
                      })
                        .then((data) => console.log(data));
                    } catch (error) {
                      console.log("Error")
                    }
                  } else {
                    ToastAndroid.show("Unable to update recharge", ToastAndroid.LONG)
                  }
                });
              } else {
                ToastAndroid.show("Unable to recharge", ToastAndroid.LONG)
              }
            }}
          />
        </View>

      );
    }
    else if (this.state.fontsLoaded && !this.state.logsin) {
      const drawerStyles = { drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 } }
      const { width, heights } = Dimensions.get('window');
      const drawerOptions =
        [{ label: "About Us", handler: this.about, icon: "info" },
        { label: "Contact", handler: this.contact, icon: "envelope" },
        { label: "Share", handler: this.share, icon: "share-alt" },
        { label: "Telegram", handler: this.telegram, icon: "telegram" },
        { label: "Privacy Policy", handler: this.ppolicy, icon: "user-secret" },
        { label: "Terms", handler: this.terms, icon: "user-secret" },
        ]
      return (
        //Material Design Style Drawer
        <Drawer
          ref={(ref) => this._drawer = ref}
          side='right'
          type="overlay"
          content={
            <View style={{ flex: 1, width: width, backgroundColor: this.state.theme.bgcolor, alignItems: "flex-start", alignContent: "flex-start", flexDirection: "column" }}>
              {drawerOptions.map(({ label, handler, icon }, index) => {
                return (<TouchableOpacity key={index} style={{ height: normalize(30, 'height'), marginBottom: 15, width: width, marginTop: 5 }} onPress={handler}>
                  <View style={{ backgroundColor: this.state.theme.navcolor, elevation: 0, paddingLeft: 16, paddingVertical: 8, flexDirection: "row", alignItems: "flex-start", justifyContent: "flex-start" }}>
                    <Icon name={icon} size={15} color="green" style={{ alignSelf: "center", width: normalize(30, 'width') }} />
                    <Text style={[styles.Text, { color: this.state.theme.oppositetxtcolor, fontSize: 15, alignSelf: "flex-start", marginEnd: 0.7 * width, textAlign: "center" }]}>
                      {label}
                    </Text>
                  </View>
                </TouchableOpacity>)
              })}
            </View>
          }
          tapToClose={true}
          openDrawerOffset={0.2} // 20% gap on the right side of drawer
          panCloseMask={0.2}
          closedDrawerOffset={-3}
          styles={drawerStyles}
          tweenHandler={(ratio) => ({
            main: { opacity: (2 - ratio) / 2 }
          })}>


          <MenuProvider>
            <View style={{ flex: 2 }}>
              <View style={[styles.header, {
                flex: 0.1,
                flexDirection: 'row', backgroundColor: this.state.theme.bgcolor
              }]}>
                <Image source={require('./assets/rsb.png')} resizeMode="stretch" style={{ margin: 5, width: normalize(40, 'width'), height: 55 }} />

                <Text style={{ color: this.state.theme.oppositetxtcolor, fontSize: 27, fontWeight: "bold", margin: 5, padding: 8, alignSelf: "flex-end", marginLeft: "auto" }}></Text>
                <View style={{ alignSelf: "flex-end" }}>
                  <View style={{ flexDirection: "row" }}>
                    <Icon name="bell" size={25} color="green" style={{ opacity: 0, margin: 5, padding: 8 }} />

                    <TouchableOpacity onPress={() => { this.rechargeMenu() }}>
                      <View style={{
                        margin: 10,
                        marginEnd: 20,
                        borderRadius: 12,
                        flexDirection: "row",
                        height: 35,
                        justifyContent: "center",
                        alignContent: "center",
                        padding: 5,
                        backgroundColor: this.state.theme.secondaryColor,

                      }}>

                        <Icon name="money" size={15} color="green" style={{ alignSelf: "center", width: normalize(40, 'width'), paddingEnd: 5, margin: 5 }} />

                        <Text style={[styles.Text, { marginStart: 10, color: "green", alignSelf: "center" }]}>{this.state.balance}</Text>
                      </View>


                    </TouchableOpacity>

                    <Menu  >
                      <TouchableOpacity onPress={() => { this.openControlPanel() }}>

                        <Icon name="bars" size={15} color="green" style={{ alignSelf: "center", width: normalize(30, 'width'), paddingEnd: 5, margin: 20 }} />
                      </TouchableOpacity>
                      <MenuOptions>
                        <MenuOption onSelect={() => this.about()} text='About' />
                        <MenuOption onSelect={() => this.contact()} text='Contact' />
                        <MenuOption onSelect={() => this.share()} text='Share' />
                        <MenuOption onSelect={() => this.telegram()} text='Telegram' />

                        <MenuOption onSelect={() => this.ppolicy()} text='Privacy Policy' />
                      </MenuOptions>
                    </Menu>
                  </View>
                </View>
              </View>
              <View style={{ borderRadius: 0, borderColor: "green", flex: 0.1, paddingLeft: 10, backgroundColor: this.state.theme.secondaryColor, marginBottom: 0, borderWidth: 2, width: normalize(500, 'width'), justifyContent: "center" }}>
                <TextTicker

                  style={{ fontSize: 15, color: this.state.theme.oppositetxtcolor }}
                  duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={1000}
                >
                  {this.state.notice}
                </TextTicker>
              </View>

              <AppContainer screenProps={{ logined: this.state.logined, logins: this.loginscrn, logouts: this.logouts, eventEmitter: this._emitter, bbtn: this.handleBackButtonClick(), theme: this.state.theme, pid: this.state.mpid, cid: this.state.mcid, mplayed: this.state.mplayed, mkills: this.state.mkills, mwin: this.state.mwin }} style={[styles.View, { flex: 1.7 }]} />


            </View>
            <Modal isVisible={this.state.nointernet}>
              <View style={{ alignItems: "center", alignSelf: "center", backgroundColor: this.state.theme.secondaryColor, borderRadius: 5, width: normalize(300, 'width'), height: 550 }}>
                <Text style={{ color: this.state.theme.oppositetxtcolor, fontSize: 18, backgroundColor: this.state.theme.dialogTitle, width: normalize(300, 'width'), textAlign: 'center', marginTop: 2, padding: 10 }}>NO INTERNET</Text>
                <Image source={require('./assets/nointernet.png')} resizeMode="stretch" style={{ width: normalize(300, 'width'), height: normalize(250, 'height') }} />
                <Text style={{ margin: 20, color: this.state.theme.oppositetxtcolor, fontSize: 15, width: normalize(200, 'width'), textAlign: "center" }}>You Are Not Connected To The Internet</Text>
                <Text style={{ margin: 20, color: this.state.theme.oppositetxtcolor, fontSize: 20, width: normalize(200, 'width'), textAlign: "center" }}>PLEASE TURN ON</Text>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ margin: 20, justifyContent: "center", backgroundColor: this.state.theme.primaryColor, borderRadius: 12, height: normalize(40, 'height'), width: normalize(80, 'width') }}>
                    <Text style={[styles.Text, { color: "white", alignSelf: "center" }]}>Wi-Fi</Text>
                  </View>
                  <Text style={{ color: this.state.theme.oppositetxtcolor, marginTop: 20, fontSize: 20, textAlign: "center" }}>OR</Text>

                  <View style={{ margin: 20, justifyContent: "center", backgroundColor: this.state.theme.primaryColor, borderRadius: 12, height: normalize(40, 'height'), width: normalize(80, 'width') }}>
                    <Text style={[styles.Text, { color: "white", alignSelf: "center" }]}>Data</Text>
                  </View>
                </View>
              </View>
            </Modal>

          </MenuProvider>

        </Drawer>
      );
    }
    else if ((!this.state.logined && this.state.fontsLoaded && !this.state.signup && this.state.logsin && this.state.fontsLoaded)) {
      return (
        <View style={[styles.View, { flexDirection: "column", justifyContent: "center", backgroundColor: this.state.theme.primaryColor }]}>
          <Modal isVisible={this.state.isModalVisible}>
            <View style={{ alignItems: "center", alignSelf: "center", backgroundColor: this.state.theme.secondaryColor, borderRadius: 5, width: normalize(300, 'width'), height: normalize(300, 'height') }}>
              <Text style={{ color: this.state.theme.oppositetxtcolor, fontSize: 18, backgroundColor: this.state.theme.dialogTitle, width: normalize(300, 'width'), textAlign: 'center', marginTop: 2, padding: 10 }}>Forgot Password</Text>

              <Text style={{ margin: 20, color: this.state.theme.oppositetxtcolor, fontSize: 15, width: normalize(200, 'width'), textAlign: "center" }}>Please enter your email address and we will send your password by email immedialtely.</Text>

              <Reinput
                style={{ height: normalize(40, 'height'), marginTop: 5, backgroundColor: this.state.theme.secondaryColor, width: normalize(200, 'width'), textAlign: "center", borderBottomWidth: 2, borderColor: this.state.theme.primaryColor, paddingBottom: 10 }}
                label="Email"
                labelcolor={this.state.theme.btncolor}
                labelActiveColor={this.state.theme.primaryColor}
                placeholderColor={this.state.theme.primaryColor}
                color={this.state.theme.oppositetxtcolor}
                activeColor={this.state.theme.oppositetxtcolor}
                onChangeText={(femail) => this.setState({ femail: femail })}
                value={this.state.femail}
              />
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={() => { this.forgotPassword() }}>
                  <View style={{ margin: 20, justifyContent: "center", backgroundColor: this.state.theme.primaryColor, borderRadius: 2, height: normalize(40, 'height'), width: normalize(80, 'width') }}>
                    <Text style={[styles.Text, { color: "white", alignSelf: "center" }]}>Verify</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { this.toggleModal() }}>
                  <View style={{ margin: 20, justifyContent: "center", borderWidth: 1, borderColor: this.state.theme.primaryColor, backgroundColor: "white", borderRadius: 2, height: normalize(40, 'height'), width: normalize(80, 'width') }}>
                    <Text style={[styles.Text, { color: this.state.theme.primaryColor, alignSelf: "center" }]}>Cancel</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal isVisible={this.state.verifybox}>
            <View style={{ alignItems: "center", alignSelf: "center", backgroundColor: this.state.theme.secondaryColor, borderRadius: 5, width: normalize(300, 'width'), height: 450 }}>
              <Text style={{ color: this.state.theme.oppositetxtcolor, fontSize: 18, backgroundColor: this.state.theme.dialogTitle, width: normalize(300, 'width'), textAlign: 'center', marginTop: 2, padding: 10 }}>Account Verification</Text>
              <Image source={require('./assets/nointernet.png')} resizeMode="stretch" style={{ width: normalize(300, 'width'), height: normalize(250, 'height') }} />
              <Text style={{ margin: 20, color: this.state.theme.oppositetxtcolor, fontSize: 15, width: normalize(200, 'width'), textAlign: "center" }}>Please check your email and verify</Text>

              <TouchableOpacity onPress={() => { this.setState({ verifybox: false }) }}>
                <View style={{ margin: 15, justifyContent: "center", backgroundColor: this.state.theme.btncolor, borderRadius: 2, height: normalize(30, 'height'), width: normalize(100, 'width') }}>
                  <Text style={[styles.Text, { color: "white", alignSelf: "center" }]}>OK</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>

          <View style={{ alignSelf: "flex-start", marginStart: 15, marginTop: 10, flexDirection: "row" }}>
            <Image source={require('./assets/rsb.png')} resizeMode="stretch" style={{ width: normalize(45, 'width'), height: normalize(60, 'height') }} />
            <View style={{ width: width - 100 }}>
              <View style={{ flexDirection: "row", alignSelf: "flex-end", justifyContent: "center" }}>

                <View style={{ margin: 20, marginEnd: 8, justifyContent: "center", backgroundColor: this.state.theme.primaryColor }}>
                  <Text style={[styles.Text, { fontFamily: "antonio_bold", borderBottomWidth: 1, borderColor: "white", color: "white", alignSelf: "center" }]}>Sign In</Text>
                </View>
                <TouchableOpacity onPress={() => { this.signup() }} style={{ margin: 20, marginEnd: 8 }}>
                  <View style={{ justifyContent: "center", backgroundColor: this.state.theme.primaryColor, borderRadius: 2 }}>
                    <Text style={[styles.Text, { fontFamily: "antonio_regular", color: "white", alignSelf: "center" }]}>Sign Up</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ alignSelf: "flex-start", marginStart: 15, marginTop: 15, marginBottom: 15 }}>
            <Text style={{ color: "white", alignSelf: "flex-start", fontSize: 25, fontWeight: "bold", padding: 10, paddingBottom: 0 }}>Welcome back,</Text>

            <Text style={{ color: "white", alignSelf: "flex-start", fontSize: 15, fontWeight: "bold", padding: 10, paddingTop: 3 }}>Sign in to continue</Text>
          </View>

          <View style={[styles.View, { flex: 1, flexDirection: "column", width: width, height: heights, justifyContent: "flex-start", backgroundColor: "white", margin: 0, borderRadius: 10, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
            <Reinput
              style={{ height: 40, margin: 20, marginTop: 40, backgroundColor: "white", width: normalize(280, 'width'), textAlign: "center", borderBottomWidth: 1, boderBottomColor: "black", paddingBottom: 10 }}
              label="Email"
              onChangeText={(lemail) => this.setState({ lemail: lemail })}
              value={this.state.lemail}
            />
            <View style={{ flexDirection: "row", padding: 8 }}>

              <Reinput
                style={{ height: 40, backgroundColor: "white", width: normalize(210, 'width'), textAlign: "center", borderBottomWidth: 1, boderBottomColor: "black", paddingBottom: 10 }}
                label="Password"
                secureTextEntry={this.state.showPassword}
                onChangeText={(lpassword) => this.setState({ lpassword: lpassword })}
                value={this.state.lpassword}
              />

              <View >
                <Text style={{ fontSize: 10, color: this.state.theme.primaryColor }}>Show Password</Text>
                <Switch
                  onValueChange={this.toggleSwitch}
                  value={!this.state.showPassword}
                />
              </View>

            </View>
            <TouchableOpacity style={{ alignSelf: "flex-end", margin: 20 }} onPress={() => { this.toggleModal() }}>
              <Text style={{ color: this.state.theme.primaryColor }}>Forgot Password?</Text>

            </TouchableOpacity>

            <TouchableOpacity onPress={() => { this.signin() }}>
              <View style={{ margin: 20, justifyContent: "center", backgroundColor: this.state.theme.primaryColor, borderRadius: 8, height: normalize(40, 'height'), width: normalize(150, 'width') }}>
                <Text style={[styles.Text, { color: "white", alignSelf: "center" }]}>Sign In</Text>
              </View>
            </TouchableOpacity>

          </View>




        </View>

      )
    }
    else if (this.state.signup && this.state.fontsLoaded) {
      return (<SignUp self={this} />)
    }
    else {
      return (<ProgressScreen theme={this.state.theme} />)
    }
  }
}

const ProgressScreen = (theme) => (
  <View style={[styles.View, {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.bgcolor
  }]}>
    <AnimatedCircularProgress
      size={120}
      width={10}
      fill={100}
      tintColor={theme.btncolor}
      onAnimationComplete={() => console.log('onAnimationComplete')}
      backgroundColor="#3d5875" />
  </View>)


const MixComponent = ({ text, stateAttribute, back, theme, uri }) => {

  const { width, height } = Dimensions.get('window');
  return (
    <ScrollView style={{ height: height, backgroundColor: theme.bgcolor }}>
      <View style={[styles.header, {
        flex: 0.2,
        flexDirection: 'row', backgroundColor: theme.bgcolor, alignItems: "center"
      }]}>
        <TouchableOpacity onPress={back}>
          <Icon name="arrow-left" size={25} color={theme.oppositetxtcolor} style={{ margin: 5, padding: 8 }} />
        </TouchableOpacity>
        <Text style={{ color: theme.oppositetxtcolor, fontSize: 27, fontWeight: "bold", margin: 5, padding: 8, alignSelf: "flex-end" }}>{text}</Text>

      </View>
      <View style={[styles.View, { justifyContent: 'center', backgroundColor: theme.bgcolor }]}>


      </View>

      <WebView
        html={stateAttribute}
        style={{ height: height - 60 }}
      // source={{ uri: uri }}
      />
    </ScrollView>
  );
}

