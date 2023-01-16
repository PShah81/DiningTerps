import {SearchBar} from 'react-native-elements';
import { useState } from "react";
export default function MenuSearchBar(props)
{

    return(
        <SearchBar 
        containerStyle={{width: "85%", padding: '0.5%', backgroundColor:"white", borderBottomColor: 'transparent',
        borderTopColor: 'transparent'}} 
        inputContainerStyle={{backgroundColor: '#CDCDCD'}} inputStyle={{color:'black', outline: '0'}} 
        onChangeText={(updatedSearch)=>{props.onSearch(updatedSearch)}} 
        onClear={()=>{props.onSearch("")}}
        value={[props.value]} searchIcon={{iconStyle:{color: 'black'}}}
        clearIcon={{iconStyle:{color: 'black'}}}
        round="true"
        ></SearchBar>
    )
}