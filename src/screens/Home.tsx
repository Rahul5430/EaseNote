import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getWidthnHeight } from '../helpers/responsiveFontSize';

interface HomeScreenProps {
	setUser: (user: FirebaseAuthTypes.User | null) => void;
}

const Home = ({ setUser }: HomeScreenProps) => {
	const edges = useSafeAreaInsets();

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
		<View>
			<ScrollView>
				<View
					style={{
						...styles.outerView,
						paddingTop: edges.top + 55.5,
						height: getWidthnHeight().height,
					}}
				>
					<Button mode='contained' onPress={logout}>
						Logout
					</Button>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	outerView: {
		paddingLeft: 15,
		paddingRight: 15,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Home;
