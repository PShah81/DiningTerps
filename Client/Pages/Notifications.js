import { useEffect } from "react";
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {Icon} from 'react-native-elements';
import Nutrition from "./Nutrition";

export default function Notifications(props)
{
    const [diningHall, setDiningHall] = useState("251 North");
    const [isItemClicked, setIsItemClicked] = useState(false);
    const [itemClicked, setItemClicked] = useState({})

    function onItemClick(clickedItem, clickedItemName)
    {
        let itemClickedObject = {...clickedItem};
        itemClickedObject["foodname"] = clickedItemName;
        setItemClicked(itemClickedObject);
        setIsItemClicked(true);
    }
    function unclickItem()
    {
        setIsItemClicked(false);
    }
    
    function processAllergyArr(allergyArr, exclusionArr, inclusionArr)
    {
        if(allergyArr === undefined)
        {
            if(inclusionArr.length > 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        let includedAllergiesCount = 0;
        for(let i=0; i<allergyArr.length; i++)
        {
            if(allergyArr[i].split(" ")[0].toLowerCase() == "contains")
            {
                if(exclusionArr.indexOf(allergyArr[i].split(" ")[1].toLowerCase()) != -1)
                {
                    return false;
                }
            }
            else
            {
                if(inclusionArr.indexOf(allergyArr[i].split(" ")[0].toLowerCase()) != -1)
                {
                    includedAllergiesCount++;
                }
            }
        }
        if(includedAllergiesCount != inclusionArr.length)
        {
            return false;
        }
        return true;
    }

    function createAllergyImages(allergyArr)
    {
        if(allergyArr === undefined)
        {
            return [];
        }
        let allergyMap = {
            "Contains dairy": {"D": '#1826de'},
            "Contains egg": {"E": '#d4c822'},
            "Contains nuts": {"N":'#de0b24'},
            "Contains fish": {"F": '#dd37f0'},
            "Contains sesame": {"SS": '#ed8a11'},
            "Contains soy": {"S": '#b5e016'},
            "Contains gluten": {"G": '#ed7802'},
            "Contains Shellfish": {"SF": '#02ede1'},
            "vegetarian": {"V": '#1f4a04'},
            "vegan": {"VG": '#7604b0'},
            "Halal Friendly": {"HF": '#3ac2c2'},
            "Locally Grown": {"L": '#767a7a'}
        }
        let cardArr = [];
        for(let i=0; i<allergyArr.length; i++)
        {
            if(allergyMap[allergyArr[i]] != undefined)
            {
                let infoObject = allergyMap[allergyArr[i]];
                let infoObjectKey = Object.keys(infoObject)[0];
                cardArr.push(
                    <View key={i} style={{borderWidth: 1, borderRadius: 25, width: 20, height: 20, backgroundColor: infoObject[infoObjectKey]}}>
                        <Text style={{textAlign: 'center', color: 'white'}}>{infoObjectKey}</Text>
                    </View>
                )
            }
        }
        return cardArr;
    }

    
    let scrollViewDivs = [];
    let mealTimeArr = [];
    function generateFoodsAvailable()
    {
        if(Object.keys(props.foodsAvailable).length != 0 && Object.keys(props.foodsAvailable[diningHall]).length != 0)
        {
            if(props.foodsAvailable[diningHall]["mealTimeLength"] === 2)
            {
                mealTimeArr.push(
                    <Text key={'B'} style={{marginTop: 'auto', marginBottom: 'auto'}}>B</Text>
                );
                mealTimeArr.push(
                    <Text key={'D'} style={{marginTop: 'auto', marginBottom: 'auto'}}>D</Text>
                );
            }
            else
            {
                mealTimeArr.push(
                    <Text key={'B'} style={{marginTop: 'auto', marginBottom: 'auto'}}>B</Text>
                );
                mealTimeArr.push(
                    <Text key={'L'} style={{marginTop: 'auto', marginBottom: 'auto'}}>L</Text>
                );
                mealTimeArr.push(
                    <Text key={'D'} style={{marginTop: 'auto', marginBottom: 'auto'}}>D</Text>
                );
            }
            for(let uniqueFoodIndex = 0; uniqueFoodIndex < Object.keys(props.foodsAvailable[diningHall]).length; uniqueFoodIndex++)
            {
                let foodname = Object.keys(props.foodsAvailable[diningHall])[uniqueFoodIndex];
                if(foodname === "mealTimeLength")
                {
                    foodname = Object.keys(props.foodsAvailable[diningHall])[++uniqueFoodIndex];
                }
                let foodallergies = props.foodsAvailable[diningHall][foodname]["itemAllergyArr"];
                let fooddata = props.foodsAvailable[diningHall][foodname];
                let food_id = props.foodsAvailable[diningHall][foodname]["food_id"];
                console.log(foodname);
                console.log(foodallergies);
                console.log(fooddata);
                console.log(food_id);
                
                let clickedItem = {...fooddata};
                clickedItem['food_id'] = food_id;

                let inDiningHallArr = [];
                for(let mealTimeIndex = 0; mealTimeIndex < Object.keys(fooddata["mealTimeObject"]).length; mealTimeIndex++)
                {
                    let mealTime = Object.keys(fooddata["mealTimeObject"])[mealTimeIndex];
                    inDiningHallArr.push(
                        <View key={mealTime} style={{backgroundColor: fooddata["mealTimeObject"][mealTime]? "green" : "red", height: 25, width: 25}}>
                        </View>
                    )
                }
                scrollViewDivs.push(
                    <View key={uniqueFoodIndex} style={{height: 40, display: 'flex', flexDirection: 'row'}}>
                        <TouchableOpacity key={uniqueFoodIndex} onPress={() => {onItemClick(clickedItem, foodname)}} style={{height: '100%', display: 'flex', flexDirection:'row', borderWidth: 1, width: '80%'}}>
                            <Text key={(uniqueFoodIndex+1)*10} style= {{marginLeft: '3%'}}>{foodname}</Text> 
                            <View key={uniqueFoodIndex} style={{display: 'flex', flexDirection:'row', marginLeft: 'auto', marginRight: '4%'}}>
                                {createAllergyImages(foodallergies)}
                            </View>
                        </TouchableOpacity>
                        <View style={{display: 'flex', flexDirection: 'row', width: '20%', justifyContent: 'space-around', alignItems: 'center'}}>
                            {inDiningHallArr}
                        </View>
                    </View>
                
                )
            }
        }
        
        if(scrollViewDivs.length === 0)
        {
            scrollViewDivs.push(<Text key={1} style={{fontSize: 30, textAlign: 'center', marginTop: '5%'}}>NO NOTIFICATIONS</Text>)
        }

        
    }

    generateFoodsAvailable();
    return(
        <View style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Nutrition unclickItem={unclickItem} isItemClicked={isItemClicked} addFoodToNotifications={props.addFoodToNotifications} 
            removeFoodFromNotifications={props.removeFoodFromNotifications}  foodObject = {itemClicked}
            alreadyAddedNotification={props.notificationFoodIds.indexOf(itemClicked['food_id']) != -1? true: false} />
            <View style= {{marginBottom: '3%'}}>
                <Text style={{fontSize: '40px', textAlign: 'center'}}>Favorites</Text>
            </View>
            <View style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                <TouchableOpacity key={"251 North"} onPress={()=>{setDiningHall('251 North')}} style={{borderBottomWidth: (diningHall==="251 North") ? 2 : 0, flexGrow: 1, borderBottomColor: "orange", width: '33%'}}>
                    <Text style={{fontSize: 18, color: 'green', textAlign: 'center'}}>251 North</Text>
                </TouchableOpacity>
                <TouchableOpacity key={"Yahentamitsi"} onPress={()=>{setDiningHall('Yahentamitsi')}} style={{borderBottomWidth: (diningHall==="Yahentamitsi") ? 2 : 0, flexGrow: 1, borderBottomColor: "orange", width: '33%'}}>
                    <Text style={{fontSize: 18, color: 'green', textAlign: 'center'}}>Yahentamitsi</Text>
                </TouchableOpacity>
                <TouchableOpacity key={"South"} onPress={()=>{setDiningHall('South')}} style={{borderBottomWidth: (diningHall==="South") ? 2 : 0, flexGrow: 1, borderBottomColor: "orange", width: '33%'}}>
                    <Text style={{fontSize: 18, color: 'green', textAlign: 'center'}}>South</Text>
                </TouchableOpacity>
            </View>
            <View style={{display: 'flex', flexDirection: 'row', height: '5%'}}>
                <View style={{marginLeft: '4%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start', width: '80%'}}>
                    <Text style={{fontSize: 18, textAlign: 'center'}}>Foods</Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'row', marginLeft: 'auto', width: '20%', justifyContent: 'space-around'}}>
                    {mealTimeArr}
                </View>  
            </View>
            <View style={{height: "83%"}}>
                <ScrollView>
                    {scrollViewDivs}
                </ScrollView>
            </View>
            <View style= {{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%', position: 'absolute', bottom: 0}}>
                <TouchableOpacity onPress={()=>{props.changeMode("Menu")}}>
                    <Text>Menu</Text>
                    <Icon size={30} name="fast-food-outline" type='ionicon' color='orange'></Icon>
                </TouchableOpacity>
            </View>  
        </View>
    );
}