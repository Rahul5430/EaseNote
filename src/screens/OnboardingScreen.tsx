import { useCallback, useEffect, useRef, useState } from 'react';
import {
	Animated,
	StyleSheet,
	useWindowDimensions,
	View,
	Text,
	Image,
	KeyboardAvoidingView,
	ScrollView,
	Platform,
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import SplashLogo from '../assets/images/customSplash.png';
import { Button, Divider } from 'react-native-paper';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { getWidthnHeight } from '../helpers/responsiveFontSize';
import MaterialTextInput from '../components/MaterialTextInput/MaterialTextInput';
import { validateEmail } from '../helpers/utils';
import { colors } from '../themes';
import GoogleLogo from '../assets/images/google.png';

interface OnboardingScreenProps {
	setUser: (user: FirebaseAuthTypes.User | null) => void;
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const OnboardingScreen = ({ setUser }: OnboardingScreenProps) => {
	GoogleSignin.configure({
		webClientId:
			'277543865694-qhv8k2f66c4eg9d5as1t9621r4rep1co.apps.googleusercontent.com',
	});

	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState('');

	const [appIsReady, setAppIsReady] = useState(false);
	const { width, height } = useWindowDimensions();

	__DEV__ && console.log(appIsReady);

	// Scaling down both logo and title...
	const scaleLogo = useRef(new Animated.Value(1)).current;
	const scaleTitle = useRef(new Animated.Value(1)).current;

	// Offset Animation ...
	const moveLogo = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
	const moveTitle = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

	// Animating Content...
	const contentTransition = useRef(new Animated.Value(height)).current;

	// Animating Height...
	const animatedHeight = useRef(new Animated.Value(height)).current;

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
				Animated.timing(animatedHeight, {
					// For same Height for non safe Area Devices...
					toValue: height / 2,
					useNativeDriver: false,
				}),
				Animated.timing(scaleLogo, {
					// Scaling to 0.35
					toValue: 1,
					useNativeDriver: false,
				}),
				Animated.timing(scaleTitle, {
					// Scaling to 0.8
					toValue: 1,
					useNativeDriver: false,
				}),
				Animated.timing(moveLogo, {
					// Moving to right most...
					toValue: {
						x: 0,
						y: height / 12,
					},
					useNativeDriver: false,
				}),
				Animated.timing(moveTitle, {
					// Moving to right most...
					toValue: {
						x: 0,
						// Since image size is 150...
						y: height / 12,
					},
					useNativeDriver: false,
				}),
				Animated.timing(contentTransition, {
					toValue: 0,
					useNativeDriver: false,
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
		<View onLayout={onLayoutRootView}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<ScrollView keyboardShouldPersistTaps='handled'>
					<View style={[styles.splashView]}>
						<Animated.View
							style={[
								styles.animatedView,
								{ height: animatedHeight },
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
							>
								EaseNote
							</Animated.Text>
						</Animated.View>
						<Animated.View
							style={[
								styles.secondAnimatedView,
								{
									transform: [
										{ translateY: contentTransition },
									],
								},
							]}
						>
							<View
								style={[
									styles.outerView,
									{
										height: height / 2,
									},
								]}
							>
								<Text style={styles.heading}>
									Get started absolutely free.
								</Text>
								<Text style={styles.subHeading}>
									Welcome to EaseNote, please login with your
									college email address to get started
								</Text>
								<MaterialTextInput
									value={email}
									onChangeText={(text: string) => {
										if (text && !validateEmail(text)) {
											setEmailError(
												'Please enter valid email address'
											);
										} else {
											setEmailError('');
										}
										setEmail(text);
									}}
									onEndEditing={({ nativeEvent }) => {
										if (
											nativeEvent.text &&
											!validateEmail(nativeEvent.text)
										) {
											setEmailError(
												'Please enter valid email address'
											);
										} else {
											setEmailError('');
										}
									}}
									helperText={emailError}
									variant='filled'
									label='Email'
									placeholder='Enter email here'
									style={{
										marginTop: 10,
										marginBottom: emailError ? 0 : 10,
										width: getWidthnHeight(86).width,
									}}
									inputContainerStyle={{
										borderTopStartRadius: 5,
										borderTopEndRadius: 5,
										borderBottomStartRadius: 5,
										borderBottomEndRadius: 5,
									}}
									autoComplete='email'
									inputMode='email'
									keyboardType='email-address'
									textContentType='emailAddress'
									returnKeyType='next'
								/>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'center',
										alignItems: 'center',
										marginBottom: 10,
									}}
								>
									<Divider
										style={{
											backgroundColor: colors.black,
											width: getWidthnHeight(37).width,
										}}
									/>
									<Text
										style={{
											paddingHorizontal:
												getWidthnHeight(3).width,
										}}
									>
										OR
									</Text>
									<Divider
										style={{
											backgroundColor: colors.black,
											width: getWidthnHeight(37).width,
										}}
									/>
								</View>
								<Button
									onPress={() => signInWithGoogle()}
									mode='contained'
									style={{ borderRadius: 5 }}
									contentStyle={styles.googleSignin}
									buttonColor={colors.skin}
									textColor={colors.black}
									accessibilityLabel='Continue with Google'
									icon={() => (
										<Image
											source={GoogleLogo}
											style={{
												width: getWidthnHeight(7).width,
												height: getWidthnHeight(7)
													.width,
											}}
										/>
									)}
									labelStyle={{
										fontSize: getWidthnHeight(3.7).width,
										fontWeight: '600',
										marginLeft: getWidthnHeight(5).width,
									}}
								>
									Continue with Google
								</Button>
							</View>
						</Animated.View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};

const styles = StyleSheet.create({
	splashView: {
		backgroundColor: colors.main,
		zIndex: 0,
	},
	animatedView: {
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
		backgroundColor: 'transparent',
		zIndex: 1,
	},
	outerView: {
		padding: 15,
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	heading: {
		fontWeight: 'bold',
		fontSize: getWidthnHeight(5).width,
		textAlign: 'center',
	},
	subHeading: {
		fontSize: getWidthnHeight(4).width,
		textAlign: 'center',
		padding: getWidthnHeight(2).width,
	},
	googleSignin: {
		width: getWidthnHeight(86).width,
	},
});

export default OnboardingScreen;
