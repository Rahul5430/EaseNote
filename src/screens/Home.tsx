import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	View,
} from 'react-native';
import { Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { responsiveFontSize } from '../helpers/responsiveFontSize';
import { colors } from '../themes';

interface HomeScreenProps {
	setUser: (user: FirebaseAuthTypes.User | null) => void;
}

const Home = ({ setUser }: HomeScreenProps) => {
	const { top } = useSafeAreaInsets();

	const logout = () => {
		auth()
			.signOut()
			.then(() => {
				console.log('User logged out');
				setUser(null);
			})
			.catch((error) => {
				console.log('LOGOUT ERROR', error);
			});
	};

	return (
		<View style={{ flex: 1, marginTop: top + 60 }}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{ flexGrow: 1 }}
			>
				<ScrollView
					keyboardShouldPersistTaps='handled'
					contentContainerStyle={styles.outerView}
				>
					<Button
						mode='contained'
						onPress={logout}
						contentStyle={{ width: responsiveFontSize(335.4) }}
						textColor={colors.white}
						accessibilityLabel='Continue with Google'
						labelStyle={{ fontSize: responsiveFontSize(14.43) }}
					>
						Logout
					</Button>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};

const styles = StyleSheet.create({
	outerView: {
		flex: 1,
		paddingHorizontal: responsiveFontSize(39),
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Home;
