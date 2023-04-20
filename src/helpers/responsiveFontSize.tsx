import { isIphoneX } from './utils';
import { Platform, StatusBar, Dimensions } from 'react-native';

export const RFPercentage = (percent: number) => {
	const { height, width } = Dimensions.get('window');
	const standardLength = width > height ? width : height;
	const offset: number | any =
		width > height
			? 0
			: Platform.OS === 'ios'
			? 78
			: StatusBar.currentHeight; // iPhone X style SafeAreaView size in portrait

	const deviceHeight =
		isIphoneX() || Platform.OS === 'android'
			? standardLength - offset
			: standardLength;

	const heightPercent = (percent * deviceHeight) / 100;
	return Math.round(heightPercent);
};

// guideline height for standard 5" device screen is 680
export const RFValue = (fontSize: number, standardScreenHeight = 680) => {
	const { height, width } = Dimensions.get('window');
	const standardLength = width > height ? width : height;
	const offset: number | any =
		width > height
			? 0
			: Platform.OS === 'ios'
			? 78
			: StatusBar.currentHeight; // iPhone X style SafeAreaView size in portrait

	const deviceHeight =
		isIphoneX() || Platform.OS === 'android'
			? standardLength - offset
			: standardLength;

	const heightPercent = (fontSize * deviceHeight) / standardScreenHeight;
	return Math.round(heightPercent);
};

export const getWidthnHeight = (
	screenWidth = 100,
	screenHeight = 100,
	dim: 'window' | 'screen' = 'window'
) => {
	const { height, width } = Dimensions.get(dim);
	return {
		width: (width * screenWidth) / 100,
		height: (height * screenHeight) / 100,
	};
};

export const getMarginLeft = (margin: number) => {
	const width = Dimensions.get('window').width;
	return {
		margin: Math.floor((width * margin) / 100),
	};
};
