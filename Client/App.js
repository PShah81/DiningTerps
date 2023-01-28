import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from "react";
import Menu from './Pages/Menu';
import Notifications from './Pages/Notifications';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const [todaysMenu, setTodaysMenu] = useState({});
  const [database, setDatabase] = useState({});
  const [currentMode, setCurrentMode] = useState("Menu");
  const [notificationFoodIds, setNotificationFoodIds] = useState([]);
  const [notificationFoods, setNotificationFoods] = useState([]);
  const [UUID, setUUID] = useState('');
  const [notificationsAvailable, setNotificationsAvailable] = useState({});
  
  function changeMode(newMode)
  {
    setCurrentMode(newMode);
  }
  function addFoodToNotifications(itemObject)
  {
    let food_id = itemObject["food_id"];

    let modifiedItemObject = {};
    modifiedItemObject["food_id"] = food_id;
    modifiedItemObject["foodname"] = itemObject["foodname"];
    modifiedItemObject["foodallergies"] = itemObject["itemAllergyArr"];
    modifiedItemObject["fooddata"] = {};
    modifiedItemObject["fooddata"]["itemAllergyArr"] = itemObject["itemAllergyArr"];
    modifiedItemObject["fooddata"]["nutritionFacts"] = itemObject["nutritionFacts"];

    if(notificationFoodIds.indexOf(food_id) === -1)
    {
      setNotificationFoodIds([...notificationFoodIds, food_id])
      setNotificationFoods([...notificationFoods, modifiedItemObject])
      let url = "https://nutritionserver.link/notifications/add";
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
        fetchNotificationsAvailable(UUID);
      })
      .catch((error)=>{console.log(error)});
    }
    
  }

  function removeFoodFromNotifications(itemObject)
  {
    let food_id = itemObject["food_id"];
    if(notificationFoodIds.indexOf(food_id) != -1)
    {
      let newNotificationFoodIds = [...notificationFoodIds];
      newNotificationFoodIds.splice(newNotificationFoodIds.indexOf(food_id), 1);
      setNotificationFoodIds(newNotificationFoodIds);
      for(let foodIndex = 0; foodIndex< notificationFoods.length; foodIndex++)
      {
        if(notificationFoods[foodIndex]["food_id"] === food_id)
        {
          let newNotificationFoods = [...notificationFoods];
          newNotificationFoods.splice(foodIndex, 1);
          setNotificationFoods(newNotificationFoods);
          break;
        }
      }
      let url = "https://nutritionserver.link/notifications/delete";
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
        fetchNotificationsAvailable(UUID);
      })
      .catch((error)=>{console.log(error)});
    }
  }
  function fetchTodaysMenu()
  {
    fetch("https://nutritionserver.link/menu")
    .then((response) => response.json())
    .then((data) => {setTodaysMenu(data)})
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

  function fetchNotificationFoodsAndIds(uuid)
  {
    let url = "https://nutritionserver.link/notificationslist/" + uuid;
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setNotificationFoods(data['notificationsList']);
      setNotificationFoodIds(data['notificationFoodIds']);
    })
  }

  function fetchNotificationsAvailable(uuid)
  {
    let url = "https://nutritionserver.link/notificationsavailable/" + uuid;
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setNotificationsAvailable(data);
    })
  }

  async function runFetches()
  {
    fetchTodaysMenu();
    fetchDatabase();
    let uuid = await fetchUUID();
    fetchNotificationFoodsAndIds(uuid);
    fetchNotificationsAvailable(uuid);
  }
  useEffect(()=>{
    runFetches();
  },[])
  return (
    <View style={styles.container}>
      {currentMode === "Menu" ? <Menu menu={todaysMenu} database={database} changeMode= {changeMode} notificationFoodIds={notificationFoodIds} addFoodToNotifications={addFoodToNotifications} removeFoodFromNotifications={removeFoodFromNotifications}></Menu> : null}
      {currentMode === "Notifications" ? <Notifications changeMode= {changeMode} foodsAvailable={notificationsAvailable} notificationFoods={notificationFoods} notificationFoodIds={notificationFoodIds} addFoodToNotifications={addFoodToNotifications} removeFoodFromNotifications={removeFoodFromNotifications}></Notifications> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: '5%',
    paddingTop: '10%'
  },
});
