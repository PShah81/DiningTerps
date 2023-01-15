import { useEffect } from "react";
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, Image} from 'react-native';
import {Icon} from 'react-native-elements';
import {Tab} from '@rneui/themed';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import MenuSearchBar from "./MenuSearchBar";
import FilterBox from "./FilterBox";
import {DairyImage, EggImage, FishImage, GlutenImage, NutsImage, ShellFishImage,
    SoyImage, SesameImage, VegetarianImage, HalalFriendlyImage, VeganImage, LocalImage} from './pictures/allPictures';

export default function Menu(props)
{
    const [menu, setMenu] = useState({});
    const [diningHall, setDiningHall] = useState("Yahentamitsi");
    const [mealTime, setMealTime] = useState("");
    const [filtering, setFiltering] = useState(false);
    const [displayType, setDisplayType] = useState("Menu");
    const [filters, setFilters] = useState({"Exclude": {"Dairy" : false, "Egg" : false, "Fish" : false, "Gluten": false, "Soy" : false, "Nuts": false, "Shellfish": false, "Sesame" : false}, "Include" :{ "Halal" : false, "Locally Grown" : false, "Vegetarian" : false, "Vegan" : false}})

    function tabSelectMealTime(index)
    {
        setMealTime(Object.keys(menu[diningHall])[index]);
    }
    function onSearch(searchedText)
    {
        console.log(searchedText)
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
            setMenu({...props.getDataForDate(new Date().toLocaleDateString())})
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
            mealTimeArrTabs.push(<Tab.Item key={i} title={Object.keys(menu[diningHall])[i]} titleStyle={{fontSize: 12, color: 'green'}}/>);
            
        }
        if(mealTime != "" && menu[diningHall][mealTime] != undefined)
        {
            let sectionName;
            let itemName;
            for(let i=0; i< Object.keys(menu[diningHall][mealTime]).length; i++)
            {
                sectionName = Object.keys(menu[diningHall][mealTime])[i];
                for(let j=0; j< Object.keys(menu[diningHall][mealTime][sectionName]).length; j++)
                {
                    itemName = Object.keys(menu[diningHall][mealTime][sectionName])[j];
                    
                    if(menu[diningHall][mealTime][sectionName][itemName]['itemAllergyArr'] === undefined || processAllergyArr(menu[diningHall][mealTime][sectionName][itemName]['itemAllergyArr'], exclusionArr, inclusionArr))
                    {
                        arrOfItems.push(
                            <View key={j} style={{borderWidth: 1, height: 40}}>
                                <TouchableOpacity key={j} style={{height: '100%', display: 'flex', flexDirection:'row'}}>
                                    <Text key={(j+1)*10} style= {{marginLeft: '3%'}}>{itemName}</Text> 
                                    <View key={j} style={{display: 'flex', flexDirection:'row', marginLeft: 'auto', marginRight: '4%'}}>
                                        {createAllergyImages(menu[diningHall][mealTime][sectionName][itemName]['itemAllergyArr'])}
                                    </View>
                                    
                                </TouchableOpacity>
                            </View>
                        )   
                    }
                }
                scrollViewDivs.push(
                <View key={i} style={{margin: "3%", borderWidth: 1}}>
                    <Text  key={i} style={{fontSize: '24px', textAlign: 'center',borderBottomWidth: 1, textDecorationLine: 'underline'}}>{sectionName}</Text>
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

    console.log(arrOfItems)
    return(
        <View style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Modal
                animationType="slide"
                transparent={false}
                visible={filtering}
                onRequestClose={() => {
                    setFiltering(false)
                }}
            >
                <View style={{paddingTop: '10%'}}>
                    <TouchableOpacity onPress={()=>{setFiltering(false)}} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginBottom: '2%'}}>
                            <Icon size={30} name="close" type='ionicon' color='orange'></Icon>
                    </TouchableOpacity>
                    <View style= {{marginLeft: '7%', marginRight: '5%'}}>
                        <SegmentedControl
                            values={['Menu', 'Database']}
                            selectedIndex = {['Menu', 'Database'].indexOf(displayType)}
                            onValueChange = {(value)=>{
                                setDisplayType(value)
                            }}
                            style = {{width: '100%'}}
                        />
                        
                        <View style={{display: 'flex', flexDirection: "row", justifyContent: 'space-around', marginTop: '3%'}}>
                            <View>
                                <Text style={{fontSize: 24}}>Exclude</Text>
                                <FilterBox attribute ={"Dairy"} checked={filters["Exclude"]["Dairy"]} changeFilter={changeFilter} image= {DairyImage}/>
                                <FilterBox attribute ={"Egg"} checked={filters["Exclude"]["Egg"]} changeFilter={changeFilter} image= {EggImage}/>
                                <FilterBox attribute ={"Fish"} checked={filters["Exclude"]["Fish"]} changeFilter={changeFilter} image= {FishImage}/>
                                <FilterBox attribute ={"Gluten"} checked={filters["Exclude"]["Gluten"]} changeFilter={changeFilter} image= {GlutenImage}/>
                                <FilterBox attribute ={"Nuts"} checked={filters["Exclude"]["Nuts"]} changeFilter={changeFilter} image= {NutsImage}/>
                                <FilterBox attribute ={"Shellfish"} checked={filters["Exclude"]["Shellfish"]} changeFilter={changeFilter} image=  {ShellFishImage}/>
                                <FilterBox attribute ={"Soy"} checked={filters["Exclude"]["Soy"]} changeFilter={changeFilter} image= {SoyImage}/>
                                <FilterBox attribute ={"Sesame"} checked={filters["Exclude"]["Sesame"]} changeFilter={changeFilter} image= {SesameImage}/>
                            </View>
                            <View>
                                <Text style={{fontSize: 24}}>Include</Text>
                                <FilterBox attribute ={"Vegetarian"} checked={filters["Include"]["Vegetarian"]} changeFilter={changeFilter} image= {VegetarianImage}/>
                                <FilterBox attribute ={"Halal"} checked={filters["Include"]["Halal"]} changeFilter={changeFilter} image= {HalalFriendlyImage}/>
                                <FilterBox attribute ={"Vegan"} checked={filters["Include"]["Vegan"]} changeFilter={changeFilter} image= {VeganImage}/>
                                <FilterBox attribute ={"Locally Grown"} checked={filters["Include"]["Locally Grown"]} changeFilter={changeFilter} image= {LocalImage}/>
                            </View>
                        </View>
                            
                       
                    </View>
                    
                </View>
            </Modal>
            <View style= {{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%'}}>
                <MenuSearchBar onSearch={onSearch}></MenuSearchBar>
                <TouchableOpacity onPress={()=>{setFiltering(true)}}style={{backgroundColor: "white", width: '15%', justifyContent: 'center'}}><Icon size= {30} name='filter-outline' type='ionicon' color='orange'></Icon></TouchableOpacity>
            </View>
            <View style={{width: '96%'}}>
                <Tab
                    value={Object.keys(menu).length === 0? 0: Object.keys(menu[diningHall]).indexOf(mealTime) }
                    onChange={(e) => tabSelectMealTime(e)}
                    dense
                    indicatorStyle={{
                        backgroundColor: 'orange',
                        width: '32%',
                        height: '3%'
                    }}
                >
                    {mealTimeArrTabs}
                </Tab>
            </View>
            <View style={{height: "83%"}}>
                
                <ScrollView>
                    {scrollViewDivs}
                </ScrollView>
            </View>
            <View style= {{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%', position: 'absolute', bottom: 0}}>
                <TouchableOpacity>
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