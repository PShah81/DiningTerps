import { View, Text, TouchableOpacity} from 'react-native';
import styles from './HelperComponentStyles/helperFunctionStyles.js';
import {moderateScale} from '../HelperComponents/Scale.js';
export function processAllergyArr(allergyArr, exclusionArr, inclusionArr)
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

export function createAllergyImages(allergyArr)
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
        "HalalFriendly": {"HF": '#3ac2c2'},
        "LocallyGrown": {"L": '#767a7a'}
    }
    let cardArr = [];
    for(let i=0; i<allergyArr.length; i++)
    {
        if(allergyMap[allergyArr[i]] != undefined)
        {
            let infoObject = allergyMap[allergyArr[i]];
            let infoObjectKey = Object.keys(infoObject)[0];
            cardArr.push(
                <View key={i} style={{...styles.allergyCircle, backgroundColor: infoObject[infoObjectKey]}}>
                    <Text style={{...styles.allergyCircleText, 
                    fontSize: infoObjectKey.length > 1 ? moderateScale(12) : moderateScale(14)}}>{infoObjectKey}</Text>
                </View>
            )
        }
    }
    return cardArr;
}
