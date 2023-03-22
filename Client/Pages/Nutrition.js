import { View, Text, TouchableOpacity, Modal, Button, ScrollView} from 'react-native';
import {Icon} from 'react-native-elements';
import styles from './PageStyles/nutritionStyles.js';
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
                        <Text style={{...styles.metrics, marginLeft: marginLeftForName, fontWeight: fontWeightForName}}>{modifiedName}</Text>
                        <View style={styles.gramAmountContainer}>
                            <Text style={styles.gramAmount}>{stats[statName]["gram amount"]}</Text>
                        </View>
                        
                    </View>
                    <View>
                        <Text style={styles.metricDV}>{stats[statName]["daily value"]}</Text>
                    </View>
                </View>
            )
        }
    }
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
                    <TouchableOpacity onPress={()=>{props.unclickItem()}} style={styles.closeButton}>
                            <Icon size={30} name="arrow-back-outline" type='ionicon' color='orange'></Icon>
                    </TouchableOpacity>
                    {props.foodObject.nutritionFacts === undefined ? 
                    <Text style={styles.emptyDataSet}>NO NUTRITION DATA AVAILABLE</Text> :
                    <View style={styles.nutritionFactsContainer}>
                        <View style={styles.nutritionFacts}>
                            <View style={styles.nutritionFactsTitleContainer}>
                                <Text style={styles.nutritionFactsTitle}>Nutrition Facts</Text>
                            </View>
                            <View style={styles.servingSize}>
                                <Text style={styles.servingSizeText}>Serving Size</Text>
                                <Text style={styles.servingSizeAmount}>{props.foodObject.nutritionFacts["serving size"]}</Text>
                            </View>
                            <View style={styles.servingAndCalorieContainer}>
                                <View>
                                    <Text style={styles.amountPerServing}>Amount per serving </Text>
                                    <Text style={styles.calories}>Calories</Text>
                                </View>
                                <View>
                                    <Text style={styles.calorieAmount}>{props.foodObject.nutritionFacts["calories"]}</Text>
                                </View>
                            </View>
                            <View>
                                <View style={styles.dailyValue}>
                                    <Text style={styles.dailyValueTitle}>% Daily Value</Text>
                                </View>
                                {statsArr}
                            </View>
                            <View style={styles.ingredientsContainer}>
                                <ScrollView>
                                    <Text style={styles.ingredients}>
                                        <Text style={styles.ingredientsTitle}>INGREDIENTS: </Text> 
                                        {ingredients}
                                    </Text>
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                    }
                    <View style={styles.favoriteButtonContainer}>
                        <TouchableOpacity onPress={()=>{props.toggleFavoriteFoods(props.foodObject["food_id"])}} style={styles.favoriteButton}>
                            <Text style={styles.favoriteButtonText}>
                                {props.alreadyAddedFavorite? "Delete From Favorites": "Add to Favorites"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
            </Modal>
        </View>
    )
    
}

export default Nutrition