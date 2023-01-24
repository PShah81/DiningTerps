import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from "react";
import NavBar from './HelperComponents/NavBar';
import Menu from './Pages/Menu';
import data from './SampleData.json';
import Notifications from './Pages/Notifications';
import Home from './Pages/Home';

export default function App() {
  const [todaysMenu, setTodaysMenu] = useState({});
  const [database, setDatabase] = useState({});
  const [currentMode, setCurrentMode] = useState("Menu");
  const [notificationFoods, setNotificationFoods] = useState({});
  
  function changeMode(newMode)
  {
    setCurrentMode(newMode);
  }
  function addFoodToNotifications(itemName, itemObject)
  {
    let newNotificationFoods = {...notificationFoods};
    newNotificationFoods[itemName] = itemObject;
    setCurrentMode("Notifications");
    setNotificationFoods(newNotificationFoods);
  }

  function removeFoodFromNotifications(itemName)
  {
    let newNotificationFoods = {...notificationFoods};
    delete newNotificationFoods[itemName];
    setNotificationFoods(newNotificationFoods);
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

  useEffect(()=>{
    fetchTodaysMenu();
    fetchDatabase();
  },[])
  console.log(notificationFoods)
  return (
    <View style={styles.container}>
      {currentMode === "Menu" ? <Menu menu={todaysMenu} database={database} changeMode= {changeMode} addFoodToNotifications={addFoodToNotifications}></Menu> : null}
      {/* {currentMode === "Notifications" ? <Notifications foods={notificationFoods} removeFoodFromNotifications={removeFoodFromNotifications}></Notifications> : null} */}
      {currentMode === "Home" ? <Home></Home> : null}
      {currentMode === "Home" ? <NavBar changeMode={changeMode}></NavBar>: null}

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
