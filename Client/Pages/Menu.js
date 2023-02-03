import { useEffect } from "react";
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, Image} from 'react-native';
import {Icon} from 'react-native-elements';
import MenuSearchBar from "../HelperComponents/MenuSearchBar";
import Filter from "./Filter";
import Nutrition from "./Nutrition";
import Food from "../HelperComponents/Food";
import {processAllergyArr, createAllergyImages} from "../HelperComponents/HelperFunctions.js";

export default function Menu(props)
{
    const [mealTime, setMealTime] = useState("");
    const [filtering, setFiltering] = useState(false);
    const [displayType, setDisplayType] = useState("Menu");
    const [filters, setFilters] = useState({"Exclude": {"Dairy" : false, "Egg" : false, "Fish" : false, "Gluten": false, "Soy" : false, "Nuts": false, "Shellfish": false, "Sesame" : false}, "Include" :{ "Halal" : false, "Locally Grown" : false, "Vegetarian" : false, "Vegan" : false}})
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

    useEffect(()=>{
        if(Object.keys(props.menu).length != 0 && Object.keys(props.menu[props.diningHall]).length != 0 && (mealTime === ""  || props.menu[props.diningHall][mealTime] === undefined))
        {
            setMealTime(Object.keys(props.menu[props.diningHall])[0]);
        }
    })
    
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

    let [inclusionArr, exclusionArr] = createInclusionAndExclusionArrays();
    
    //Create Exclusion Inclusion Arrays
    //Wrap items in a div
    let mealTimeArrTabs = [];
    let scrollViewDivs = [];
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
                            lastItem={false}/>
                        )
                    }
                    firstItem = false;
                    lastItemObject = {foodname, foodallergies, fooddata};
                }
            }
            scrollViewDivs.push(
                <Food key={scrollViewDivs.length} createAllergyImages={createAllergyImages} onItemClick={onItemClick} 
                foodName={lastItemObject.foodname} foodData={lastItemObject.fooddata} foodAllergies={lastItemObject.foodallergies}
                lastItem={true}/>
            )
        }
        if(scrollViewDivs.length === 0)
        {
            scrollViewDivs.push(<Text key={1} style={{fontSize: 30, textAlign: 'center', marginTop: '5%'}}>SEARCH TO DISPLAY DATA</Text>)
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
                <TouchableOpacity key={i} onPress={()=>{setMealTime(mealTimeTabName)}} style={{borderBottomWidth: (mealTimeTabName === mealTime) ? 2 : 0, flexGrow: 1, borderBottomColor: "orange", width: '33%'}}>
                    <Text style={{fontSize: 18, color: 'green', textAlign: 'center'}}>{mealTimeTabName}</Text>
                </TouchableOpacity>
                );
                
            }
            if(mealTime != "" && props.menu[props.diningHall][mealTime] != undefined)
            {
                for(let i=0; i< Object.keys(props.menu[props.diningHall][mealTime]).length; i++)
                {
                    let sectionName = Object.keys(props.menu[props.diningHall][mealTime])[i];
                    let firstItem = true;
                    let lastItemObject = {};
                    let arrOfItems = [];
                    for(let j=0; j< Object.keys(props.menu[props.diningHall][mealTime][sectionName]).length; j++)
                    {
                        let foodName = Object.keys(props.menu[props.diningHall][mealTime][sectionName])[j];
                        let foodData = props.menu[props.diningHall][mealTime][sectionName][foodName];
                        let foodAllergies = props.menu[props.diningHall][mealTime][sectionName][foodName]['itemAllergyArr'];
                        if(processAllergyArr(foodAllergies, exclusionArr, inclusionArr) === true && searchFilter(foodName) === true)
                        {
                            arrOfItems.push(
                                <Food key={j} createAllergyImages={createAllergyImages} onItemClick={onItemClick} 
                                foodName={foodName} foodData={foodData}
                                foodAllergies={foodAllergies} lastItem={false}/>
                            )
                        }
                            
                    }
                    scrollViewDivs.push(
                    <View key={i} style={{margin: "3%", shadowColor: 'black', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.5, backgroundColor: 'white',  borderRadius: 10}}>
                        <Text key={i} style={{fontSize: '24px', textAlign: 'center'}}>{sectionName}</Text>
                        {arrOfItems}
                    </View>
                    );
                }
                
            }
            
        }
    
        if(scrollViewDivs.length === 0)
        {
            scrollViewDivs.push(<Text key={1} style={{fontSize: 30, textAlign: 'center', marginTop: '5%'}}>NO DATA AVAILAVBLE</Text>)
        }
    }
    
    if(displayType === "Menu")
    {
        generateMenuItems();
    }
    else
    {
        generateDatabaseItems();
    }

    return(
        <View style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Filter displayTypes={['Menu', 'Database']} filtering={filtering} stopFiltering={stopFiltering} changeDisplayType={changeDisplayType} displayType={displayType} filters={filters} changeFilter={changeFilter}/>
            <Nutrition unclickItem={unclickItem} isItemClicked={isItemClicked} addFoodToNotifications={props.addFoodToNotifications} 
            removeFoodFromNotifications={props.removeFoodFromNotifications} foodObject = {itemClicked}
            alreadyAddedNotification={props.notificationFoodIds.indexOf(itemClicked['food_id']) != -1? true: false}/>
            <View style= {{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%'}}>
                <MenuSearchBar onSearch={onSearch} value={search}></MenuSearchBar>
                <TouchableOpacity onPress={()=>{setFiltering(true)}}style={{backgroundColor: "white", width: '15%', justifyContent: 'center'}}><Icon size= {30} name='filter-outline' type='ionicon' color='orange'></Icon></TouchableOpacity>
            </View>
            <View style={{width: '100%', display: 'flex', flexDirection: 'row', paddingTop: '1%'}}>
                {mealTimeArrTabs}
            </View>
            <View>
                <ScrollView>
                    {scrollViewDivs}
                </ScrollView>
            </View>
        </View>
    );
}


//ISSUE WITH NOT BEING ABLE TO SWITCH TO THE LAST TAB