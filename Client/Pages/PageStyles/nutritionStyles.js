import { StyleSheet } from 'react-native';
import {verticalScale, moderateScale, horizontalScale} from '../../HelperComponents/Scale.js';
export default StyleSheet.create({
    nutritionMetric: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        borderBottomWidth: verticalScale(1)
    },
    metricContainer:{
        display: 'flex', 
        flexDirection: 'row'
    },
    gramAmountContainer: {
        marginLeft: horizontalScale(10)
    },
    gramAmount:{
        fontSize: moderateScale(12)
    },
    modalContainer: {
        marginTop: '10%', 
        height: '80%'
    },
    emptyDataSet: {
        textAlign: 'center', 
        fontSize: moderateScale(24)
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
        borderWidth: verticalScale(1),
        height: '65%'
    },
    nutritionFacts: {
        marginLeft: '3%', 
        marginRight: '3%', 
        marginBottom: '5%',
        flex: 1
    },
    nutritionFactsTitleContainer: {
        borderBottomWidth: verticalScale(2)
    },
    nutritionFactsTitle:{
        fontSize: moderateScale(36)
    },
    servingSize: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        borderBottomWidth: verticalScale(7)
    },
    servingAndCalorieContainer: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        borderBottomWidth: verticalScale(4)
    },
    amountPerServing: {
        fontSize: moderateScale(12)
    },
    calories: {
        fontSize: moderateScale(28)
    },
    calorieAmount: {
        fontSize: moderateScale(36)
    },
    dailyValue: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'flex-end',
        borderBottomWidth: verticalScale(1)
    },
    dailyValueTitle:{
        fontSize: moderateScale(16)
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
        height: verticalScale(40)
    },
    favoriteButtonText: {
        color: 'white', 
        textAlign:'center', 
        fontSize: moderateScale(20)
    },
    ingredientsContainer: {
        marginTop: '2%',
        flex: 1
    },
    ingredientsTitle: {
        fontWeight: '700'
    },
    metrics: {
        fontSize: moderateScale(12)
    },
    metricDV: {
        fontSize: moderateScale(12)
    },
    servingSizeText:{
        fontSize: moderateScale(16)
    },
    servingSizeAmount:{
        fontSize: moderateScale(16)
    },
    ingredients: {
        fontSize: moderateScale(10)
    }
});