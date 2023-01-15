import {View, Image} from 'react-native';
import { CheckBox } from 'react-native-elements';
function FilterBox(props)
{
    return(
        <View style={{display: 'flex', flexDirection: "row", alignItems: 'center'}}>
            <CheckBox
                title= {props.attribute}
                checked={props.checked}
                onPress={()=>{props.changeFilter(props.attribute)}}
                containerStyle= {{backgroundColor: 'white', borderWidth: 0, marginLeft: 0, marginRight: 0, padding: 0}}
            />
            <Image source={props.image} style= {{width: 20, height: 20}}/>
        </View>
    )
}

export default FilterBox