import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    nutritionMetric: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        borderBottomWidth: 1
    },
    gramAmountContainer:{
        display: 'flex', 
        flexDirection: 'row'
    },
    gramAmount:{
        marginLeft: 10
    },
    modalContainer: {
        marginTop: '10%', 
        height: '80%'
    },
    emptyDataSet: {
        textAlign: 'center', 
        fontSize: 24
    },
    closeButton: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'flex-start', 
        marginBottom: '2%', 
        marginLeft: '2%'
    },
    nutritionFactsContainer: {
        marginLeft: '10%', 
        marginRight: '10%', 
        borderWidth: 1
    },
    nutritionFacts: {
        marginLeft: '3%', 
        marginRight: '3%', 
        marginBottom: '10%'
    },
    nutritionFactsTitle: {
        fontSize: 36, 
        borderBottomWidth: 2
    },
    servingSize: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        borderBottomWidth: 7
    },
    servingAndCalorieContainer: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        borderBottomWidth: 4
    },
    amountPerServing: {
        fontSize: 12
    },
    calories: {
        fontSize: 28
    },
    calorieAmount: {
        fontSize: 36
    },
    dailyValue: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        borderBottomWidth: 1
    },
    favoriteButtonContainer: {
        marginLeft: '10%', 
        marginRight: '10%', 
        marginTop: 'auto'
    },
    favoriteButton: {
        backgroundColor: "orange", 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        height: 40
    },
    favoriteButtonText: {
        color: 'white', 
        textAlign:'center', 
        fontSize: 20
    }
});