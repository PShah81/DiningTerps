import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from "react";
import NavBar from './HelperComponents/NavBar';
import Menu from './Pages/Menu';
import data from './SampleData.json';
import Notifications from './Pages/Notifications';

export default function App() {
  const [todaysMenu, setTodaysMenu] = useState({});
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
    console.log(newNotificationFoods)
    setNotificationFoods(newNotificationFoods);
  }

  function removeFoodFromNotifications(itemName)
  {
    let newNotificationFoods = {...notificationFoods};
    delete newNotificationFoods[itemName];
    console.log(newNotificationFoods)
    setNotificationFoods(newNotificationFoods);
  }
  function fetchTodaysMenu()
  {
    setTodaysMenu(data);
    // fetch("http://localhost:3000/menu?date=" + date)
    // .then((response) => response.json())
    // .then((data) => setWeeksData(data))
    // .catch((error)=>{
    //   console.log(error)
    // })
  }

  function getData()
  {
    if(Object.keys(todaysMenu).length == 0)
    {
      return {}
    }
    return todaysMenu;
  }

  useEffect(()=>{
    fetchTodaysMenu();
  },[])
  console.log(notificationFoods)
  return (
    <View style={styles.container}>
      {currentMode === "Menu" ? <Menu getData = {getData} changeMode= {changeMode} addFoodToNotifications={addFoodToNotifications}></Menu> : null}
      {currentMode === "Notifications" ? <Notifications foods={notificationFoods} removeFoodFromNotifications={removeFoodFromNotifications}></Notifications> : null}
      {currentMode === "Menu" ? null: <NavBar changeMode={changeMode}></NavBar>}
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
