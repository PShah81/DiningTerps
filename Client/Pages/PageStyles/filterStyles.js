import { StyleSheet } from 'react-native';
import {moderateScale} from '../../HelperComponents/Scale.js';
export default StyleSheet.create({
    modalContainer: {
        paddingTop: '10%'
    },
    closeButton: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'flex-start', 
        marginBottom: '2%'
    },
    filterContainer: {
        marginLeft: '7%', 
        marginRight: '5%'
    },
    segmentedControl: {
        width: '100%'
    },
    filters: {
        display: 'flex', 
        flexDirection: "row", 
        justifyContent: 'space-around', 
        marginTop: '3%'
    },
    excludeOrInclude: {
        fontSize: moderateScale(24)
    }
});