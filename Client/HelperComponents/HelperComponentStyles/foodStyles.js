import { StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import {verticalScale, moderateScale, horizontalScale} from '../Scale.js';
export default StyleSheet.create({
    foodBorder: {
        borderTopWidth: verticalScale(0.8),
        borderColor: "#cacccf"
    },
    foodButton: {
        height: moderateScale(40),
        display: "flex",
        flexDirection: "row"
    },
    foodAllergies: {
        display: 'flex', 
        flexDirection:'row', 
        marginLeft: 'auto',
        marginRight: '4%'
    },
    foodName: {
        marginLeft: '3%',
        fontWeight: '550',
        width: '60%'
    }
});

