import { useEffect } from "react";
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, Image} from 'react-native';
import {Icon} from 'react-native-elements';
import MenuSearchBar from "../HelperComponents/MenuSearchBar";
import Filter from "./Filter";
import Nutrition from "./Nutrition";

export default function Menu(props)
{
    const [diningHall, setDiningHall] = useState("251 North");
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
    useEffect(()=>{
        if(Object.keys(props.menu).length != 0 && Object.keys(props.menu[diningHall]).length != 0 && (mealTime === ""  || props.menu[diningHall][mealTime] === undefined))
        {
            setMealTime(Object.keys(props.menu[diningHall])[0]);
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
    let arrOfItems = [];
    let mealTimeArrTabs = [];
    let scrollViewDivs = [];
    function generateDatabaseItems()
    {
        if(search.length != 0)
        {
            for(let uniqueFoodIndex = 0; uniqueFoodIndex < props.database.length; uniqueFoodIndex++)
            {
                let {foodname, foodallergies, fooddata, food_id} = props.database[uniqueFoodIndex];
                if(processAllergyArr(foodallergies, exclusionArr, inclusionArr) === true && searchFilter(foodname) === true)
                {
                    scrollViewDivs.push(
                        <View key={uniqueFoodIndex} style={{borderWidth: 1, height: 40}}>
                            <TouchableOpacity key={uniqueFoodIndex} onPress={() => {onItemClick({food_id,...fooddata}, foodname)}} style={{height: '100%', display: 'flex', flexDirection:'row'}}>
                                <Text key={(uniqueFoodIndex+1)*10} style= {{marginLeft: '3%'}}>{foodname}</Text> 
                                <View key={uniqueFoodIndex} style={{display: 'flex', flexDirection:'row', marginLeft: 'auto', marginRight: '4%'}}>
                                    {createAllergyImages(foodallergies)}
                                </View>
                            </TouchableOpacity>
                        </View>
                    
                    )
                }
                
            }
        }
        if(scrollViewDivs.length === 0)
        {
            scrollViewDivs.push(<Text key={1} style={{fontSize: 30, textAlign: 'center', marginTop: '5%'}}>SEARCH TO DISPLAY DATA</Text>)
        }

        
    }
    function generateMenuItems()
    {
        if(Object.keys(props.menu).length != 0 && Object.keys(props.menu[diningHall]).length != 0)
        {
            for(let i=0; i< Object.keys(props.menu[diningHall]).length; i++)
            {
                let mealTimeTabName = Object.keys(props.menu[diningHall])[i];
                mealTimeArrTabs.push(
                <TouchableOpacity key={i} onPress={()=>{setMealTime(mealTimeTabName)}} style={{borderBottomWidth: (mealTimeTabName === mealTime) ? 2 : 0, flexGrow: 1, borderBottomColor: "orange"}}>
                    <Text style={{fontSize: 18, color: 'green', textAlign: 'center'}}>{mealTimeTabName}</Text>
                </TouchableOpacity>
                );
                
            }
            if(mealTime != "" && props.menu[diningHall][mealTime] != undefined)
            {
                for(let i=0; i< Object.keys(props.menu[diningHall][mealTime]).length; i++)
                {
                    let sectionName = Object.keys(props.menu[diningHall][mealTime])[i];
                    for(let j=0; j< Object.keys(props.menu[diningHall][mealTime][sectionName]).length; j++)
                    {
                        let itemName = Object.keys(props.menu[diningHall][mealTime][sectionName])[j];
                        
                        if(processAllergyArr(props.menu[diningHall][mealTime][sectionName][itemName]['itemAllergyArr'], exclusionArr, inclusionArr) === true && searchFilter(itemName) === true)
                        {
                                arrOfItems.push(
                                    <View key={j} style={{borderWidth: 1, height: 40}}>
                                        <TouchableOpacity key={j} onPress={() => {onItemClick(props.menu[diningHall][mealTime][sectionName][itemName], itemName)}} style={{height: '100%', display: 'flex', flexDirection:'row'}}>
                                            <Text key={(j+1)*10} style= {{marginLeft: '3%'}}>{itemName}</Text> 
                                            <View key={j} style={{display: 'flex', flexDirection:'row', marginLeft: 'auto', marginRight: '4%'}}>
                                                {createAllergyImages(props.menu[diningHall][mealTime][sectionName][itemName]['itemAllergyArr'])}
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )   
                        }
                            
                    }
                    scrollViewDivs.push(
                    <View key={i} style={{margin: "3%", borderWidth: 1}}>
                        <Text key={i} style={{fontSize: '24px', textAlign: 'center', borderBottomWidth: 1, textDecorationLine: 'underline'}}>{sectionName}</Text>
                        {arrOfItems}
                    </View>
                    );
                    arrOfItems = [];
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
            alreadyAddedNotification={props.notificationFoodIds.indexOf(itemClicked['id']) != -1? true: false}/>
            <View style= {{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%'}}>
                <MenuSearchBar onSearch={onSearch} value={search}></MenuSearchBar>
                <TouchableOpacity onPress={()=>{setFiltering(true)}}style={{backgroundColor: "white", width: '15%', justifyContent: 'center'}}><Icon size= {30} name='filter-outline' type='ionicon' color='orange'></Icon></TouchableOpacity>
            </View>
            <View style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                {mealTimeArrTabs}
            </View>
            <View style={{height: displayType === "Menu"? "83%" : "86%"}}>
                
                <ScrollView>
                    {scrollViewDivs}
                </ScrollView>
            </View>
            <View style= {{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%', position: 'absolute', bottom: 0}}>
                <TouchableOpacity onPress={()=>{props.changeMode("Notifications")}}>
                    <Text>Notifications</Text>
                    <Icon size={30} name="notifications-outline" type='ionicon' color='orange'></Icon>
                </TouchableOpacity>
                <TouchableOpacity style={{borderTopWidth: diningHall==="251 North"? 1 : 0}} onPress={()=>{setDiningHall('251 North')}}>
                    <Text>251 North</Text>
                    <Icon size={30} name="restaurant" type='material' color='orange'></Icon>
                </TouchableOpacity>
                <TouchableOpacity style={{borderTopWidth: diningHall==="Yahentamitsi"? 1 : 0}} onPress={()=>{setDiningHall('Yahentamitsi')}}>
                    <Text>Yahentamitsi</Text>
                    <Icon size={30} name="restaurant" type='material' color='orange'></Icon>
                </TouchableOpacity>
                <TouchableOpacity style={{borderTopWidth: diningHall==="South"? 1 : 0}} onPress={()=>{setDiningHall('South')}}>
                    <Text>South</Text>
                    <Icon size={30} name="restaurant" type='material' color='orange'></Icon>
                </TouchableOpacity>
            </View>  
        </View>
    );
}


//ISSUE WITH NOT BEING ABLE TO SWITCH TO THE LAST TAB