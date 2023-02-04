import { StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
export default StyleSheet.create({
    foodBorder: {
        borderTopWidth: 0.8,
        borderColor: "#cacccf"
    },
    foodButton: {
        height: 40,
        display: "flex",
        flexDirection: "row"
    },
    foodAllergies: {
        display: 'flex', 
        flexDirection:'row', 
        marginLeft: 'auto',
        marginRight: '4%'
    },
    foodName: {
        marginLeft: '3%',
        fontWeight: '550'
    }
});

