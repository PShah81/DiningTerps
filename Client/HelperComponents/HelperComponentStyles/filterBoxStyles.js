import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    filterBoxContainer: {
        display: 'flex', 
        flexDirection: "row", 
        alignItems: 'center'
    },
    checkBox: {
        backgroundColor: 'white', 
        borderWidth: 0, 
        marginLeft: 0, 
        marginRight: 0, 
        padding: 0
    },
    allergyCircle: {
        borderWidth: 1, 
        borderRadius: 25, 
        width: 20, 
        height: 20
    },
    allergyCircleText: {
        textAlign: 'center', 
        color: 'white'
    }
    
});

