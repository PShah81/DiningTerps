import { StyleSheet } from 'react-native';
import {verticalScale, moderateScale, horizontalScale} from '../Scale.js';
import colorObject from '../../HelperComponents/Colors.js';
export default StyleSheet.create({
    filterBoxContainer: {
        display: 'flex', 
        flexDirection: "row", 
        alignItems: "center",
        paddingLeft: "2%",
        borderTopWidth: verticalScale(1),
        borderColor: colorObject['grey']['6']
    },
    checkBox: {
        backgroundColor: colorObject["grey"]["7"], 
        borderWidth: 0, 
        marginLeft: 0, 
        marginRight: 0, 
        padding: 0
    },
    textStyle: {
        fontSize: moderateScale(16)
    },
    allergyCircle: {
        borderWidth: moderateScale(1), 
        borderRadius: moderateScale(25),
        width: moderateScale(20),
        height: moderateScale(20),
        justifyContent: "center"
    },
    allergyCircleText: {
        textAlign: 'center',
        color: colorObject["grey"]["7"]
    }
    
});

