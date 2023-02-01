import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Home = () => {
	const edges = useSafeAreaInsets();

	return (
		<View>
			<ScrollView>
				<View
					style={{
						...styles.outerView,
						paddingTop: edges.top + 55.5,
					}}
				>
					<Text>Home</Text>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	outerView: {
		paddingLeft: 15,
		paddingRight: 15,
		paddingBottom: 1000,
		backgroundColor: '#FFFFFF',
	},
});

export default Home;
