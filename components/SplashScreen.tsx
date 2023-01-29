import { useEffect, useRef } from 'react';
import {
	Animated,
	Dimensions,
	Image,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SplashLogo from '../assets/customSplash.png';

const BGColor = '#F27649';

const SplashScreen = () => {
	// SafeArea Value...
	const edges = useSafeAreaInsets();

	// Animation Values...
	const startAnimation = useRef(new Animated.Value(0)).current;

	// Scaling down both logo and title...
	const scaleLogo = useRef(new Animated.Value(1)).current;
	const scaleTitle = useRef(new Animated.Value(1)).current;

	// Offset Animation ...
	const moveLogo = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
	const moveTitle = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

	// Animating Content...
	const contentTransition = useRef(
		new Animated.Value(Dimensions.get('window').height)
	).current;

	// Animation Done....
	useEffect(() => {
		// Starting Animation after 500ms...
		setTimeout(() => {
			// Parallel Animation...
			Animated.parallel([
				Animated.timing(startAnimation, {
					// For same Height for non safe Area Devices...
					toValue:
						-Dimensions.get('window').height + (edges.top + 65),
					useNativeDriver: true,
				}),
				Animated.timing(scaleLogo, {
					// Scaling to 0.35
					toValue: 0.3,
					useNativeDriver: true,
				}),
				Animated.timing(scaleTitle, {
					// Scaling to 0.8
					toValue: 0.8,
					useNativeDriver: true,
				}),
				Animated.timing(moveLogo, {
					// Moving to right most...
					toValue: {
						x: Dimensions.get('window').width / 2 - 35,
						y: Dimensions.get('window').height / 2 - 5,
					},
					useNativeDriver: true,
				}),
				Animated.timing(moveTitle, {
					// Moving to right most...
					toValue: {
						x: 0,
						// Since image size is 100...
						y: Dimensions.get('window').height / 2 - 90,
					},
					useNativeDriver: true,
				}),
				Animated.timing(contentTransition, {
					toValue: 0,
					useNativeDriver: true,
				}),
			]).start();
		}, 500);
	}, []);

	return (
		<View style={styles.outsideView}>
			<Animated.View
				style={{
					...styles.splashView,
					transform: [{ translateY: startAnimation }],
				}}
			>
				<Animated.View style={styles.animatedView}>
					<Animated.Image
						source={SplashLogo}
						style={{
							...styles.imageView,
							transform: [
								{ translateX: moveLogo.x },
								{ translateY: moveLogo.y },
								{ scale: scaleLogo },
							],
						}}
					/>
					<Animated.Text
						style={{
							...styles.textView,
							transform: [
								{ translateY: moveTitle.y },
								{ scale: scaleTitle },
							],
						}}
					>
						EaseNote
					</Animated.Text>
				</Animated.View>
			</Animated.View>
			<Animated.View
				style={{
					...styles.secondAnimatedView,
					transform: [{ translateY: contentTransition }],
				}}
			>
				<Text>Home</Text>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	outsideView: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
	splashView: {
		flex: 1,
		backgroundColor: BGColor,
		zIndex: 1,
	},
	animatedView: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	imageView: {
		width: 150,
		height: 150,
		marginBottom: 10,
	},
	textView: {
		fontSize: 25,
		fontWeight: 'bold',
		textAlign: 'center',
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

export default SplashScreen;
