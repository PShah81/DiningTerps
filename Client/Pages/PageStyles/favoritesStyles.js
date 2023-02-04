import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    scrollViewDivs: {
        margin: "3%", 
        shadowColor: 'black', 
        shadowOffset: {width: 0, height: 1}, 
        shadowOpacity: 0.5, 
        backgroundColor: 'white',  
        borderRadius: 10
    }, 
    sectionTitle: {
        fontSize: '24px', 
        textAlign: 'center',
        fontWeight: '300'
    },
    emptyDataSet: {
        fontSize: 30, 
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
        fontSize: '30px', 
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
        fontSize: 18, 
        color: 'green', 
        textAlign: 'center'
    }
});