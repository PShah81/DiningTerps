import { View, Text, TouchableOpacity, Modal, Button} from 'react-native';
import {Icon} from 'react-native-elements';
function Nutrition(props)
{
    let statsArr = [];
    if(props.foodObject.nutritionFacts !== undefined)
    { 
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
            console.log(modifiedName);
            console.log(statName);
            let marginLeftForName = modifiedStats[modifiedName]*10;
            let fontWeightForName = "normal";
            if(modifiedStats[modifiedName]===0)
            {
                fontWeightForName = "bold";
            }
            statsArr.push(
                <View key={i} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1}}>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Text style={{marginLeft: marginLeftForName, fontWeight: fontWeightForName}}>{modifiedName}</Text>
                        <View style={{marginLeft: 10}}>
                            <Text>{stats[statName]["gram amount"]}</Text>
                        </View>
                        
                    </View>
                    <View>
                        <Text>{stats[statName]["daily value"]}</Text>
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
                onRequestClose={() => {
                    props.unclickItem()
                }}
            >
                <View style={{marginTop: '10%', height: '80%'}}>
                    <TouchableOpacity onPress={()=>{props.unclickItem()}} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginBottom: '2%', marginLeft: '2%'}}>
                            <Icon size={30} name="arrow-back-outline" type='ionicon' color='orange'></Icon>
                    </TouchableOpacity>
                    {props.foodObject.nutritionFacts === undefined ? 
                    <Text style={{textAlign: 'center', fontSize: 24}}>NO NUTRITION DATA AVAILABLE</Text> :
                    <View style={{marginLeft: '10%', marginRight: '10%', borderWidth: 1}}>
                        <View style={{marginLeft: '3%', marginRight: '3%', marginBottom: '10%'}}>
                            <Text style={{fontSize: 36, borderBottomWidth: 2}}>Nutrition Facts</Text>
                            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 7}}>
                                <Text>Serving Size</Text>
                                <Text>{props.foodObject.nutritionFacts["serving size"]}</Text>
                            </View>
                            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 4}}>
                                <View>
                                    <Text style={{fontSize: 12}}>Amount per serving </Text>
                                    <Text style={{fontSize: 28}}>Calories</Text>
                                </View>
                                <View>
                                    <Text style={{fontSize: 36}}>{props.foodObject.nutritionFacts["calories"]}</Text>
                                </View>
                            </View>
                            <View>
                                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', borderBottomWidth: 1}}>
                                    <Text>% Daily Value</Text>
                                </View>
                                {statsArr}
                                
                            </View>
                        </View>
                    </View>
                    }

                    <View style={{marginLeft: '10%', marginRight: '10%', marginTop: 'auto'}}>
                        <TouchableOpacity onPress={()=>{props.addFoodToNotifications(props.foodName, props.foodObject)}} style={{backgroundColor: "orange", display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 40}}>
                            <Text style={{color: 'white', textAlign:'center', fontSize: 20}}>Add To Notifications</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
                
            </Modal>
        </View>
    )
    
}

export default Nutrition