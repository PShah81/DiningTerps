import {SearchBar} from 'react-native-elements';
import { useState } from "react";
export default function MenuSearchBar(props)
{
    const [search, setSearch] = useState('');
    function onChangeSearch(updatedSearch)
    {
        setSearch(updatedSearch);
    }

    function searched(search)
    {
        setSearch("");
        props.onSearch(search);
    }
    return(
        <SearchBar onSubmitEditing={()=>{searched(search)}} 
        containerStyle={{width: "85%", padding: '0.5%', backgroundColor:"white", borderBottomColor: 'transparent',
        borderTopColor: 'transparent'}} 
        inputContainerStyle={{backgroundColor: '#CDCDCD'}} inputStyle={{color:'black', outline: '0'}} 
        onChangeText={(updatedSearch)=>{onChangeSearch(updatedSearch)}} 
        value={search} searchIcon={{iconStyle:{color: 'black'}}}
        clearIcon={{iconStyle:{color: 'black'}}}
        round="true"
        ></SearchBar>
    )
}