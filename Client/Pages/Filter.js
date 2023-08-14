import { View, TouchableOpacity, Modal, ScrollView} from 'react-native';
import {Icon} from 'react-native-elements';
import FilterBox from "../HelperComponents/FilterBox";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import styles from './PageStyles/filterStyles.js';
import {moderateScale} from '../HelperComponents/Scale.js';
import CustomText from './../HelperComponents/CustomText.js';
import colorObject from '../HelperComponents/Colors.js';
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
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={()=>{props.stopFiltering(false)}} style={styles.closeButton}>
                            <Icon size={30} name="arrow-back-outline" type='ionicon' color={colorObject["grey"]["7"]}></Icon>
                    </TouchableOpacity>
                    <View style={styles.filterTitleView}>
                        <CustomText style={styles.filterTitle} text={"Filters"}/>
                    </View>
                </View>
                <View style= {styles.filterContainer}>
                    <View style={styles.scrollViewContainer}>
                        <ScrollView>
                            <View style={styles.scrollViewDivs}>
                                <SegmentedControl
                                    values={props.displayTypes}
                                    selectedIndex = {props.displayTypes.indexOf(props.displayType)}
                                    onValueChange = {(value)=>{
                                        props.changeDisplayType(value)
                                    }}
                                    style = {styles.segmentedControl}
                                />
                            </View>
                            <View style={styles.scrollViewDivs}>
                                <CustomText style={styles.sectionTitle} text={"Only Include These Items"}/>
                                <FilterBox attribute ={"Vegetarian"} checked={props.filters["Include"]["Vegetarian"]} changeFilter={props.changeFilter}/>
                                <FilterBox attribute ={"HalalFriendly"} checked={props.filters["Include"]["HalalFriendly"]} changeFilter={props.changeFilter}/>
                                <FilterBox attribute ={"Vegan"} checked={props.filters["Include"]["Vegan"]} changeFilter={props.changeFilter}/>
                                <FilterBox attribute ={"LocallyGrown"} checked={props.filters["Include"]["LocallyGrown"]} changeFilter={props.changeFilter}/>
                            </View>
                            <View style={styles.scrollViewDivs}>
                                <CustomText style={styles.sectionTitle} text={"Exclude These Items"}/>
                                <FilterBox attribute ={"Dairy"} checked={props.filters["Exclude"]["Dairy"]} changeFilter={props.changeFilter}/>
                                <FilterBox attribute ={"Egg"} checked={props.filters["Exclude"]["Egg"]} changeFilter={props.changeFilter}/>
                                <FilterBox attribute ={"Fish"} checked={props.filters["Exclude"]["Fish"]} changeFilter={props.changeFilter}/>
                                <FilterBox attribute ={"Gluten"} checked={props.filters["Exclude"]["Gluten"]} changeFilter={props.changeFilter}/>
                                <FilterBox attribute ={"Nuts"} checked={props.filters["Exclude"]["Nuts"]} changeFilter={props.changeFilter}/>
                                <FilterBox attribute ={"Shellfish"} checked={props.filters["Exclude"]["Shellfish"]} changeFilter={props.changeFilter}/>
                                <FilterBox attribute ={"Soy"} checked={props.filters["Exclude"]["Soy"]} changeFilter={props.changeFilter}/>
                                <FilterBox attribute ={"Sesame"} checked={props.filters["Exclude"]["Sesame"]} changeFilter={props.changeFilter}/>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </View>
        </Modal>
    )
    
}

export default Filter