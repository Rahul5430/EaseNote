import { GOOGLE_WEB_CLIENT_ID } from '@env';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useEffect, useRef, useState } from 'react';
import {
	Animated,
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
} from 'react-native';
import { Button, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import SplashLogo from '../assets/images/customSplash.png';
import GoogleLogo from '../assets/images/google.png';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import MaterialTextInput from '../components/MaterialTextInput/MaterialTextInput';
import { responsiveFontSize } from '../helpers/responsiveFontSize';
import { validateEmail } from '../helpers/utils';
import { colors } from '../themes';

interface OnboardingScreenProps {
	setUser: (user: FirebaseAuthTypes.User | null) => void;
}

const OnboardingScreen = ({ setUser }: OnboardingScreenProps) => {
	GoogleSignin.configure({
		webClientId: GOOGLE_WEB_CLIENT_ID,
	});

	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState('');

	const { width, height } = useWindowDimensions();

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

	// Animation Done....
	useEffect(() => {
		// Parallel Animation...
		Animated.parallel([
			Animated.timing(animatedHeight, {
				// For same Height for non safe Area Devices...
				toValue: width < height ? height / 2 : (2 * height) / 3,
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
	}, [height, width]);

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

	const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
		console.log('@@@ USER: ', user);
		if (user) {
			setUser(user);
		}
	};

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber; // unsubscribe on unmount
	}, []);

	return (
		<SafeAreaView
			edges={['bottom', 'left', 'right']}
			style={{ backgroundColor: colors.main, flexGrow: 1 }}
		>
			<FocusAwareStatusBar
				barStyle='dark-content'
				translucent={true}
				backgroundColor={'transparent'}
				hidden={false}
			/>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{ flexGrow: 1 }}
			>
				<ScrollView
					keyboardShouldPersistTaps='handled'
					contentContainerStyle={styles.splashView}
					bounces={false}
					showsVerticalScrollIndicator={false}
				>
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
								transform: [{ translateY: contentTransition }],
							},
						]}
					>
						<View style={styles.outerView}>
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
									width: responsiveFontSize(335.4),
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
										width: responsiveFontSize(144.3),
									}}
								/>
								<Text
									style={{
										paddingHorizontal:
											responsiveFontSize(11.7),
										color: 'black',
										fontSize: responsiveFontSize(15.6),
									}}
								>
									OR
								</Text>
								<Divider
									style={{
										backgroundColor: colors.black,
										width: responsiveFontSize(144.3),
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
											width: responsiveFontSize(27.3),
											height: responsiveFontSize(27.3),
										}}
									/>
								)}
								labelStyle={{
									fontSize: responsiveFontSize(14.43),
									fontWeight: '600',
									marginLeft: responsiveFontSize(19.5),
								}}
							>
								Continue with Google
							</Button>
						</View>
					</Animated.View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	splashView: {
		// backgroundColor: colors.main,
		zIndex: 0,
		flexGrow: 1,
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
		fontSize: responsiveFontSize(25),
		fontWeight: 'bold',
		textAlign: 'center',
		color: 'black',
	},
	secondAnimatedView: {
		backgroundColor: 'transparent',
		zIndex: 1,
	},
	outerView: {
		padding: 15,
		justifyContent: 'flex-start',
		alignItems: 'center',
		flex: 1,
	},
	heading: {
		fontWeight: 'bold',
		fontSize: responsiveFontSize(19.5),
		textAlign: 'center',
		color: 'black',
	},
	subHeading: {
		fontSize: responsiveFontSize(15.6),
		textAlign: 'center',
		color: 'black',
		padding: responsiveFontSize(7.8),
	},
	googleSignin: {
		width: responsiveFontSize(335.4),
	},
});

export default OnboardingScreen;
