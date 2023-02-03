import { View, Text, TouchableOpacity, ScrollView, Modal, Image} from 'react-native';

function Food(props)
{
    return(
        <View style={{borderTopWidth: 0.5 , borderColor: 'grey', height: 40, borderBottomWidth: props.lastItem? 0.5: 0}}>
            <TouchableOpacity onPress={() => {props.onItemClick(props.foodData, props.foodName)}} style={{height: '100%', display: 'flex', flexDirection:'row'}}>
                <Text style= {{marginLeft: '3%'}}>{props.foodName}</Text> 
                <View style={{display: 'flex', flexDirection:'row', marginLeft: 'auto', marginRight: '4%'}}>
                    {props.createAllergyImages(props.foodAllergies)}
                </View>
            </TouchableOpacity>
        </View>
    )

    
}

export default Food;