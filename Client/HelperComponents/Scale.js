import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
//Guideline sizes are based on standard ~6" screen mobile device
const guidelineBaseWidth = 412;
const guidelineBaseHeight = 896;

const horizontalScale = size => width / guidelineBaseWidth * size;
const verticalScale = size => {
    return height / guidelineBaseHeight * size;
}

const moderateScale = (size, factor = 0.75) => {
    return size + ( verticalScale(size) - size ) * factor;
};

export {horizontalScale, verticalScale, moderateScale};