import { Platform, StyleSheet } from 'react-native';
import {verticalScale, moderateScale, horizontalScale} from '../../HelperComponents/Scale.js';
import colorObject from '../../HelperComponents/Colors.js';
export default StyleSheet.create({
    scrollViewDivs: {
        margin: "3%",
        backgroundColor: colorObject["grey"]["7"],  
        borderRadius: moderateScale(10)
    }, 
    sectionTitle: {
        fontSize: moderateScale(24), 
        textAlign: 'center',
        fontWeight: '300'
    },
    emptyDataSet: {
        fontSize: moderateScale(24), 
        textAlign: 'center', 
        marginTop: '5%',
        color: colorObject["yellow"]["1"]
    },
    favoritePageContainer: {
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        backgroundColor: colorObject["grey"]["2"]
    },
    scrollViewContainer: {
        height: Platform.OS === 'ios' ? '75%' : '73%',
    },
    titleContainer:{
        backgroundColor: colorObject["red"]["1"],
        height: '12%',
        paddingTop: '5%',
        justifyContent: 'center'
    },
    title:{
        fontSize: moderateScale(30), 
        textAlign: 'center',
        color: colorObject["yellow"]["1"],
        fontFamily: 'Roboto-Bold'
    },
    navBarContainer:{
        width: '100%', 
        display: 'flex', 
        flexDirection: 'row', 
        paddingTop: '1%',
        backgroundColor: colorObject["red"]["1"],
        height: '4%',
        shadowColor: colorObject["grey"]["1"], 
        shadowOffset: {width: 0, height: moderateScale(4)}, 
        shadowOpacity: 0.3, 
        shadowRadius: 0,
        zIndex: 1
    },
    navButton:{
        flexGrow: 1, 
        borderBottomColor: colorObject["grey"]["7"], 
        width: '33%'
    },
    navName:{
        fontSize: moderateScale(18), 
        color: colorObject["yellow"]["1"], 
        textAlign: 'center',
        fontFamily: 'Roboto-Bold'
    }
});