import { useEffect } from "react";
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, Image} from 'react-native';
import {Icon} from 'react-native-elements';
import MenuSearchBar from "../HelperComponents/MenuSearchBar";
import Filter from "./Filter";
import {DairyImage, EggImage, FishImage, GlutenImage, NutsImage, ShellFishImage,
    SoyImage, SesameImage, VegetarianImage, HalalFriendlyImage, VeganImage, LocalImage} from '../pictures/allPictures';
import Nutrition from "./Nutrition";

export default function Menu(props)
{
    const [menu, setMenu] = useState({});
    const [diningHall, setDiningHall] = useState("Yahentamitsi");
    const [mealTime, setMealTime] = useState("");
    const [filtering, setFiltering] = useState(false);
    const [displayType, setDisplayType] = useState("Menu");
    const [filters, setFilters] = useState({"Exclude": {"Dairy" : false, "Egg" : false, "Fish" : false, "Gluten": false, "Soy" : false, "Nuts": false, "Shellfish": false, "Sesame" : false}, "Include" :{ "Halal" : false, "Locally Grown" : false, "Vegetarian" : false, "Vegan" : false}})
    const [search, setSearch] = useState("");
    const [isItemClicked, setIsItemClicked] = useState(false);
    const [itemClicked, setItemClicked] = useState({"Object": {}, "Name": {}})

    function onItemClick(clickedItem, clickedItemName)
    {
        let itemClickedObject = {};
        itemClickedObject["Object"] = clickedItem;
        itemClickedObject["Name"] = clickedItemName;
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
    
    function createAllergyImages(allergyArr)
    {
        if(allergyArr === undefined)
        {
            return [];
        }
        let allergyMap = {
            "Contains dairy": DairyImage,
            "Contains egg": EggImage,
            "Contains nuts": NutsImage,
            "Contains fish": FishImage,
            "Contains sesame": SesameImage,
            "Contains soy": SoyImage,
            "Contains gluten": GlutenImage,
            "Contains Shellfish": ShellFishImage,
            "vegetarian": VegetarianImage,
            "vegan": VeganImage,
            "Halal Friendly": HalalFriendlyImage,
            "Locally Grown": LocalImage
        }
        let imageArr = [];
        for(let i=0; i<allergyArr.length; i++)
        {
            if(allergyMap[allergyArr[i]] != undefined)
            {
                imageArr.push(<Image key={i} source={allergyMap[allergyArr[i]]} style= {{width: 20, height: 20}}/>)
            }
        }
        return imageArr;
    }
    useEffect(()=>{
        if(Object.keys(menu).length === 0)
        {
            setMenu({...props.getData()})
        }
        else if(Object.keys(menu[diningHall]).length !== 0 && (mealTime === ""  || menu[diningHall][mealTime] === undefined))
        {
            setMealTime(Object.keys(menu[diningHall])[0]);
        }
    })

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
    //Create Exclusion Inclusion Arrays
    //Wrap items in a div
    let arrOfItems = [];
    let mealTimeArrTabs = [];
    let scrollViewDivs = [];
    if(Object.keys(menu).length != 0 && Object.keys(menu[diningHall]).length != 0)
    {
        for(let i=0; i< Object.keys(menu[diningHall]).length; i++)
        {
            let mealTimeTabName = Object.keys(menu[diningHall])[i];
            mealTimeArrTabs.push(
            <TouchableOpacity key={i} onPress={()=>{setMealTime(mealTimeTabName)}} style={{borderBottomWidth: (mealTimeTabName === mealTime) ? 2 : 0, flexGrow: 1, borderBottomColor: "orange"}}>
                <Text style={{fontSize: 18, color: 'green', textAlign: 'center'}}>{mealTimeTabName}</Text>
            </TouchableOpacity>
            );
            
        }
        if(mealTime != "" && menu[diningHall][mealTime] != undefined)
        {
            for(let i=0; i< Object.keys(menu[diningHall][mealTime]).length; i++)
            {
                let sectionName = Object.keys(menu[diningHall][mealTime])[i];
                for(let j=0; j< Object.keys(menu[diningHall][mealTime][sectionName]).length; j++)
                {
                    let itemName = Object.keys(menu[diningHall][mealTime][sectionName])[j];
                    
                    if(processAllergyArr(menu[diningHall][mealTime][sectionName][itemName]['itemAllergyArr'], exclusionArr, inclusionArr))
                    {
                        if(itemName.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) != -1)
                        {
                            arrOfItems.push(
                                <View key={j} style={{borderWidth: 1, height: 40}}>
                                    <TouchableOpacity key={j} onPress={() => {onItemClick(menu[diningHall][mealTime][sectionName][itemName], itemName)}} style={{height: '100%', display: 'flex', flexDirection:'row'}}>
                                        <Text key={(j+1)*10} style= {{marginLeft: '3%'}}>{itemName}</Text> 
                                        <View key={j} style={{display: 'flex', flexDirection:'row', marginLeft: 'auto', marginRight: '4%'}}>
                                            {createAllergyImages(menu[diningHall][mealTime][sectionName][itemName]['itemAllergyArr'])}
                                        </View>
                                        
                                    </TouchableOpacity>
                                </View>
                            )   
                        }
                        }
                        
                }
                scrollViewDivs.push(
                <View key={i} style={{margin: "3%", borderWidth: 1}}>
                    <Text  key={i} style={{fontSize: '24px', textAlign: 'center', borderBottomWidth: 1, textDecorationLine: 'underline'}}>{sectionName}</Text>
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

    return(
        <View style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Filter filtering={filtering} stopFiltering={stopFiltering} changeDisplayType={changeDisplayType} displayType={displayType} filters={filters} changeFilter={changeFilter}/>
            <Nutrition unclickItem={unclickItem} isItemClicked={isItemClicked} addFoodToNotifications={props.addFoodToNotifications} foodName={itemClicked["Name"]} foodObject = {itemClicked["Object"]}/>
            <View style= {{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%'}}>
                <MenuSearchBar onSearch={onSearch} value={search}></MenuSearchBar>
                <TouchableOpacity onPress={()=>{setFiltering(true)}}style={{backgroundColor: "white", width: '15%', justifyContent: 'center'}}><Icon size= {30} name='filter-outline' type='ionicon' color='orange'></Icon></TouchableOpacity>
            </View>
            <View style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                {mealTimeArrTabs}
            </View>
            <View style={{height: "83%"}}>
                
                <ScrollView>
                    {scrollViewDivs}
                </ScrollView>
            </View>
            <View style= {{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%', position: 'absolute', bottom: 0}}>
                <TouchableOpacity onPress={()=>{props.changeMode("Home")}}>
                    <Text>Home</Text>
                    <Icon size={30} name="home-outline" type='ionicon' color='orange'></Icon>
                </TouchableOpacity>
                <TouchableOpacity  onPress={()=>{setDiningHall('251 North')}}>
                    <Text>251 North</Text>
                    <Icon size={30} name="restaurant" type='material' color='orange'></Icon>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{setDiningHall('Yahentamitsi')}}>
                    <Text>Yahentamitsi</Text>
                    <Icon size={30} name="restaurant" type='material' color='orange'></Icon>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{setDiningHall('South')}}>
                    <Text>South</Text>
                    <Icon size={30} name="restaurant" type='material' color='orange'></Icon>
                </TouchableOpacity>
            </View>  
        </View>
    );
}


//ISSUE WITH NOT BEING ABLE TO SWITCH TO THE LAST TAB