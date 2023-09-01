import { useEffect } from "react";
import { useState } from "react";
import { View, TouchableOpacity, ScrollView, Modal, Image} from 'react-native';
import {Icon} from 'react-native-elements';
import MenuSearchBar from "../HelperComponents/MenuSearchBar";
import Filter from "./Filter";
import Nutrition from "./Nutrition";
import Help from "./Help";
import Food from "../HelperComponents/Food";
import {processAllergyArr, createAllergyImages} from "../HelperComponents/HelperFunctions.js";
import styles from './PageStyles/menuStyles.js';
import {moderateScale, verticalScale, horizontalScale} from  '../HelperComponents/Scale.js';
import colorObject from './../HelperComponents/Colors.js';
import CustomText from './../HelperComponents/CustomText.js';

export default function Menu(props)
{
    const [helpOpen, setHelpOpen] = useState(false);
    const [filtering, setFiltering] = useState(false);
    const [displayType, setDisplayType] = useState("Menu");
    const [filters, setFilters] = useState({"Exclude": {"Dairy" : false, "Egg" : false, "Fish" : false, "Gluten": false, "Soy" : false, "Nuts": false, "Shellfish": false, "Sesame" : false}, "Include" :{"HalalFriendly" : false, "LocallyGrown" : false, "Vegetarian" : false, "Vegan" : false}})
    const [search, setSearch] = useState("");
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
    function onSearch(updatedSearch)
    {
        setSearch(updatedSearch)
    }
    function stopFiltering()
    {
        setFiltering(false);
    }
    function changeDisplayType(newDisplayType)
    {
        setDisplayType(newDisplayType);
    }
    function changeFilter(filter)
    {
        let newFilters = {...filters};
        if(newFilters["Exclude"][filter] != undefined)
        {
            newFilters["Exclude"][filter] = !newFilters["Exclude"][filter];
        }
        else
        {
            newFilters["Include"][filter] = !newFilters["Include"][filter]
        }
        setFilters(newFilters);
    }
    function searchFilter(foodName)
    {
        let foodNameLower = foodName.toLowerCase();
        let searchWordLower = search.toLowerCase();
        if(searchWordLower.length === 1)
        {
            if(foodNameLower.indexOf(searchWordLower) === 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            if(foodNameLower.indexOf(searchWordLower) != -1)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
    function createInclusionAndExclusionArrays()
    {
        let exclusionArr = [];
        let inclusionArr = [];
        for(let i=0; i<Object.keys(filters["Exclude"]).length; i++)
        {
            if(filters["Exclude"][Object.keys(filters["Exclude"])[i]])
            {
                exclusionArr.push(Object.keys(filters["Exclude"])[i].toLowerCase());
            }
        }
        for(let i=0; i<Object.keys(filters["Include"]).length; i++)
        {
            if(filters["Include"][Object.keys(filters["Include"])[i]])
            {
                inclusionArr.push(Object.keys(filters["Include"])[i].toLowerCase());
            }
        }
        return [inclusionArr, exclusionArr];
    }
    function generateDatabaseItems()
    {
        if(search.length != 0)
        {
            let lastItemObject = {};
            let firstItem = true;
            for(let uniqueFoodIndex = 0; uniqueFoodIndex < props.database.length; uniqueFoodIndex++)
            {
                let {foodname, foodallergies, fooddata, food_id} = props.database[uniqueFoodIndex];
                fooddata = {...fooddata, food_id};
                if(processAllergyArr(foodallergies, exclusionArr, inclusionArr) === true && searchFilter(foodname) === true)
                {
                    if(firstItem === false)
                    {
                        scrollViewDivs.push(
                            <Food key={uniqueFoodIndex} createAllergyImages={createAllergyImages} onItemClick={onItemClick} 
                            foodName={lastItemObject.foodname} foodData={lastItemObject.fooddata} foodAllergies={lastItemObject.foodallergies}
                            lastItem={false} mode= {displayType}/>
                        )
                    }
                    firstItem = false;
                    lastItemObject = {foodname, foodallergies, fooddata};
                }
            }
            if(Object.keys(lastItemObject).length != 0)
            {
                scrollViewDivs.push(
                    <Food key={scrollViewDivs.length} createAllergyImages={createAllergyImages} onItemClick={onItemClick} 
                    foodName={lastItemObject.foodname} foodData={lastItemObject.fooddata} foodAllergies={lastItemObject.foodallergies}
                    lastItem={true} mode={displayType}/>
                )
            }
            
        }
        if(scrollViewDivs.length === 0)
        {
            if(search.length > 0)
            {
                scrollViewDivs.push(<CustomText key={1} style={styles.databaseSearch} text={"NO DATA AVAILABLE"}/>)
            }
            else
            {
                scrollViewDivs.push(<CustomText key={1} style={styles.databaseSearch} text={"SEARCH TO DISPLAY DATA"}/>)
            }
           
        }

        
    }
    function generateMenuItems()
    {
        if(Object.keys(props.menu).length != 0 && Object.keys(props.menu[props.diningHall]).length != 0)
        {
            for(let i=0; i< Object.keys(props.menu[props.diningHall]).length; i++)
            {
                let mealTimeTabName = Object.keys(props.menu[props.diningHall])[i];
                mealTimeArrTabs.push(
                <TouchableOpacity key={i} onPress={()=>{props.setMealTime(mealTimeTabName)}} 
                style={{borderBottomWidth: (mealTimeTabName === props.mealTime) ? moderateScale(2) : 0, ...styles.mealTimeTab}}>
                    <CustomText style={styles.tabTitle} text={mealTimeTabName}/>
                </TouchableOpacity>
                );
                
            }
            if(props.mealTime != "" && props.menu[props.diningHall][props.mealTime] != undefined)
            {
                for(let i=0; i< Object.keys(props.menu[props.diningHall][props.mealTime]).length; i++)
                {
                    let sectionName = Object.keys(props.menu[props.diningHall][props.mealTime])[i];
                    let firstItem = true;
                    let lastItemObject = {};
                    let arrOfItems = [];
                    for(let j=0; j< Object.keys(props.menu[props.diningHall][props.mealTime][sectionName]).length; j++)
                    {
                        let foodName = Object.keys(props.menu[props.diningHall][props.mealTime][sectionName])[j];
                        let foodData = props.menu[props.diningHall][props.mealTime][sectionName][foodName];
                        let foodAllergies = props.menu[props.diningHall][props.mealTime][sectionName][foodName]['itemAllergyArr'];
                        if(processAllergyArr(foodAllergies, exclusionArr, inclusionArr) === true && searchFilter(foodName) === true)
                        {
                            arrOfItems.push(
                                <Food key={j} createAllergyImages={createAllergyImages} onItemClick={onItemClick} 
                                foodName={foodName} foodData={foodData}
                                foodAllergies={foodAllergies} lastItem={false} mode={displayType}/>
                            )
                        }
                            
                    }
                    let section = 
                        <View key={i} style={{...styles.scrollViewDivs, margin: props.uncollapsedSectionNames.indexOf(sectionName) === -1 ? "2.5% 5%" : "5% 5%"}}>
                            <View style={styles.sectionContainer}>
                                <View style={{position: 'absolute'}}>
                                    <CustomText key={i} style={{...styles.sectionTitle, fontSize: sectionName.length > 20 ? moderateScale(18) : moderateScale(24)}} text = {sectionName}/>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity onPress={()=>{props.toggleFavoriteSection(sectionName)}}>
                                        <Icon size= {moderateScale(24)} 
                                        name={props.favoriteSectionNames.indexOf(sectionName) === -1 ? 'star-outline' : 'star'} 
                                        type='material' color={colorObject["red"]["5"]}></Icon>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity onPress={()=>{props.toggleCollapsable(sectionName)}}>
                                        <Icon size= {moderateScale(30)} 
                                        name={props.uncollapsedSectionNames.indexOf(sectionName) === -1 ? 'expand-more' : 'expand-less'} 
                                        type='material' color={colorObject["red"]["5"]}></Icon>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {props.uncollapsedSectionNames.indexOf(sectionName) === -1 ? null : arrOfItems}
                        </View>;
                    
                    if(props.favoriteSectionNames.indexOf(sectionName) === -1)
                    {
                        nonFavoriteDivs.push(section);
                    }
                    else
                    {
                        scrollViewDivs.push(section);
                    }
                }
                scrollViewDivs = scrollViewDivs.concat(nonFavoriteDivs);
            }
            
        }
    
        if(scrollViewDivs.length === 0)
        {
            scrollViewDivs.push(<CustomText key={1} style={styles.emptyDataSet} text={"NO DATA AVAILABLE"}/>)
        }
    }

    let [inclusionArr, exclusionArr] = createInclusionAndExclusionArrays();
    
    //Create Exclusion Inclusion Arrays
    //Wrap items in a div
    let mealTimeArrTabs = [];
    let scrollViewDivs = [];
    let nonFavoriteDivs = [];
    
    if(displayType === "Menu")
    {
        generateMenuItems();
    }
    else
    {
        generateDatabaseItems();
    }
    
    return(
        <View style={styles.menuPageContainer}>
                <Filter displayTypes={['Menu', 'Database']} filtering={filtering} stopFiltering={stopFiltering} changeDisplayType={changeDisplayType} displayType={displayType} filters={filters} changeFilter={changeFilter}/>
                <Nutrition unclickItem={unclickItem} isItemClicked={isItemClicked} toggleFavoriteFoods={props.toggleFavoriteFoods} 
                foodObject = {itemClicked} alreadyAddedFavorite={props.favoriteFoodIds.indexOf(itemClicked['food_id']) != -1? true: false}/>
                <Help helpOpen = {helpOpen} setHelpOpen={setHelpOpen}/>
                <View style= {styles.menuFilters}>
                    <MenuSearchBar onSearch={onSearch} value={search}></MenuSearchBar>
                    <View style={styles.menuHelpButton}>
                        <TouchableOpacity onPress={()=>{setHelpOpen(true)}}><Icon size= {moderateScale(30)} name='help' type='ionicon' color={colorObject["grey"]["7"]}></Icon></TouchableOpacity>
                    </View>
                    <View style={styles.menuFilterButton}>
                        <TouchableOpacity onPress={()=>{setFiltering(true)}}><Icon size= {moderateScale(30)} name='filter-outline' type='ionicon' color={colorObject["grey"]["7"]}></Icon></TouchableOpacity>
                    </View>
                </View>
                <View style={styles.mealTimeTabContainer}>
                    {mealTimeArrTabs}
                </View>
                <View style={styles.scrollView}>
                    <ScrollView>
                        {scrollViewDivs}
                    </ScrollView>
                </View>
        </View>
    );
}
