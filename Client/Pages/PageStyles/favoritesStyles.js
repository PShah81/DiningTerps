import { StyleSheet } from 'react-native';
import {verticalScale, moderateScale, horizontalScale} from '../../HelperComponents/Scale.js';
export default StyleSheet.create({
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
        fontSize: moderateScale(24), 
        textAlign: 'center',
        fontWeight: '300'
    },
    emptyDataSet: {
        fontSize: moderateScale(30), 
        textAlign: 'center', 
        marginTop: '5%'
    },
    favoritePageContainer: {
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%'
    },
    scrollViewContainer: {
        height: "83%"
    },
    titleContainer:{
        marginBottom: '3%'
    },
    title:{
        fontSize: moderateScale(30), 
        textAlign: 'center'
    },
    navBarContainer:{
        width: '100%', 
        display: 'flex', 
        flexDirection: 'row'
    },
    navButton:{
        flexGrow: 1, 
        borderBottomColor: "orange", 
        width: '33%'
    },
    navName:{
        fontSize: moderateScale(18), 
        color: 'green', 
        textAlign: 'center'
    }
});