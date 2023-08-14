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
    filterTitleView: {
        width: '80%', 
        paddingRight: '20%'
    },
    filterTitle: {
        textAlign: 'center',
        color: colorObject["yellow"]["1"],
        fontSize: moderateScale(24),
        fontFamily: 'Roboto-Bold'
    },
    modalContainer: {
        height: '100%',
        backgroundColor: colorObject["grey"]["2"]
    },
    filterContainer: {
        marginLeft: '7%', 
        marginRight: '5%'
    },
    segmentedControl: {
        width: '100%'
    },
    filters: {
        display: 'flex', 
        flexDirection: "row", 
        justifyContent: 'space-around', 
        marginTop: '3%'
    },
    scrollViewContainer: {
        height: '100%'
    },
    scrollViewDivs: {
        margin: "3%",
        backgroundColor: colorObject["grey"]["7"],  
        borderRadius: moderateScale(10)
    },
    sectionTitle: {
        fontSize: moderateScale(24), 
        textAlign: 'center'
    }
});