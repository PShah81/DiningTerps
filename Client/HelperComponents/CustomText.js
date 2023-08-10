import {Text, StyleSheet} from 'react-native';
function CustomText(props)
{
    return (
        <Text style={{fontFamily: 'Roboto-Regular', ...props.style}}>{props.text}</Text>
    );
}
export default CustomText