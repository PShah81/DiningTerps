import { StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import { useEffect, useState, useLayoutEffect} from "react";
import {Icon} from 'react-native-elements';
import Menu from './Pages/Menu';
import Favorites from './Pages/Favorites';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import styles from './appStyles.js';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [todaysMenu, setTodaysMenu] = useState({});
  const [database, setDatabase] = useState({});
  const [mode, setCurrentMode] = useState("Menu");
  const [favoriteFoodIds, setFavoriteFoodIds] = useState([]);
  const [UUID, setUUID] = useState('');
  const [favoritesAvailable, setFavoritesAvailable] = useState({});
  const [diningHall, setDiningHall] = useState('251 North');
  const [mealTime, setMealTime] = useState('');
  const [loadingMenu, setLoadingMenu] = useState(true);
  useEffect(()=>{
    if(loadingMenu === false)
    {
      setTimeout(async () => {
        await SplashScreen.hideAsync();
      }, 2000);
    }
  },[loadingMenu])
  function changeDiningHall(diningHall)
  {
      setDiningHall(diningHall);
      if(Object.keys(todaysMenu[diningHall]).length != 0)
      {
        setMealTime(Object.keys(todaysMenu[diningHall])[0]);
      }
  }
  function changeMode(newMode)
  {
    if(mode != newMode)
    {
      setCurrentMode(newMode);
    }
  }
  function addFoodToFavorites(itemObject)
  {
    let food_id = itemObject["food_id"];
    let modifiedItemObject = {};
    modifiedItemObject["food_id"] = food_id;
    modifiedItemObject["foodname"] = itemObject["foodname"];
    modifiedItemObject["foodallergies"] = itemObject["itemAllergyArr"];
    modifiedItemObject["fooddata"] = {};
    modifiedItemObject["fooddata"]["itemAllergyArr"] = itemObject["itemAllergyArr"];
    modifiedItemObject["fooddata"]["nutritionFacts"] = itemObject["nutritionFacts"];

    if(favoriteFoodIds.indexOf(food_id) === -1)
    {
      setFavoriteFoodIds([...favoriteFoodIds, food_id])
      let url = "https://nutritionserver.link/favorites/add";
      let bodyJson = {};
      bodyJson["uuid"] = UUID;
      bodyJson["food_id"] = food_id;
      fetch(url,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyJson)
      })
      .then(()=>{ 
        fetchFavoritesAvailable(UUID);
      })
      .catch((error)=>{console.log(error)});
    }
    
  }

  function removeFoodFromFavorites(itemObject)
  {
    let food_id = itemObject["food_id"];
    if(favoriteFoodIds.indexOf(food_id) != -1)
    {
      let newFavoriteFoodIds = [...favoriteFoodIds];
      favoriteFoodIds.splice(favoriteFoodIds.indexOf(food_id), 1);
      setFavoriteFoodIds(favoriteFoodIds);
      let url = "https://nutritionserver.link/favorites/delete";
      let bodyJson = {};
      bodyJson["uuid"] = UUID;
      bodyJson["food_id"] = food_id;
      fetch(url,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyJson)
      })
      .then(()=>{
        fetchFavoritesAvailable(UUID);
      })
      .catch((error)=>{console.log(error)});
    }
  }
  function fetchTodaysMenu()
  {
    fetch("https://nutritionserver.link/menu")
    .then((response) => response.json())
    .then((data) => {
      setTodaysMenu(data);
      setMealTime(Object.keys(data[diningHall])[0]);
      setLoadingMenu(false);
    })
    .catch((error)=>{
      console.log(error)
    })
  }

  function fetchDatabase()
  {
    fetch("https://nutritionserver.link/database")
    .then((response) => response.json())
    .then((data) => {setDatabase(data)})
    .catch((error)=>{
      console.log(error)
    })
  }

  async function fetchUUID(){
    let fetchUUID = await SecureStore.getItemAsync('secure_deviceid');
    if (fetchUUID) 
    {
      fetchUUID = fetchUUID.replaceAll("\"", "");
      setUUID(fetchUUID);
    }
    else
    {
      let uuid = uuidv4();
      fetchUUID = uuid;
      await SecureStore.setItemAsync('secure_deviceid', JSON.stringify(uuid));
      setUUID(uuid);
    }
    return fetchUUID;
  }

  function fetchFavoritesAvailable(uuid)
  {
    let url = "https://nutritionserver.link/favoritesavailable/" + uuid;
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setFavoriteFoodIds(data['favoriteFoodIds']);
      setFavoritesAvailable(data['favoritesAvailable']);
    })
    .catch((error)=>{
      console.log(error)
    })
  }

  async function runFetches()
  {
    fetchTodaysMenu();
    fetchDatabase();
    let uuid = await fetchUUID();
    fetchFavoritesAvailable(uuid);
  }
  useEffect(()=>{
    runFetches();
  },[])


  return (
    <View style={styles.container}>
      {mode === "Menu" ? <Menu mealTime={mealTime} setMealTime={setMealTime} diningHall={diningHall} menu={todaysMenu} database={database} changeMode= {changeMode} favoriteFoodIds={favoriteFoodIds} addFoodToFavorites={addFoodToFavorites} removeFoodFromFavorites={removeFoodFromFavorites}></Menu> : null}
      {mode === "Favorites" ? <Favorites diningHall={diningHall} changeDiningHall={changeDiningHall} changeMode= {changeMode} favoritesAvailable={favoritesAvailable} favoriteFoodIds={favoriteFoodIds} addFoodToFavorites={addFoodToFavorites} removeFoodFromFavorites={removeFoodFromFavorites}></Favorites> : null}
      <View style= {styles.navBar}>
          <TouchableOpacity style={{borderTopWidth: (diningHall==="251 North" && mode === "Menu"? 2 : 0), ...styles.navButton}} onPress={()=>{changeMode("Menu"); changeDiningHall('251 North')}}>
              <Text style={styles.navText}>251 North</Text>
              <Icon size={30} name="restaurant" type='material' color='orange'></Icon>
          </TouchableOpacity>
          <TouchableOpacity style={{borderTopWidth: (diningHall==="Yahentamitsi" && mode === "Menu" ? 2 : 0), ...styles.navButton}} onPress={()=>{changeMode("Menu"); changeDiningHall('Yahentamitsi')}}>
              <Text style={styles.navText}>Yahentamitsi</Text>
              <Icon size={30} name="restaurant" type='material' color='orange'></Icon>
          </TouchableOpacity>
          <TouchableOpacity style={{borderTopWidth: (diningHall==="South" && mode === "Menu" ? 2 : 0), ...styles.navButton}} onPress={()=>{changeMode("Menu"); changeDiningHall('South')}}>
              <Text style={styles.navText}>South</Text>
              <Icon size={30} name="restaurant" type='material' color='orange'></Icon>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{changeMode("Favorites")}} style={{borderTopWidth: (mode==="Favorites"? 2 : 0), ...styles.navButton}}>
              <Text style={styles.navText} >Favorites</Text>
              <Icon size={30} name="star-outline" type='ionicon' color='orange'></Icon>
          </TouchableOpacity>
      </View>
    </View>
  );
}

