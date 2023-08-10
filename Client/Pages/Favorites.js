import { useEffect } from "react";
import { useState } from "react";
import { View, TouchableOpacity, ScrollView} from 'react-native';
import {Icon} from 'react-native-elements';
import Nutrition from "./Nutrition";
import Food from "../HelperComponents/Food";
import {createAllergyImages} from '../HelperComponents/HelperFunctions.js';
import styles from './PageStyles/favoritesStyles.js';
import {moderateScale, verticalScale, horizontalScale} from  '../HelperComponents/Scale.js';
import CustomText from './../HelperComponents/CustomText.js';

export default function Favorites(props)
{
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

    function generateFavoritesAvailable()
    {
        if(Object.keys(props.favoritesAvailable).length != 0 && Object.keys(props.favoritesAvailable[props.diningHall]).length != 0)
        {
            let lastItemObject = {};
            for(let i=0; i<Object.keys(props.favoritesAvailable[props.diningHall]).length; i++)
            {
                let mealTimeName = Object.keys(props.favoritesAvailable[props.diningHall])[i];
                let arrOfItems = [];
                for(let j=0; j< Object.keys(props.favoritesAvailable[props.diningHall][mealTimeName]).length; j++)
                {
                    let foodName = Object.keys(props.favoritesAvailable[props.diningHall][mealTimeName])[j];
                    let foodData = props.favoritesAvailable[props.diningHall][mealTimeName][foodName];
                    let foodAllergies = props.favoritesAvailable[props.diningHall][mealTimeName][foodName]["itemAllergyArr"];
                    arrOfItems.push(
                        <Food key={j} createAllergyImages={createAllergyImages} onItemClick={onItemClick} 
                        foodName={foodName} foodData={foodData}
                        foodAllergies={foodAllergies} lastItem={false}/>
                    )  
                }
                scrollViewDivs.push(
                    <View key={i} style={styles.scrollViewDivs}>
                        <CustomTextText key={i} style={styles.sectionTitle} text={mealTimeName}/>
                        {arrOfItems}
                    </View>
                );
            }
            
        }
        if(scrollViewDivs.length === 0)
        {
            scrollViewDivs.push(<CustomText key={1} style={styles.emptyDataSet} text={"NO FAVORITES AVAILABLE"}/>)
        }
    }













    generateFavoritesAvailable();
    return(
        <View style={styles.favoritePageContainer}>
            <Nutrition unclickItem={unclickItem} isItemClicked={isItemClicked} toggleFavoriteFoods={props.toggleFavoriteFoods}  
            foodObject = {itemClicked} alreadyAddedFavorite={props.favoriteFoodIds.indexOf(itemClicked['food_id']) != -1? true: false} />
            <View style= {styles.titleContainer}>
                <CustomText style={styles.title} text={"Favorites"}/>
            </View>
            <View style={styles.navBarContainer}>
                <TouchableOpacity key={"251 North"} onPress={()=>{props.changeDiningHall('251 North')}} style={{borderBottomWidth: (props.diningHall==="251 North") ? moderateScale(2) : 0, ...styles.navButton}}>
                    <CustomText style={styles.navName} text={"251 North"}/>
                </TouchableOpacity>
                <TouchableOpacity key={"Yahentamitsi"} onPress={()=>{props.changeDiningHall('Yahentamitsi')}} style={{borderBottomWidth: (props.diningHall==="Yahentamitsi") ? moderateScale(2) : 0, ...styles.navButton}}>
                    <CustomText style={styles.navName} text={"Yahentamitsi"}/>
                </TouchableOpacity>
                <TouchableOpacity key={"South"} onPress={()=>{props.changeDiningHall('South')}} style={{borderBottomWidth: (props.diningHall==="South") ? moderateScale(2) : 0, ...styles.navButton}}>
                    <CustomText style={styles.navName} text={"South"}/>
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