import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: '10%'
    },
    navBar: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        width: '100%', 
        position: 'absolute', 
        bottom: 0, 
        backgroundColor: 'white', 
        paddingBottom: '5%',
        height: '8%'
    },
    navButton: {
        borderColor: 'orange', 
        width: '25%'
    },
    navText: {
        textAlign: 'center', 
        color: 'green'
    }
});