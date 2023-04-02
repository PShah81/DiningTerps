import { Platform, StyleSheet } from 'react-native';
import {verticalScale, moderateScale, horizontalScale} from '../../HelperComponents/Scale.js';
export default StyleSheet.create({
    databaseSearch: {
        fontSize: moderateScale(30), 
        textAlign: 'center', 
        marginTop: '5%'
    },
    mealTimeTab: {
        flexGrow: 1, 
        borderBottomColor: "orange", 
        width: '33%'
    },
    tabTitle: {
        fontSize: moderateScale(18), 
        color: 'green', 
        textAlign: 'center'
    },
    scrollViewDivs: {
        margin: "3%", 
        shadowColor: 'black', 
        shadowOffset: {width: 0, height: 1}, 
        shadowOpacity: 0.3, 
        shadowRadius: 13,
        elevation: 30,
        backgroundColor: 'white',  
        borderRadius: moderateScale(10)
    }, 
    sectionTitle: { 
        textAlign: 'center', 
        fontWeight: '300'
    },
    emptyDataSet: {
        fontSize: moderateScale(30), 
        textAlign: 'center', 
        marginTop: '5%'
    },
    menuPageContainer: {
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%'
    },
    menuFilters: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        width: '100%'
    },
    menuFilterButton: {
        backgroundColor: "white", 
        width: '15%', 
        justifyContent: 'center'
    },
    mealTimeTabContainer: {
        width: '100%', 
        display: 'flex', 
        flexDirection: 'row', 
        paddingTop: '1%'
    },
    scrollDivHeight:{
        height: Platform.OS === 'ios' ? '87%' : '82%'
    },
    sectionContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 'auto'
    }
});