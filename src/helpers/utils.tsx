import { Dimensions, Platform } from 'react-native';

/**
 * Returns true if the screen is in portrait mode
 */
export const isPortrait = () => {
	const dim = Dimensions.get('screen');
	return dim.height >= dim.width;
};

/**
 * Returns true of the screen is in landscape mode
 */
export const isLandscape = () => {
	const dim = Dimensions.get('screen');
	return dim.width >= dim.height;
};

export const validateEmail = (email: string) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
};

export const isIphoneX = () => {
	const dimen = Dimensions.get('window');
	return (
		Platform.OS === 'ios' &&
		!Platform.isPad &&
		!Platform.isTV &&
		(dimen.height === 780 ||
			dimen.width === 780 ||
			dimen.height === 812 ||
			dimen.width === 812 ||
			dimen.height === 844 ||
			dimen.width === 844 ||
			dimen.height === 896 ||
			dimen.width === 896 ||
			dimen.height === 926 ||
			dimen.width === 926)
	);
};
