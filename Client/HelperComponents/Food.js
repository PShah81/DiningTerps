import { View, TouchableOpacity, ScrollView, Modal, Image} from 'react-native';
import styles from './HelperComponentStyles/foodStyles.js';
import {verticalScale, moderateScale, horizontalScale} from './Scale.js';
import CustomText from './../HelperComponents/CustomText.js';
import colorObject from '../HelperComponents/Colors.js';
function Food(props)
{
    return(
        <View style={{...styles.foodContainer, borderBottomWidth: props.lastItem? verticalScale(0.5): 0, 
            backgroundColor: props.mode === "Database" ? colorObject["grey"]["7"] : null}}>
            <TouchableOpacity onPress={() => {props.onItemClick(props.foodData, props.foodName)}} style={styles.foodButton}>
                <CustomText style= {{...styles.foodName, fontSize: props.foodName.length > 45 ? moderateScale(10) : moderateScale(14)}} text={props.foodName}/> 
                <View style={styles.foodAllergies}>
                    {props.createAllergyImages(props.foodAllergies)}
                </View>
            </TouchableOpacity>
        </View>
    )

    
}

export default Food;