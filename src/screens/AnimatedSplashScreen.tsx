import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SplashLogo from '../assets/images/customSplash.png';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import Home from './Home';

interface AnimatedSplashScreenProps {
	setUser: (user: FirebaseAuthTypes.User | null) => void;
}

const BGColor = '#F27649';

const AnimatedSplashScreen = ({ setUser }: AnimatedSplashScreenProps) => {
	const { width, height } = useWindowDimensions();

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
	const contentTransition = useRef(new Animated.Value(height)).current;

	// Animation Done....
	useEffect(() => {
		// Parallel Animation...
		Animated.parallel([
			Animated.timing(startAnimation, {
				// For same Height for non safe Area Devices...
				toValue: -height + (edges.top + 80.5),
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
					x: width / 2 - 35,
					y: height / 2 - 25,
				},
				useNativeDriver: true,
			}),
			Animated.timing(moveTitle, {
				// Moving to right most...
				toValue: {
					x: 0,
					// Since image size is 150...
					y: height / 2 - 117.5,
				},
				useNativeDriver: true,
			}),
			Animated.timing(contentTransition, {
				toValue: 0,
				useNativeDriver: true,
			}),
		]).start();
	}, [height, width]);

	return (
		<View style={styles.outsideView}>
			<FocusAwareStatusBar
				barStyle='dark-content'
				translucent={true}
				backgroundColor={'transparent'}
				hidden={false}
			/>
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
				<Home setUser={setUser} />
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	outsideView: {
		backgroundColor: '#F27649',
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
		// marginBottom: 10,
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

export default AnimatedSplashScreen;
