import { View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
function Notifications(props)
{
    let foodArr = [];
    console.log(props.foods)
    for(let i=0; i<Object.keys(props.foods).length; i++)
    {
        let foodName = Object.keys(props.foods)[i];
        foodArr.push(
            <View key={i} style={{display: 'flex', flexDirection: 'row'}}>
                <View style={{marginLeft: '10%', width: '70%', borderWidth: 1}}>
                    <Text style={{marginLeft: '2%'}}>{foodName}</Text>
                </View>
                <TouchableOpacity onPress={()=>{props.removeFoodFromNotifications(foodName)}}>
                        <Icon size={30} name="close" type='ionicon' color='orange'></Icon>
                </TouchableOpacity>
            </View>
        )
    }
    return(
        <View style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Text style={{textAlign: 'center', fontSize: 30, marginBottom: '20%'}}>Notifications</Text>
            {foodArr}
        </View>
    )
}

export default Notifications