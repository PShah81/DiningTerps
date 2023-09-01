import {Text, View, TouchableOpacity, Modal, ScrollView} from 'react-native';
import {Icon} from 'react-native-elements';
import styles from './PageStyles/helpStyles.js';
import {moderateScale} from '../HelperComponents/Scale.js';
import CustomText from './../HelperComponents/CustomText.js';
import colorObject from '../HelperComponents/Colors.js';
function Help(props)
{
    return(
        <Modal
            animationType="slide"
            transparent={false}
            visible={props.helpOpen}
            onRequestClose={() => {
                props.setHelpOpen(false)
            }}
        >
            <View style={styles.modalContainer}>
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={()=>{props.setHelpOpen(false)}} style={styles.closeButton}>
                            <Icon size={30} name="arrow-back-outline" type='ionicon' color={colorObject["grey"]["7"]}></Icon>
                    </TouchableOpacity>
                    <View style={styles.helpTitleView}>
                        <CustomText style={styles.helpTitle} text={"Help"}/>
                    </View>
                </View>
                <View style= {styles.helpContainer}>
                    <View style={styles.scrollViewContainer}>
                        <ScrollView>
                            <View style={styles.scrollViewDivs}>
                                    <Text style={styles.descriptionText}>
                                        <Text style={styles.descriptionTextTitle}> More Info </Text>
                                        <Text> Tap an item for its Nutrition Facts with an Add To Favorites option</Text>
                                    </Text>
                            </View>
                            <View style={styles.scrollViewDivs}>
                                    <Text style={styles.descriptionText}>
                                        <Icon containerStyle={styles.icons} size= {moderateScale(24)} name='filter-outline' type='ionicon' color={colorObject["red"]["5"]}></Icon>
                                        <Text> Access dietary filters for easier app navigation based on your preferences and restrictions.</Text>
                                    </Text>
                            </View>
                            <View style={styles.scrollViewDivs}>
                                    <Text style={styles.descriptionText}>
                                        <Icon containerStyle={styles.icons} size= {moderateScale(24)} name="heart-outline" type='ionicon' color={colorObject["red"]["5"]}></Icon>
                                        <Text> Go to Favorites to see your preferred dining hall foods and get notified when they're available</Text>
                                    </Text>
                            </View>
                            <View style={styles.scrollViewDivs}>
                                    <Text style={styles.descriptionText}>
                                        <Icon containerStyle={styles.icons} size= {moderateScale(24)} name="star-outline" type='material' color={colorObject["red"]["5"]}></Icon>
                                        <Text> Click this to move a section to the top of the list permenantly</Text>
                                    </Text>
                            </View>
                            <View style={styles.scrollViewDivs}>
                                    <Text style={styles.descriptionText}>
                                        <Icon containerStyle={styles.icons} size= {moderateScale(24)} name='expand-more' type='material' color={colorObject["red"]["5"]}></Icon>
                                        <Text> Click this button to display the section's items</Text>
                                    </Text>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </View>
        </Modal>
    )
    
}

export default Help