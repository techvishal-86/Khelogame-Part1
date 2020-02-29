import { StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import normalize from 'react-native-normalize';
export const {width, height} = Dimensions.get('window');
export const mwidth = 75/100*width
export const mheight = 70/100*height
export const styles = StyleSheet.create({
  animatedBox: {
    flex: 1,
    backgroundColor: "#38C8EC",
    padding: 10
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    width: 0.5 * width
  }  ,
  View:{
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor:"#1E1616",
    borderColor:"transparent",
    shadowColor:"transparent"
  },
  carditem:{
      borderRadius:10,
      backgroundColor:"white",
      color:"black",
      fontFamily:"antonio_bold",
      alignItems:"flex-start",
      elevation:5,
      width:normalize(340,'width')
  },
  header:{  
     backgroundColor:"#1E1616"
  },  
  statusBar: {
    backgroundColor: "#F73636",
    height: Constants.statusBarHeight,
  },
  Text:{
    color:"#FF1B1B",
    fontFamily:"antonio_bold"
  },
  
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  texts: {
    color: '#fff',
    fontSize: 20,
  },
})