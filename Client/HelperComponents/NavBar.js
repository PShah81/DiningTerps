import {Button , Text, View, TouchableOpacity } from 'react-native';
import {Icon} from 'react-native-elements';
export default function NavBar(props)
{
    return (
        <View style= {{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 'auto'}}>
            <TouchableOpacity onPress={()=>{props.changeMode("Home")}}>
                <Text>Home</Text>
                <Icon size={30} name="home-outline" type='ionicon' color='orange'></Icon>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{props.changeMode("Menu")}}>
                <Text>Menu</Text>
                <Icon size={30} name="fast-food-outline" type='ionicon' color='orange'></Icon>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={()=>{props.changeMode("Notifications")}}>
                <Text>Notifications</Text>
                <Icon size={30} name="notifications-outline" type='ionicon' color='orange'></Icon>
            </TouchableOpacity> */}
        </View>
    );
}