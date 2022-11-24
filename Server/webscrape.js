import { table } from "console";
import { get } from "http";
import {JSDOM} from "jsdom";
import fetch from 'node-fetch';


// let date = new Date().toLocaleDateString();
let date = "11/29/2022";
let itemMap = 
{
   "Yahentamitsi": {},
   "251 North": {},
   "South Campus Dining": {}
}
const getDocument = (URL) => {
   return fetch(URL)
      .then((response) => response.text())
      .then((data) => {
         return new JSDOM(data).window.document;
      });
};
let locationNumArr = ['16', '19', '51'];
let locationArr = ['South Campus Dining', 'Yahentamitsi', '251 North'];
for(let i=0; i<3; i++)
{
   let URL = "https://nutrition.umd.edu/?locationNum=" + locationNumArr[i] + "&dtdate=" + date;
   let location = locationArr[i];
   getItemArr(location, date, itemMap, URL);
}

async function getItemArr(location, date, itemMap, URL)
{
   let document = await getDocument(URL);
   itemMap[location][date] = {};
   let infoContainer = document.getElementsByClassName("container")[0].getElementsByClassName("row")[0].getElementsByClassName("section")[1];
   let breakfastLunchDinnerArray = infoContainer.getElementsByClassName("nav nav-tabs")[0].children;
   let itemContainerArray = infoContainer.getElementsByClassName("tab-content editor-content")[0].children;
   let breakfastLunchDinner;
   let itemContainer;
   let cardArr;
   let card;
   let cardTitle; 
   let cardText;
   let itemArr;
   let item;
   let itemName;
   let itemLink;
   let itemAllergyElements;
   let itemAllergyArr;
   for(let i=0; i<itemContainerArray.length; i++)
   {
      breakfastLunchDinner = breakfastLunchDinnerArray[i].getElementsByClassName("nav-link")[0].text;
      itemMap[location][date][breakfastLunchDinner] = {};
      itemContainer = itemContainerArray[i];
      cardArr = itemContainer.children;
      for(let j=0; j<cardArr.length; j++)
      {
         card = cardArr[j];
         cardTitle = card.getElementsByClassName("card-title")[0].textContent;
         cardTitle = cardTitle.substring(1);
         itemMap[location][date][breakfastLunchDinner][cardTitle] = {};
         cardText = card.getElementsByClassName("card-text")[0];
         itemArr = cardText.children;
         for(let k=0; k<itemArr.length; k++)
         {
            item = itemArr[k];
            itemName = item.getElementsByClassName("menu-item-name")[0].text;
            itemMap[location][date][breakfastLunchDinner][cardTitle][itemName] = {};
            itemLink = "https://nutrition.umd.edu/" + item.getElementsByClassName("menu-item-name")[0].href;
            if(item.getElementsByClassName("col-md-4")[0] != undefined)
            {
               itemAllergyElements = item.getElementsByClassName("col-md-4")[0].getElementsByClassName("nutri-icon");
               itemAllergyArr = new Array(itemAllergyElements.length);
               for(let l=0; l<itemAllergyElements.length; l++)
               {
                  itemAllergyArr[l]  = itemAllergyElements[l].alt;
               }
            }
            
            itemMap[location][date][breakfastLunchDinner][cardTitle][itemName]["itemLink"] = itemLink;
            itemMap[location][date][breakfastLunchDinner][cardTitle][itemName]["nutritioFacts"] = getNutritionFacts(location, date, breakfastLunchDinner, cardTitle, itemName, itemLink);
            itemMap[location][date][breakfastLunchDinner][cardTitle][itemName]["itemAllergyArr"] = itemAllergyArr;
         }
      }
   }
}

async function getNutritionFacts(location, date, breakfastLunchDinner, cardTitle, itemName, itemLink)
{
   let nutritionFactsMap  = {};
   let document = await getDocument(itemLink);
   if(document.getElementsByClassName("facts_table")[0] == undefined)
   {
      return undefined;
   }
   nutritionFactsMap["serving size"] = document.getElementsByClassName("facts_table")[0].getElementsByTagName("tbody")[0].children[0].children[0].getElementsByClassName("nutfactsservsize")[1].textContent;
   nutritionFactsMap["calories"] = document.getElementsByClassName("facts_table")[0].getElementsByTagName("tbody")[0].children[0].children[0].getElementsByTagName("p")[1].textContent;
   let tableRowArr = document.getElementsByClassName("facts_table")[0].getElementsByTagName("tbody")[0].children;
   let tableDataArr;
   let nutritionMetric;
   let gramAmount;
   let dailyValue;
   for(let i=1; i<tableRowArr.length-2; i++)
   {
      tableDataArr = tableRowArr[i].children;
      for(let i=0; i<tableDataArr.length; i+=2)
      {
         if(tableDataArr[i].getElementsByTagName("span")[0].textContent.match(/\d(.*)/) != undefined)
         {
            gramAmount = tableDataArr[i].getElementsByTagName("span")[0].textContent.match(/\d.*?g/)[0];
         }
         
         nutritionMetric = tableDataArr[i].getElementsByTagName("span")[0].textContent.replace(gramAmount, '').trim();
         dailyValue = tableDataArr[i+1].getElementsByTagName("span")[0].textContent;
         nutritionFactsMap["Nutrition Metrics"] = {};
         nutritionFactsMap["Nutrition Metrics"][nutritionMetric] = {};
         nutritionFactsMap["Nutrition Metrics"][nutritionMetric]["gram amount"] = gramAmount;
         nutritionFactsMap["Nutrition Metrics"][nutritionMetric]["daily value"] = dailyValue;
         console.log(nutritionFactsMap)
      }
   }
   return nutritionFactsMap;
}
