import { View, Text, TouchableOpacity, ScrollView, Modal, Image} from 'react-native';
import styles from './HelperComponentStyles/foodStyles.js';
function Food(props)
{
    return(
        <View style={{...styles.foodBorder, borderBottomWidth: props.lastItem? 0.5: 0}}>
            <TouchableOpacity onPress={() => {props.onItemClick(props.foodData, props.foodName)}} style={styles.foodButton}>
                <Text style= {styles.foodName}>{props.foodName}</Text> 
                <View style={styles.foodAllergies}>
                    {props.createAllergyImages(props.foodAllergies)}
                </View>
            </TouchableOpacity>
        </View>
    )

    
}

export default Food;