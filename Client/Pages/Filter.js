import { View, Text, TouchableOpacity, Modal} from 'react-native';
import {Icon} from 'react-native-elements';
import FilterBox from "../HelperComponents/FilterBox";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import styles from './PageStyles/filterStyles.js';
function Filter(props)
{
    return(
        <Modal
            animationType="slide"
            transparent={false}
            visible={props.filtering}
            onRequestClose={() => {
                props.stopFiltering(false)
            }}
        >
            <View style={styles.modalContainer}>
                <TouchableOpacity onPress={()=>{props.stopFiltering(false)}} style={styles.closeButton}>
                        <Icon size={30} name="close" type='ionicon' color='orange'></Icon>
                </TouchableOpacity>
                <View style= {{marginLeft: '7%', marginRight: '5%'}}>
                    <SegmentedControl
                        values={props.displayTypes}
                        selectedIndex = {props.displayTypes.indexOf(props.displayType)}
                        onValueChange = {(value)=>{
                            props.changeDisplayType(value)
                        }}
                        style = {{width: '100%'}}
                    />
                    
                    <View style={{display: 'flex', flexDirection: "row", justifyContent: 'space-around', marginTop: '3%'}}>
                        <View>
                            <Text style={{fontSize: 24}}>Exclude</Text>
                            <FilterBox attribute ={"Dairy"} checked={props.filters["Exclude"]["Dairy"]} changeFilter={props.changeFilter}/>
                            <FilterBox attribute ={"Egg"} checked={props.filters["Exclude"]["Egg"]} changeFilter={props.changeFilter}/>
                            <FilterBox attribute ={"Fish"} checked={props.filters["Exclude"]["Fish"]} changeFilter={props.changeFilter}/>
                            <FilterBox attribute ={"Gluten"} checked={props.filters["Exclude"]["Gluten"]} changeFilter={props.changeFilter}/>
                            <FilterBox attribute ={"Nuts"} checked={props.filters["Exclude"]["Nuts"]} changeFilter={props.changeFilter}/>
                            <FilterBox attribute ={"Shellfish"} checked={props.filters["Exclude"]["Shellfish"]} changeFilter={props.changeFilter}/>
                            <FilterBox attribute ={"Soy"} checked={props.filters["Exclude"]["Soy"]} changeFilter={props.changeFilter}/>
                            <FilterBox attribute ={"Sesame"} checked={props.filters["Exclude"]["Sesame"]} changeFilter={props.changeFilter}/>
                        </View>
                        <View>
                            <Text style={{fontSize: 24}}>Include</Text>
                            <FilterBox attribute ={"Vegetarian"} checked={props.filters["Include"]["Vegetarian"]} changeFilter={props.changeFilter}/>
                            <FilterBox attribute ={"Halal"} checked={props.filters["Include"]["Halal"]} changeFilter={props.changeFilter}/>
                            <FilterBox attribute ={"Vegan"} checked={props.filters["Include"]["Vegan"]} changeFilter={props.changeFilter}/>
                            <FilterBox attribute ={"Locally Grown"} checked={props.filters["Include"]["Locally Grown"]} changeFilter={props.changeFilter}/>
                        </View>
                    </View>
                        
                
                </View>
                
            </View>
        </Modal>
    )
    
}

export default Filter