import React from "react"
import { View, TouchableHighlight,Alert ,Text} from "react-native"
import RazorpayCheckout from 'react-native-razorpay';


export default class Razorpay extends React.Component {

    render() {
        return (
            <View>
                <TouchableHighlight onPress={() => {
                    var options = {
                        description: 'Credits towards consultation',
                        image: 'https://i.imgur.com/3g7nmJC.png',
                        currency: 'INR',
                        key: 'rzp_test_1DP5mmOlF5G5ag',
                        amount: '5000',
                        name: 'foo',
                        prefill: {
                            email: 'void@razorpay.com',
                            contact: '9191919191',
                            name: 'Razorpay Software'
                        },
                        theme: { color: '#F37254' }
                    }
                    RazorpayCheckout.open(options).then((data) => {
                        // handle success
                       // Alert.alert(`Success: ${data.razorpay_payment_id}`);
                    }).catch((error) => {
                        // handle failure
                      //  Alert.prompt(`Error: ${error.code} | ${error.description}`);
                    });
                }} >
                    <Text>Pay</Text>
                    </TouchableHighlight>
            </View>)
    }
}