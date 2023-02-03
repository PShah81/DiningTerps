import { useEffect } from "react";
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {Icon} from 'react-native-elements';
import Nutrition from "./Nutrition";
import Food from "../HelperComponents/Food";

export default function Favorites(props)
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

    function generateFoodsAvailable()
    {
        if(Object.keys(props.foodsAvailable).length != 0 && Object.keys(props.foodsAvailable[diningHall]).length != 0)
        {
            let lastItemObject = {};
            for(let i=0; i<Object.keys(props.foodsAvailable[diningHall]).length; i++)
            {
                let mealTimeName = Object.keys(props.foodsAvailable[diningHall])[i];
                let arrOfItems = [];
                let firstItem = true;
                for(let j=0; j< Object.keys(props.foodsAvailable[diningHall][mealTimeName]).length; j++)
                {
                    let foodName = Object.keys(props.foodsAvailable[diningHall][mealTimeName])[j];
                    let foodData = props.foodsAvailable[diningHall][mealTimeName][foodName];
                    let foodAllergies = props.foodsAvailable[diningHall][mealTimeName][foodName]["itemAllergyArr"];
                    arrOfItems.push(
                        <Food key={j} createAllergyImages={createAllergyImages} onItemClick={onItemClick} 
                        foodName={foodName} foodData={foodData}
                        foodAllergies={foodAllergies}
                        firstItem={firstItem} lastItem={false}/>
                    )    
                    lastItemObject = {foodName, foodData, foodAllergies};  
                    firstItem = false;   
                }
                if(arrOfItems.length === 1)
                {
                    firstItem = true;
                }
                arrOfItems[arrOfItems.length-1] = 
                <Food key={arrOfItems.length-1} createAllergyImages={createAllergyImages} onItemClick={onItemClick} 
                foodName={lastItemObject["foodName"]} foodData={lastItemObject["foodData"]} foodAllergies={lastItemObject["foodAllergies"]} 
                firstItem={firstItem} lastItem={true}/>;
                scrollViewDivs.push(
                    <View key={i} style={{margin: "3%", shadowColor: 'black', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.5, backgroundColor: 'white',  borderRadius: 10}}>
                        <Text key={i} style={{fontSize: '24px', textAlign: 'center'}}>{mealTimeName}</Text>
                        {arrOfItems}
                    </View>
                );
            }
            
        }
        if(scrollViewDivs.length === 0)
        {
            scrollViewDivs.push(<Text key={1} style={{fontSize: 30, textAlign: 'center', marginTop: '5%'}}>NO FAVORITES AVAILAVBLE</Text>)
        }
    }













    generateFoodsAvailable();
    return(
        <View style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Nutrition unclickItem={unclickItem} isItemClicked={isItemClicked} addFoodToNotifications={props.addFoodToNotifications} 
            removeFoodFromNotifications={props.removeFoodFromNotifications}  foodObject = {itemClicked}
            alreadyAddedNotification={props.notificationFoodIds.indexOf(itemClicked['food_id']) != -1? true: false} />
            <View style= {{marginBottom: '3%'}}>
                <Text style={{fontSize: '30px', textAlign: 'center'}}>Favorites</Text>
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
            <View style={{height: "83%"}}>
                <ScrollView>
                    {scrollViewDivs}
                </ScrollView>
            </View>
        </View>
    );
}