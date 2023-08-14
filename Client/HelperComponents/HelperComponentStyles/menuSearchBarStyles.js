import { StyleSheet } from 'react-native';
import {verticalScale, moderateScale, horizontalScale} from '../Scale.js';
import colorObject from '../../HelperComponents/Colors.js';
export default StyleSheet.create({
    searchBarContainer:{
        width: "85%", 
        paddingLeft: '5%',
        paddingRight: '5%',
        backgroundColor: colorObject["red"]["1"], 
        borderBottomWidth: 0,
        borderTopWidth: 0,
        justifyContent: 'center'
    },
    inputContainerStyle:{
        backgroundColor: colorObject["grey"]["7"],
        height: moderateScale(40)
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