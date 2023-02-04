import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    databaseSearch: {
        fontSize: 30, 
        textAlign: 'center', 
        marginTop: '5%'
    },
    mealTimeTab: {
        flexGrow: 1, 
        borderBottomColor: "orange", 
        width: '33%'
    },
    tabTitle: {
        fontSize: 18, 
        color: 'green', 
        textAlign: 'center'
    },
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
    }
});