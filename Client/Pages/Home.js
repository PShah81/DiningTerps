import { View, Text} from 'react-native';
function Home()
{
    return(
        <View>
            <View style={{marginLeft: "10%", marginRight: "10%"}}>
                <Text style={{fontSize: 32}} >Welcome to Dining Terps!</Text>
            </View>

            <View style={{marginLeft: "10%", marginRight: "10%", marginTop: "10%"}}>
                <Text style={{fontSize: 12, marginBottom: "3%"}}>The menu tab displays the items for the day</Text>
                <Text style={{fontSize: 12, marginBottom: "3%"}}>The notification tab displays items you want to get notifications for if they appear in the day's menu</Text>     
                <Text style={{fontSize: 12}}>Click on an item to: </Text>
                <Text style={{fontSize: 12, marginLeft: '5%'}}>-see its nutrition facts </Text>
                <Text style={{fontSize: 12, marginLeft: '5%'}}>-add it to your notification list </Text>
                
                    
            </View>
        </View>
        
    )
}

export default Home