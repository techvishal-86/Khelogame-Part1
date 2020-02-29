import { AsyncStorage } from "react-native"

export const lightTheme = {
    primaryColor:"black",
    btncolor:"#109445",
    
    navcolor:"#262521",
    secondaryColor:"white",
    oppositetxtcolor:"black",
    borderColor:"#109445",
    bgcolor:"black",
    dialogTitle:"#F1F2F6",
    noneimage:require('../assets/lightnone.png')

  }
  export const darkTheme = {
    primaryColor:"#0B0C10",
    borderColor:"white",
    btncolor:"green",
    navcolor:"#262521",
    secondaryColor:"#1E1616",
    bgcolor:"black",
    oppositetxtcolor:"white",
    noneimage:require('../assets/darknone.png')

  }

export const theme = async () => {
    const themeType = await AsyncStorage.getItem("theme")
    if (themeType === "darkmode") {
        return darkTheme
    } else {
        return lightTheme
    }
}
