import { useEffect } from "react";
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {Icon} from 'react-native-elements';
import Nutrition from "./Nutrition";
import Food from "../HelperComponents/Food";
import {createAllergyImages} from '../HelperComponents/HelperFunctions.js';
import styles from './PageStyles/favoritesStyles.js';

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
                for(let j=0; j< Object.keys(props.foodsAvailable[diningHall][mealTimeName]).length; j++)
                {
                    let foodName = Object.keys(props.foodsAvailable[diningHall][mealTimeName])[j];
                    let foodData = props.foodsAvailable[diningHall][mealTimeName][foodName];
                    let foodAllergies = props.foodsAvailable[diningHall][mealTimeName][foodName]["itemAllergyArr"];
                    arrOfItems.push(
                        <Food key={j} createAllergyImages={createAllergyImages} onItemClick={onItemClick} 
                        foodName={foodName} foodData={foodData}
                        foodAllergies={foodAllergies} lastItem={false}/>
                    )  
                }
                scrollViewDivs.push(
                    <View key={i} style={styles.scrollViewDivs}>
                        <Text key={i} style={styles.sectionTitle}>{mealTimeName}</Text>
                        {arrOfItems}
                    </View>
                );
            }
            
        }
        if(scrollViewDivs.length === 0)
        {
            scrollViewDivs.push(<Text key={1} style={styles.emptyDataSet}>NO FAVORITES AVAILAVBLE</Text>)
        }
    }













    generateFoodsAvailable();
    return(
        <View style={styles.favoritePageContainer}>
            <Nutrition unclickItem={unclickItem} isItemClicked={isItemClicked} addFoodToNotifications={props.addFoodToNotifications} 
            removeFoodFromNotifications={props.removeFoodFromNotifications}  foodObject = {itemClicked}
            alreadyAddedNotification={props.notificationFoodIds.indexOf(itemClicked['food_id']) != -1? true: false} />
            <View style= {styles.titleContainer}>
                <Text style={styles.title}>Favorites</Text>
            </View>
            <View style={styles.navBarContainer}>
                <TouchableOpacity key={"251 North"} onPress={()=>{setDiningHall('251 North')}} style={{borderBottomWidth: (diningHall==="251 North") ? 2 : 0, ...styles.navButton}}>
                    <Text style={styles.navName}>251 North</Text>
                </TouchableOpacity>
                <TouchableOpacity key={"Yahentamitsi"} onPress={()=>{setDiningHall('Yahentamitsi')}} style={{borderBottomWidth: (diningHall==="Yahentamitsi") ? 2 : 0, ...styles.navButton}}>
                    <Text style={styles.navName}>Yahentamitsi</Text>
                </TouchableOpacity>
                <TouchableOpacity key={"South"} onPress={()=>{setDiningHall('South')}} style={{borderBottomWidth: (diningHall==="South") ? 2 : 0, ...styles.navButton}}>
                    <Text style={styles.navName}>South</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.scrollViewContainer}>
                <ScrollView>
                    {scrollViewDivs}
                </ScrollView>
            </View>
        </View>
    );
}