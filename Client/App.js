import { StyleSheet, View, TouchableOpacity} from 'react-native';
import { useEffect, useState, useLayoutEffect} from "react";
import {Icon} from 'react-native-elements';
import Menu from './Pages/Menu';
import Favorites from './Pages/Favorites';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import styles from './appStyles.js';
import * as SplashScreen from 'expo-splash-screen';
import {moderateScale, verticalScale, horizontalScale} from  './HelperComponents/Scale.js';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import colorObject from './HelperComponents/Colors.js';
import CustomText from './HelperComponents/CustomText.js';
import { useFonts } from 'expo-font';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync(uuid)
{
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      let url = "https://nutritionserver.link/settings/pushToken/remove";
      let bodyJson = {};
      bodyJson["uuid"] = uuid;
      bodyJson["modification"] = null;
      fetch(url,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyJson)
      })
      .catch((error)=>{console.log(error)});
      return;
    }
    else
    {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      let url = "https://nutritionserver.link/settings/pushToken/create";
      let bodyJson = {};
      bodyJson["uuid"] = uuid;
      bodyJson["modification"] = token;
      fetch(url,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyJson)
      })
      .catch((error)=>{console.log(error)});
    }
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}

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
  const [favoriteSectionNames, setFavoriteSectionNames] = useState([]);
  const [uncollapsedSectionNames, setUncollapsedSectionNames] = useState([]);
  const [didFontLoadYet, setDidFontLoadYet] = useState(false);
  const [fontsLoaded] = useFonts({
    "Roboto-Regular" : require('./assets/fonts/Roboto-Regular.ttf'),
    "Roboto-Bold"    : require('./assets/fonts/Roboto-Bold.ttf')
  })

  useEffect(()=>{
    setDidFontLoadYet(true)
  }, [fontsLoaded])
  
  useEffect(()=>{
    if(loadingMenu === false && fontsLoaded === true)
    {
      setTimeout(async () => {
        await SplashScreen.hideAsync();
      }, 2000);
    }
  },[loadingMenu])
  useEffect(()=>{
    if(Object.keys(todaysMenu).length != 0)
    {
      defaultMealTime(diningHall);
      setLoadingMenu(false);
    }
  },[todaysMenu])
  function defaultMealTime(newDiningHall)
  {
    let localHours = new Date(new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})).getHours();
    if(Object.keys(todaysMenu[newDiningHall]).length === 3)
    {
      if(localHours < 11)
      {
        setMealTime(Object.keys(todaysMenu[newDiningHall])[0]);
      }
      else if(localHours < 17)
      {
        setMealTime(Object.keys(todaysMenu[newDiningHall])[1]);
      }
      else
      {
        setMealTime(Object.keys(todaysMenu[newDiningHall])[2]);
      }
    }
    else
    {
      if(localHours < 17)
      {
        setMealTime(Object.keys(todaysMenu[newDiningHall])[0]);
      }
      else 
      {
        setMealTime(Object.keys(todaysMenu[newDiningHall])[1]);
      }
    }
  }
  function changeDiningHall(newDiningHall)
  {
      setDiningHall(newDiningHall);
      if(Object.keys(todaysMenu[newDiningHall]).length != 0)
      {
        defaultMealTime(newDiningHall);  
      }
  }
  function changeMode(newMode)
  {
    if(mode != newMode)
    {
      setCurrentMode(newMode);
    }
  }
  function toggleFavoriteFoods(food_id)
  {
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
    else
    {
      let newFavoriteFoodIds = [...favoriteFoodIds];
      newFavoriteFoodIds.splice(newFavoriteFoodIds.indexOf(food_id), 1);
      setFavoriteFoodIds(newFavoriteFoodIds);
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
  function toggleFavoriteSection(sectionName)
  {
    if(favoriteSectionNames.indexOf(sectionName) === -1)
    {
      setFavoriteSectionNames([...favoriteSectionNames, sectionName]);
      let url = "https://nutritionserver.link/settings/favoriteSections/add";
      let bodyJson = {};
      bodyJson["uuid"] = UUID;
      bodyJson["modification"] = sectionName;
      fetch(url,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyJson)
      })
      .then(()=>{
        fetchSettings(UUID);
      })
      .catch((error)=>{console.log(error)});
    }
    else
    {
      let newFavoriteSectionNames = [...favoriteSectionNames];
      newFavoriteSectionNames.splice(newFavoriteSectionNames.indexOf(sectionName), 1);
      setFavoriteSectionNames(newFavoriteSectionNames);
      let url = "https://nutritionserver.link/settings/favoriteSections/delete";
      let bodyJson = {};
      bodyJson["uuid"] = UUID;
      bodyJson["modification"] = sectionName;
      fetch(url,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyJson)
      })
      .then(()=>{
        fetchSettings(UUID);
      })
      .catch((error)=>{console.log(error)});
    }
  }
  function toggleCollapsable(sectionName)
  {
    if(uncollapsedSectionNames.indexOf(sectionName) === -1)
    {
      setUncollapsedSectionNames([...uncollapsedSectionNames, sectionName]);
    }
    else
    {
      let newUncollapsedSectionNames = [...uncollapsedSectionNames];
      newUncollapsedSectionNames.splice(newUncollapsedSectionNames.indexOf(sectionName), 1);
      setUncollapsedSectionNames(newUncollapsedSectionNames);
    }
  }
  function fetchTodaysMenu()
  {
    fetch("https://nutritionserver.link/menu")
    .then((response) => response.json())
    .then((data) => {
      setTodaysMenu(data);
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
      fetchUUID = fetchUUID.replace("\"", "").replace("\"", "");
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

  function fetchSettings(uuid)
  {
    let url = "https://nutritionserver.link/settings/" + uuid;
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if(Object.keys(data).length != 0)
      {
        setFavoriteSectionNames(data['favoriteSections']);
      }
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
    fetchSettings(uuid);
    registerForPushNotificationsAsync(uuid);
  }
  useEffect(()=>{
    runFetches();
    Notifications.setBadgeCountAsync(0);
  },[])

//Don't render if the menu and fonts aren't done loading 
  return (
    (loadingMenu === false && fontsLoaded === true ?
    (<View style={styles.container}>
      {mode === "Menu" ? <Menu mealTime={mealTime} setMealTime={setMealTime} diningHall={diningHall} 
      menu={todaysMenu} database={database} changeMode= {changeMode} favoriteFoodIds={favoriteFoodIds} 
      toggleFavoriteFoods={toggleFavoriteFoods} favoriteSectionNames={favoriteSectionNames} 
      toggleFavoriteSection={toggleFavoriteSection} uncollapsedSectionNames={uncollapsedSectionNames} 
      toggleCollapsable={toggleCollapsable}></Menu> : null}
      {mode === "Favorites" ? <Favorites diningHall={diningHall} changeDiningHall={changeDiningHall} changeMode= {changeMode} favoritesAvailable={favoritesAvailable} favoriteFoodIds={favoriteFoodIds} toggleFavoriteFoods={toggleFavoriteFoods}></Favorites> : null}
      <View style= {styles.navBar}>
          <TouchableOpacity style={{borderTopWidth: (diningHall==="251 North" && mode === "Menu"? moderateScale(3) : 0), ...styles.navButton}} onPress={()=>{changeMode("Menu"); changeDiningHall('251 North')}}>
              <CustomText style={styles.navText} text={"251 North"}/>
              <Icon size={moderateScale(30)} name="restaurant" type='material' color={colorObject["grey"]["7"]}></Icon>
          </TouchableOpacity>
          <TouchableOpacity style={{borderTopWidth: (diningHall==="Yahentamitsi" && mode === "Menu" ? moderateScale(3) : 0), ...styles.navButton}} onPress={()=>{changeMode("Menu"); changeDiningHall('Yahentamitsi')}}>
              <CustomText style={styles.navText} text={"Yahentamitsi"}/>
              <Icon size={moderateScale(30)} name="restaurant" type='material' color={colorObject["grey"]["7"]}></Icon>
          </TouchableOpacity>
          <TouchableOpacity style={{borderTopWidth: (diningHall==="South" && mode === "Menu" ? moderateScale(3) : 0), ...styles.navButton}} onPress={()=>{changeMode("Menu"); changeDiningHall('South')}}>
              <CustomText style={styles.navText} text={"South"}/>
              <Icon size={moderateScale(30)} name="restaurant" type='material' color={colorObject["grey"]["7"]}></Icon>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{changeMode("Favorites")}} style={{borderTopWidth: (mode==="Favorites"? moderateScale(3) : 0), ...styles.navButton}}>
              <CustomText style={styles.navText} text={"Favorites"}/>
              <Icon size={moderateScale(30)} name="heart-outline" type='ionicon' color={colorObject["grey"]["7"]}></Icon>
          </TouchableOpacity>
      </View>
    </View>
    ) : null)
  );
}

