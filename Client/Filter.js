import { View, Text, TouchableOpacity, Modal} from 'react-native';
import {Icon} from 'react-native-elements';
import FilterBox from "./FilterBox";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import {DairyImage, EggImage, FishImage, GlutenImage, NutsImage, ShellFishImage,
    SoyImage, SesameImage, VegetarianImage, HalalFriendlyImage, VeganImage, LocalImage} from './pictures/allPictures';
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
            <View style={{paddingTop: '10%'}}>
                <TouchableOpacity onPress={()=>{props.stopFiltering(false)}} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginBottom: '2%'}}>
                        <Icon size={30} name="close" type='ionicon' color='orange'></Icon>
                </TouchableOpacity>
                <View style= {{marginLeft: '7%', marginRight: '5%'}}>
                    <SegmentedControl
                        values={['Menu', 'Database']}
                        selectedIndex = {['Menu', 'Database'].indexOf(props.displayType)}
                        onValueChange = {(value)=>{
                            props.changeDisplayType(value)
                        }}
                        style = {{width: '100%'}}
                    />
                    
                    <View style={{display: 'flex', flexDirection: "row", justifyContent: 'space-around', marginTop: '3%'}}>
                        <View>
                            <Text style={{fontSize: 24}}>Exclude</Text>
                            <FilterBox attribute ={"Dairy"} checked={props.filters["Exclude"]["Dairy"]} changeFilter={props.changeFilter} image= {DairyImage}/>
                            <FilterBox attribute ={"Egg"} checked={props.filters["Exclude"]["Egg"]} changeFilter={props.changeFilter} image= {EggImage}/>
                            <FilterBox attribute ={"Fish"} checked={props.filters["Exclude"]["Fish"]} changeFilter={props.changeFilter} image= {FishImage}/>
                            <FilterBox attribute ={"Gluten"} checked={props.filters["Exclude"]["Gluten"]} changeFilter={props.changeFilter} image= {GlutenImage}/>
                            <FilterBox attribute ={"Nuts"} checked={props.filters["Exclude"]["Nuts"]} changeFilter={props.changeFilter} image= {NutsImage}/>
                            <FilterBox attribute ={"Shellfish"} checked={props.filters["Exclude"]["Shellfish"]} changeFilter={props.changeFilter} image=  {ShellFishImage}/>
                            <FilterBox attribute ={"Soy"} checked={props.filters["Exclude"]["Soy"]} changeFilter={props.changeFilter} image= {SoyImage}/>
                            <FilterBox attribute ={"Sesame"} checked={props.filters["Exclude"]["Sesame"]} changeFilter={props.changeFilter} image= {SesameImage}/>
                        </View>
                        <View>
                            <Text style={{fontSize: 24}}>Include</Text>
                            <FilterBox attribute ={"Vegetarian"} checked={props.filters["Include"]["Vegetarian"]} changeFilter={props.changeFilter} image= {VegetarianImage}/>
                            <FilterBox attribute ={"Halal"} checked={props.filters["Include"]["Halal"]} changeFilter={props.changeFilter} image= {HalalFriendlyImage}/>
                            <FilterBox attribute ={"Vegan"} checked={props.filters["Include"]["Vegan"]} changeFilter={props.changeFilter} image= {VeganImage}/>
                            <FilterBox attribute ={"Locally Grown"} checked={props.filters["Include"]["Locally Grown"]} changeFilter={props.changeFilter} image= {LocalImage}/>
                        </View>
                    </View>
                        
                
                </View>
                
            </View>
        </Modal>
    )
    
}

export default Filter