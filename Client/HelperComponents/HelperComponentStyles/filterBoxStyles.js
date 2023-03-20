import { StyleSheet } from 'react-native';
import {verticalScale, moderateScale, horizontalScale} from '../Scale.js';
export default StyleSheet.create({
    filterBoxContainer: {
        display: 'flex', 
        flexDirection: "row", 
        alignItems: 'center'
    },
    checkBox: {
        backgroundColor: 'white', 
        borderWidth: 0, 
        marginLeft: 0, 
        marginRight: 0, 
        padding: 0
    },
    allergyCircle: {
        borderWidth: moderateScale(1), 
        borderRadius: moderateScale(25),
        width: moderateScale(20),
        height: moderateScale(20)
    },
    allergyCircleText: {
        lineHeight: moderateScale(18),
        textAlign: 'center', 
        color: 'white'
    }
    
});

