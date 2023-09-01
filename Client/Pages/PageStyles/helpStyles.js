import { StyleSheet } from 'react-native';
import {moderateScale} from '../../HelperComponents/Scale.js';
import colorObject from '../../HelperComponents/Colors.js';
export default StyleSheet.create({
    topBar: {
        backgroundColor: colorObject["red"]["1"],
        paddingTop: '10%',
        height: '12%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    closeButton: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'flex-start',  
        paddingLeft: '2%',
        width: '20%'
    },
    helpTitleView: {
        width: '80%', 
        paddingRight: '20%'
    },
    helpTitle: {
        textAlign: 'center',
        color: colorObject["yellow"]["1"],
        fontSize: moderateScale(24),
        fontFamily: 'Roboto-Bold'
    },
    modalContainer: {
        height: '100%',
        backgroundColor: colorObject["grey"]["2"]
    },
    helpContainer: {
        marginLeft: '6%', 
        marginRight: '6%'
    },
    scrollViewContainer: {
        height: '100%'
    },
    scrollViewDivs: {
        margin: "3%",
        padding: "1%",
        flexDirection: 'row',
        alignItems: 'baseline',
        backgroundColor: colorObject["grey"]["7"],  
        borderRadius: moderateScale(10)
    },
    sectionTitle: {
        fontSize: moderateScale(24), 
        textAlign: 'center'
    },
    descriptionText: {
        fontSize: moderateScale(16),
        fontFamily: 'Roboto-Regular'
    },
    descriptionTextTitle: {
        fontSize: moderateScale(18),
        color: colorObject["red"]["5"]
    },
    icons: {
        paddingLeft: "5%"
    }
});