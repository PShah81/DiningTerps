import {Button , Text, View, TouchableOpacity } from 'react-native';
import {Icon} from 'react-native-elements';
export default function NavBar()
{
    return (
        <View style= {{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 'auto'}}>
            <TouchableOpacity>
                <Text>Home</Text>
                <Icon size={30} name="home-outline" type='ionicon' color='orange'></Icon>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text>Menu</Text>
                <Icon size={30} name="fast-food-outline" type='ionicon' color='orange'></Icon>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text>Notifications</Text>
                <Icon size={30} name="notifications-outline" type='ionicon' color='orange'></Icon>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text>About</Text>
                <Icon size={30} name="person" type='ionicon' color='orange'></Icon>
            </TouchableOpacity>
        </View>
    );
}