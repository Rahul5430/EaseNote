import {
	ScrollView,
	StyleSheet,
	useWindowDimensions,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface HomeScreenProps {
	setUser: (user: FirebaseAuthTypes.User | null) => void;
}

const Home = ({ setUser }: HomeScreenProps) => {
	const edges = useSafeAreaInsets();
	const { height, width } = useWindowDimensions();

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
						height: height,
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
