import {View, Text} from 'react-native';
import { CheckBox } from 'react-native-elements';
import styles from './HelperComponentStyles/filterBoxStyles.js';
function FilterBox(props)
{
    let allergyMap = {
        "Dairy": {"D": '#1826de'},
        "Egg": {"E": '#d4c822'},
        "Nuts": {"N":'#de0b24'},
        "Fish": {"F": '#dd37f0'},
        "Sesame": {"SS": '#ed8a11'},
        "Soy": {"S": '#b5e016'},
        "Gluten": {"G": '#ed7802'},
        "Shellfish": {"SF": '#02ede1'},
        "Vegetarian": {"V": '#1f4a04'},
        "Vegan": {"VG": '#7604b0'},
        "Halal": {"HF": '#3ac2c2'},
        "Locally Grown": {"L": '#767a7a'}
    }
    let infoObject = allergyMap[props.attribute];
    let infoObjectKey = Object.keys(infoObject)[0];
    return(
        <View style={styles.filterBoxContainer}>
            <CheckBox
                title= {props.attribute}
                checked={props.checked}
                onPress={()=>{props.changeFilter(props.attribute)}}
                containerStyle= {styles.checkBox}
            />
            <View style={{...styles.allergyCircle, backgroundColor: infoObject[infoObjectKey]}}>
                <Text style={styles.allergyCircleText}>{infoObjectKey}</Text>
            </View>
        </View>
    )
}

export default FilterBox