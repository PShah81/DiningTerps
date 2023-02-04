import {SearchBar} from 'react-native-elements';
import { useState } from "react";
import styles from './HelperComponentStyles/menuSearchBarStyles.js';
export default function MenuSearchBar(props)
{
    return(
        <SearchBar 
        containerStyle={styles.searchBarContainer} 
        inputContainerStyle={styles.inputContainerStyle} inputStyle={styles.inputStyle} 
        onChangeText={(updatedSearch)=>{props.onSearch(updatedSearch)}} 
        onClear={()=>{props.onSearch("")}}
        value={[props.value]} searchIcon={styles.iconStyle}
        clearIcon={styles.iconStyle}
        round="true"
        ></SearchBar>
    )
}