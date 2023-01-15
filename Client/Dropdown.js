import DropDownPicker from 'react-native-dropdown-picker';
import {useState } from "react";
import { View} from 'react-native';
export default function Dropdown(props)
{
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(props.default);
    const [items, setItems] = useState(props.items);

  return (
    <View style={{width:"30%"}}>
      <DropDownPicker open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}>
      </DropDownPicker>
    </View>
  );
}