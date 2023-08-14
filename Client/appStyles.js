import { StyleSheet } from 'react-native';
import {moderateScale, verticalScale, horizontalScale} from  './HelperComponents/Scale.js';
import colorObject from './HelperComponents/Colors.js';
export default StyleSheet.create({
    container: {
        flex: 1
    },
    navBar: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        width: '100%', 
        position: 'absolute', 
        bottom: 0, 
        backgroundColor: colorObject["red"]["1"], 
        paddingBottom: '5%',
        height: '9%',
        shadowColor: colorObject["grey"]["6"], 
        shadowOffset: {width: 0, height: moderateScale(-4)}, 
        shadowOpacity: 0.3, 
        shadowRadius: 0,
        zIndex: 1
    },
    navButton: {
        height: '100%',
        justifyContent: 'center',
        borderTopColor: colorObject["grey"]["7"], 
        width: '25%'
    },
    navText: {
        textAlign: 'center', 
        fontSize: moderateScale(14),
        color: colorObject["yellow"]["1"],
        fontFamily: 'Roboto-Bold'
    }
});