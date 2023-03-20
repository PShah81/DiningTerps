import { StyleSheet } from 'react-native';
import {verticalScale, moderateScale, horizontalScale} from '../Scale.js';
export default StyleSheet.create({
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