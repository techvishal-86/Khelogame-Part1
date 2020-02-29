import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator, createBottomTabNavigator } from 'react-navigation-tabs';

import Icon from 'react-native-vector-icons/FontAwesome'
import { createAppContainer } from 'react-navigation'
import EarnScreen from "./screens/EarnScreen";
import OngoingScreen from "./screens/OngoingScreen";
import PlayScreen from "./screens/PlayScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ResultScreen from "./screens/ResultScreen";


const bottomTabNavigator=(theme)=>createMaterialTopTabNavigator(
  {
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="id-badge" margin={2} size={15} color={theme.btncolor} />
          </View>
        )
      }
    },


    Ongoing: {
      screen: OngoingScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="clock-o" size={15} margin={2} color={theme.btncolor} />
          </View>
        )
      }
    },


    Play: {
      screen: PlayScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="play" size={15} margin={2} color={theme.btncolor} />
          </View>
        )
      }
    },



    Result: {
      screen: ResultScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="trophy" size={15} margin={2} color={theme.btncolor} />
          </View>
        )
      }
    },
    Earn: {
      screen: EarnScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="money" size={15} margin={2} color={theme.btncolor} />
          </View>
        )
      }
    }




  },
  {
    initialRouteName: 'Play',
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: theme.btncolor,
      tintColor: theme.btncolor,
      showIcon: 'true',
      style: {
        backgroundColor: theme.bgcolor,
        borderTopColor: theme.btncolor
      },
      labelStyle: {
        fontSize: 10,
        margin: 2,
        padding: 0,
        color: theme.oppositetxtcolor

      },
      button: {
        marginBottom: 30,
        width: 260,
        alignItems: 'center',
        backgroundColor: theme.btncolor
      },
      buttonText: {
        textAlign: 'center',
        padding: 20,
        color: theme.btncolor
      },
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: theme.btncolor,
          color: theme.oppositetxtcolor
        },
        headerTintColor: theme.btncolor,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }
    }

  }
);


export const getAppContainer =(theme)=>createAppContainer(bottomTabNavigator(theme));