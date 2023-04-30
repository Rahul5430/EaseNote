import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SplashLogo from '../assets/images/customSplash.png';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import { responsiveFontSize } from '../helpers/responsiveFontSize';
import { colors } from '../themes';
import Home from './Home';

interface AnimatedSplashScreenProps {
	setUser: (user: FirebaseAuthTypes.User | null) => void;
}

const AnimatedSplashScreen = ({ setUser }: AnimatedSplashScreenProps) => {
	const { width, height } = useWindowDimensions();

	const { top, right, left } = useSafeAreaInsets();

	const [textHeight, setTextHeight] = useState(30.66);

	const startAnimation = useRef(new Animated.Value(0)).current;
	const scaleLogo = useRef(new Animated.Value(1)).current;
	const scaleTitle = useRef(new Animated.Value(1)).current;
	const moveLogo = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
	const moveTitle = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
	const contentTransition = useRef(new Animated.Value(height)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(startAnimation, {
				toValue: -height + (top + (top == 0 ? 60 : 55)),
				useNativeDriver: true,
			}),
			Animated.timing(scaleLogo, {
				toValue: 0.3,
				useNativeDriver: true,
			}),
			Animated.timing(scaleTitle, {
				toValue: 0.8,
				useNativeDriver: true,
			}),
			Animated.timing(moveLogo, {
				toValue: {
					x: width / 2 - (35 + right),
					y: height / 2 + (textHeight / 2) * 0.8 - 27.5,
				},
				useNativeDriver: true,
			}),
			Animated.timing(moveTitle, {
				toValue: {
					x: 0,
					y: height / 2 - 75 - (top == 0 ? 30 : 32.5),
				},
				useNativeDriver: true,
			}),
			Animated.timing(contentTransition, {
				toValue: 0,
				useNativeDriver: true,
			}),
		]).start();
	}, [height, width, top, right, left, textHeight]);

	return (
		<View style={styles.outsideView}>
			<FocusAwareStatusBar
				barStyle='dark-content'
				translucent={true}
				backgroundColor={'transparent'}
				hidden={false}
			/>
			<Animated.View
				style={[
					styles.splashView,
					{ transform: [{ translateY: startAnimation }] },
				]}
			>
				<Animated.Image
					source={SplashLogo}
					style={[
						styles.imageView,
						{
							transform: [
								{ translateX: moveLogo.x },
								{ translateY: moveLogo.y },
								{ scale: scaleLogo },
							],
						},
					]}
				/>
				<Animated.Text
					style={[
						styles.textView,
						{
							transform: [
								{ translateY: moveTitle.y },
								{ scale: scaleTitle },
							],
						},
					]}
					onLayout={({ nativeEvent }) =>
						setTextHeight(nativeEvent.layout.height)
					}
				>
					EaseNote
				</Animated.Text>
			</Animated.View>
			<Animated.View
				style={[
					styles.secondAnimatedView,
					{ transform: [{ translateY: contentTransition }] },
				]}
			>
				<Home setUser={setUser} />
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	outsideView: {
		// position: 'absolute',
		// top: 0,
		// bottom: 0,
		// left: 0,
		// right: 0,
		// backgroundColor: colors.main,
		flex: 1,
	},
	splashView: {
		flex: 1,
		backgroundColor: colors.main,
		zIndex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	imageView: {
		width: 150,
		height: 150,
	},
	textView: {
		fontSize: responsiveFontSize(25),
		fontWeight: 'bold',
		textAlign: 'center',
		color: 'black',
	},
	secondAnimatedView: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'rgba(0,0,0,0.04)',
		zIndex: 0,
	},
});

export default AnimatedSplashScreen;
