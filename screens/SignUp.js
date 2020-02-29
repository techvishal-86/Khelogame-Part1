import React from 'react';
import Reinput from 'reinput'
import { styles } from "../styles"
import normalize from 'react-native-normalize';

import { Text, Image, View, ScrollView, Switch, TouchableOpacity, Dimensions } from 'react-native';

export default (props) => {
    const { self } = props
    const { theme } = self.state
    const { width, heights } = Dimensions.get('window');
    return <ScrollView style={{ backgroundColor: theme.bgcolor }}>

        <View style={[styles.View, { flexDirection: "column", justifyContent: "center", backgroundColor: theme.primaryColor }]}>
            <View style={{ alignSelf: "flex-start", marginStart: 15, marginTop: 10, flexDirection: "row" }}>
                <Image source={require('../assets/rsb.png')} resizeMode="stretch" style={{ width: normalize(45, 'width'), height: normalize(60, 'height') }} />
                <View style={{ width: width - 100 }}>
                    <View style={{ flexDirection: "row", alignSelf: "flex-end", justifyContent: "center" }}>

                        <TouchableOpacity onPress={() => { self.handleBackButtonClick() }} style={{ margin: 20, marginEnd: 8 }}>
                            <View style={{ justifyContent: "center", backgroundColor: theme.primaryColor, borderRadius: 2 }}>
                                <Text style={[styles.Text, { fontFamily: "antonio_regular", color: "white", alignSelf: "center" }]}>Sign In</Text>
                            </View>

                        </TouchableOpacity>

                        <View style={{ margin: 20, marginEnd: 8, justifyContent: "center", backgroundColor: theme.primaryColor }}>
                            <Text style={[styles.Text, { fontFamily: "antonio_bold", borderBottomWidth: 1, borderColor: "white", color: "white", alignSelf: "center" }]}>Sign Up</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ alignSelf: "flex-start", marginStart: 15, marginTop: 15, marginBottom: 15 }}>
                <Text style={{ color: "white", alignSelf: "flex-start", fontSize: 25, fontWeight: "bold", padding: 10, paddingBottom: 0 }}>Hey get on board,</Text>

                <Text style={{ color: "white", alignSelf: "flex-start", fontSize: 15, fontWeight: "bold", padding: 10, paddingTop: 3 }}>Sign up to continue</Text>
            </View>
            <View style={[styles.View, { flex: 1, flexDirection: "column", width: width, flex: 1, justifyContent: "flex-start", backgroundColor: "white", margin: 0, borderRadius: 10, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>

                <Reinput
                    style={{ height: 40, margin: 10, marginTop: 20, backgroundColor: "white", width: normalize(280, 'width'), textAlign: "center", borderBottomWidth: 1, boderBottomColor: "white", paddingBottom: 10 }}
                    label="Pubg ID"
                    onChangeText={(suname) => self.setState({ suname: suname })}
                    value={self.state.suname}
                />
                <Reinput
                    style={{ height: 40, margin: 10, marginTop: 20, backgroundColor: "white", width: normalize(280, 'width'), textAlign: "center", borderBottomWidth: 1, boderBottomColor: "black", paddingBottom: 10 }}
                    label="Character ID"
                    keyboardType='numeric'
                    onChangeText={(cid) => self.setState({ cid: cid })}
                    value={self.state.cid}
                />

                <TouchableOpacity style={{ alignSelf: "flex-end", margin: 20 }} onPress={() => { self.setState({ obtain: true }) }}>
                    <Text style={{ color: theme.primaryColor }}>How to obtain these?</Text>
                </TouchableOpacity>

                <Reinput
                    style={{ height: 40, margin: 10, backgroundColor: "white", width: normalize(280, 'width'), textAlign: "center", borderBottomWidth: 1, boderBottomColor: "black", paddingBottom: 10 }}
                    label="Email"
                    onChangeText={(semail) => self.setState({ semail: semail })}
                    value={self.state.semail}
                />
                <View style={{ flexDirection: "row", padding: 8 }}>

                    <Reinput
                        style={{ height: 40, backgroundColor: "white", width: normalize(210, 'width'), textAlign: "center", borderBottomWidth: 1, boderBottomColor: "black", paddingBottom: 10 }}
                        label="Password"
                        secureTextEntry={self.state.showPassword}
                        onChangeText={(spassword) => self.setState({ spassword: spassword })}
                        value={self.state.spassword}
                    />

                    <View >
                        <Text style={{ fontSize: 10, color: theme.primaryColor }}>Show Password</Text>
                        <Switch
                            onValueChange={self.toggleSwitch}
                            value={!self.state.showPassword}
                        />
                    </View>

                </View>
                <Reinput
                    style={{ height: 40, margin: 10, backgroundColor: "white", width: normalize(280, 'width'), textAlign: "center", borderBottomWidth: 1, boderBottomColor: "black", paddingBottom: 10 }}
                    label="Refer code"
                    onChangeText={(spcode) => self.setState({ spcode: spcode })}
                    value={self.state.spcode}
                />

                <Text style={{ color: "red", alignSelf: "center", textAlign: "center", margin: 10 }}>Note:Pubg ID and Character ID cannot be changed later, please enter carefully</Text>

                <TouchableOpacity onPress={self.createaccnt}>
                    <View style={{ margin: 20, justifyContent: "center", backgroundColor: theme.primaryColor, borderRadius: 8, height: normalize(40, 'height'), width: normalize(150, 'width') }}>
                        <Text style={[styles.Text, { color: "white", alignSelf: "center" }]}>Sign Up</Text>
                    </View>
                </TouchableOpacity>

            </View>
        </View>
    </ScrollView>
}