import { StyleSheet } from 'react-native';
import {verticalScale, moderateScale, horizontalScale} from '../Scale.js';
import colorObject from '../../HelperComponents/Colors.js';
export default StyleSheet.create({
    allergyCircle: {
        borderWidth: moderateScale(1), 
        borderRadius: moderateScale(25),
        width: moderateScale(20),
        height: moderateScale(20),
        marginRight: moderateScale(2),
        justifyContent: 'center'
    },
    allergyCircleText: {
        textAlign: 'center', 
        color: colorObject["grey"]["7"]
    }
});