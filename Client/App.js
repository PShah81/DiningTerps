import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from "react";
import NavBar from './HelperComponents/NavBar';
import Menu from './Pages/Menu';
import data from './SampleData.json';

export default function App() {
  const [weeksData, setWeeksData] = useState({});
  const [currentMode, setCurrentMode] = useState("Menu");
  
  useEffect(()=>{
    fetchWeeksData(new Date().toLocaleDateString());
  },[])
  function fetchWeeksData(date)
  {
    console.log(data);
    setWeeksData(data);
    // fetch("http://localhost:3000/menu?date=" + date)
    // .then((response) => response.json())
    // .then((data) => setWeeksData(data))
    // .catch((error)=>{
    //   console.log(error)
    // })
    // let data = {};
    // fetch('./SampleData.json')
    // .then((response) => response.json())
    // .then((json) => setWeeksData(json));
    // data[date] = {
    //   "Yahentamitsi": {
    //     "Breakfast":{
    //       "Sprouts": {"Broccoli": {}, "Vegan Chicken": {}, "Chickpeas": {}},
    //       "Gluten" : {"Bread": {}, "Cheese": {}, "Pasta": {}},
    //       "Pizza" : {"Mushroom": {}, "Cheese": {}, "Pepperoni": {}}
    //     },
    //     "Lunch":{
    //       "Sprouts": {"Broccoli": {}, "Vegan Chicken": {}, "Chickpeas": {}},
    //       "Mexican": {"Taco": {}, "Enchilada": {}, "Salsa": {}}
    //     },
    //     "Dinner":{
    //       "Sprouts": {"Broccoli": {}, "Vegan Chicken": {}, "Chickpeas": {}}
    //     }
    //   },
    //   "251 North": {
    //     "Breakfast":{
    //       "Sprouts": {"Broccoli": {}, "Vegan Chicken": {}, "Chickpeas": {}},
    //       "Gluten" : {"Bread": {}, "Cheese": {}, "Pasta": {}},
    //       "Pizza" : {"Mushroom": {}, "Cheese": {}, "Pepperoni": {}}
    //     },
    //     "Lunch":{
    //       "Sprouts": {"Broccoli": {}, "Vegan Chicken": {}, "Chickpeas": {}},
    //       "Mexican": {"Taco": {}, "Enchilada": {}, "Salsa": {}}
    //     },
    //     "Dinner":{
    //       "Sprouts": {"Broccoli": {}, "Vegan Chicken": {}, "Chickpeas": {}}
    //     }
    //   },
    //   "South": {
    //     "Breakfast":{"Sprouts": {"Broccoli": {}, "Vegan Chicken": {}, "Chickpeas": {}}},
    //     "Lunch":{"Sprouts": {"Broccoli": {}, "Vegan Chicken": {}, "Chickpeas": {}}},
    //     "Dinner":{"Sprouts": {"Broccoli": {}, "Vegan Chicken": {}, "Chickpeas": {}}}
    //   }
    // };
    // setWeeksData(data);
  }

  function getDataForDate(date)
  {
    if(Object.keys(weeksData).length == 0)
    {
      return {}
    }
    return weeksData;
    // return weeksData[date];
  }
  return (
    <View style={styles.container}>
      {currentMode === "Menu" ? <Menu getDataForDate = {getDataForDate}></Menu> : null}
      {currentMode === "Menu" ? null: <NavBar></NavBar>}
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
