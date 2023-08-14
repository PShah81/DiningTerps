import { StyleSheet } from 'react-native';
import {verticalScale, moderateScale, horizontalScale} from '../Scale.js';
import colorObject from '../../HelperComponents/Colors.js';
export default StyleSheet.create({
    foodContainer: {
        borderTopWidth: verticalScale(1),
        borderColor: colorObject['grey']['6']
    },
    foodButton: {
        height: moderateScale(40),
        display: "flex",
        flexDirection: "row",
        alignItems: 'center'
    },
    foodAllergies: {
        display: 'flex', 
        flexDirection:'row', 
        marginLeft: 'auto',
        paddingRight: '4%',
        alignItems: 'center'
    },
    foodName: {
        paddingLeft: '3%',
        fontWeight: '500',
        width: '60%',
        color: colorObject['grey']['3']
    }
});

