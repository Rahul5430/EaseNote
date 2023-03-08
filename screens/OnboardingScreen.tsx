import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import SplashLogo from '../assets/customSplash.png';
import FadeInView from '../components/FadeInView';
import { Button } from 'react-native-paper';
import {
	GoogleSignin,
	GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

interface OnboardingScreenProps {
	setUser: ({}) => void;
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const BGColor = '#F27649';

const OnboardingScreen = ({ setUser }: OnboardingScreenProps) => {
	GoogleSignin.configure({
		webClientId:
			'277543865694-qhv8k2f66c4eg9d5as1t9621r4rep1co.apps.googleusercontent.com',
	});
	const [appIsReady, setAppIsReady] = useState(false);
	const { width, height } = useWindowDimensions();

	__DEV__ && console.log(appIsReady);

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

	useEffect(() => {
		const prepare = async () => {
			try {
				await new Promise((resolve) => setTimeout(resolve, 500));
			} catch (e) {
				console.warn(e);
			} finally {
				// Tell the application to render
				setAppIsReady(true);
			}
		};

		prepare();
	}, []);

	// Animation Done....
	useEffect(() => {
		// Starting Animation after 500ms...
		setTimeout(() => {
			// Parallel Animation...
			Animated.parallel([
				Animated.timing(startAnimation, {
					// For same Height for non safe Area Devices...
					toValue: 0,
					useNativeDriver: true,
				}),
				Animated.timing(scaleLogo, {
					// Scaling to 0.35
					toValue: 1,
					useNativeDriver: true,
				}),
				Animated.timing(scaleTitle, {
					// Scaling to 0.8
					toValue: 1,
					useNativeDriver: true,
				}),
				Animated.timing(moveLogo, {
					// Moving to right most...
					toValue: {
						x: 0,
						y: -height / 6,
					},
					useNativeDriver: true,
				}),
				Animated.timing(moveTitle, {
					// Moving to right most...
					toValue: {
						x: 0,
						// Since image size is 150...
						y: -height / 6,
					},
					useNativeDriver: true,
				}),
				Animated.timing(contentTransition, {
					toValue: 0,
					useNativeDriver: true,
				}),
			]).start();
		}, 500);
	}, [height, width]);

	const onLayoutRootView = useCallback(async () => {
		if (appIsReady) {
			await SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	const signInWithGoogle = async () => {
		try {
			// Check if your device supports Google Play
			await GoogleSignin.hasPlayServices({
				showPlayServicesUpdateDialog: true,
			});
			// Get the users ID token
			const { idToken } = await GoogleSignin.signIn();
			console.log('### IDTOKEN: ', idToken);

			// Create a Google credential with the token
			const googleCredential =
				auth.GoogleAuthProvider.credential(idToken);

			__DEV__ && console.log('Pressed Connect with Google');

			return auth().signInWithCredential(googleCredential);
		} catch (error) {
			console.error('### Error: ', error);
		}
	};

	const onAuthStateChanged = async (user: {}) => {
		console.log('@@@ USER: ', user);
		if (user) {
			setUser(user);
		}
	};

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber; // unsubscribe on unmount
	}, []);

	if (!appIsReady) {
		return null;
	}

	return (
		<View style={styles.outsideView} onLayout={onLayoutRootView}>
			<Animated.View
				style={{
					...styles.splashView,
					height: height,
					transform: [{ translateY: startAnimation }],
				}}
			>
				<Animated.View
					style={{ ...styles.animatedView, height: height }}
				>
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
				<Animated.View
					style={{
						...styles.outerView,
						height: height / 2,
					}}
				>
					{/* <FadeInView> */}
					{/* <Button
							mode='contained'
							dark
							onPress={() => signInWithGoogle()}
						>
							LOGIN
						</Button> */}
					<GoogleSigninButton
						onPress={() => signInWithGoogle()}
						color={GoogleSigninButton.Color.Dark}
					/>
					{/* </FadeInView> */}
				</Animated.View>
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
		// zIndex: 1,
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
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'transparent',
		zIndex: 0,
	},
	outerView: {
		padding: 15,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default OnboardingScreen;
