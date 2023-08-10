import { StyleSheet } from 'react-native';
import colorObject from '../../HelperComponents/Colors.js';
export default StyleSheet.create({
    searchBarContainer:{
        width: "85%", 
        paddingLeft: '5%',
        paddingRight: '5%',
        backgroundColor: colorObject["grey"]["4"], 
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent'
    },
    inputContainerStyle:{
        backgroundColor: colorObject["grey"]["6"]
    },
    inputStyle:{
        color: colorObject["grey"]["1"]
    },
    iconStyle:{
        iconStyle: {
            color: colorObject["grey"]["1"]
        }
    }

});