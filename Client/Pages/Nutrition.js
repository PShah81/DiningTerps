import { View, Text, TouchableOpacity, Modal, Button, ScrollView} from 'react-native';
import {Icon} from 'react-native-elements';
import styles from './PageStyles/nutritionStyles.js';
import CustomText from './../HelperComponents/CustomText.js';
import colorObject from '../HelperComponents/Colors.js';
function Nutrition(props)
{
    let statsArr = [];
    let ingredients;
    if(props.foodObject.nutritionFacts !== undefined)
    { 
        ingredients = props.foodObject.nutritionFacts.ingredients;
        let stats = props.foodObject.nutritionFacts["Nutrition Metrics"];
        let modifiedStats = {"Total Fat": 0, "Saturated Fat": 1, "Trans Fat": 1, "Cholesterol": 0, "Sodium": 0, "Total Carbohydrate": 0, "Dietary Fiber":1, "Total Sugars":1, "Added Sugars":2, "Protein": 0};
        
        for(let i=0; i<Object.keys(modifiedStats).length; i++)
        {
            let statName;
            let modifiedName = Object.keys(modifiedStats)[i];
            for(let j=0; j<Object.keys(stats).length;j++)
            {
                if(Object.keys(stats)[j].indexOf(modifiedName) != -1)
                {
                    statName = Object.keys(stats)[j];
                }
            }
            let marginLeftForName = modifiedStats[modifiedName]*10;
            let fontWeightForName = "normal";
            if(modifiedStats[modifiedName]===0)
            {
                fontWeightForName = "bold";
            }
            statsArr.push(
                <View key={i} style={styles.nutritionMetric}>
                    <View style={styles.metricContainer}>
                        <CustomText style={{...styles.metrics, marginLeft: marginLeftForName, fontWeight: fontWeightForName}} text={modifiedName}/>
                        <View style={styles.gramAmountContainer}>
                            <CustomText style={styles.gramAmount} text={stats[statName]["gram amount"]}/>
                        </View>
                        
                    </View>
                    <View>
                        <CustomText style={styles.metricDV} text={stats[statName]["daily value"]}/>
                    </View>
                </View>
            )
        }
    }
    //<Text> is used here because I need to treat it as a span
    return(
        <View>
            <Modal
                animationType="slide"
                transparent={false}
                visible={props.isItemClicked}
                statusBarTranslucent={true}
                onRequestClose={() => {
                    props.unclickItem()
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.topBar}>
                        <TouchableOpacity onPress={()=>{props.unclickItem()}} style={styles.closeButton}>
                                <Icon size={30} name="arrow-back-outline" type='ionicon' color={colorObject["grey"]["7"]}></Icon>
                        </TouchableOpacity>
                        <View style={styles.foodTitleView}>
                            <CustomText style={styles.foodTitle} text={props.foodObject.foodname}/>
                        </View>
                    </View>
                    {props.foodObject.nutritionFacts === undefined ? 
                    <CustomText style={styles.emptyDataSet} text={"NO NUTRITION DATA AVAILABLE"}/> :
                    <View style={styles.nutritionFactsContainer}>
                        <View style={styles.nutritionFacts}>
                            <View style={styles.nutritionFactsTitleContainer}>
                                <CustomText style={styles.nutritionFactsTitle} text={"Nutrition Facts"}/>
                            </View>
                            <View style={styles.servingSize}>
                                <CustomText style={styles.servingSizeText} text={"Serving Size"}/>
                                <CustomText style={styles.servingSizeAmount} text={props.foodObject.nutritionFacts["serving size"]}/>
                            </View>
                            <View style={styles.servingAndCalorieContainer}>
                                <View>
                                    <CustomText style={styles.amountPerServing} text={"Amount per serving"}/> 
                                    <CustomText style={styles.calories} text={"Calories"} />
                                </View>
                                <View>
                                    <CustomText style={styles.calorieAmount} text={props.foodObject.nutritionFacts["calories"]}/> 
                                </View>
                            </View>
                            <View>
                                <View style={styles.dailyValue}>
                                    <CustomText style={styles.dailyValueTitle} text={"% Daily Value"}/>
                                </View>
                                {statsArr}
                            </View>
                            <View style={styles.ingredientsContainer}>
                                <ScrollView>
                                    <Text>
                                        <CustomText style={styles.ingredientsTitle} text={"INGREDIENTS:"}/> 
                                        <Text style={{fontFamily: 'Roboto-Regular',...styles.ingredients}}>{ingredients}</Text> 
                                    </Text>
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                    }
                    <View style={styles.favoriteButtonContainer}>
                        <TouchableOpacity onPress={()=>{props.toggleFavoriteFoods(props.foodObject["food_id"])}} style={styles.favoriteButton}>
                            <CustomText style={styles.favoriteButtonText}
                                text={props.alreadyAddedFavorite? "Delete From Favorites": "Add to Favorites"}/>
                        </TouchableOpacity>
                    </View>
                </View>
                
            </Modal>
        </View>
    )
    
}

export default Nutrition