import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Home = () => {
	const edges = useSafeAreaInsets();
	const {height, width} = useWindowDimensions();

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
		// paddingBottom: 1000,
		backgroundColor: '#FFFFFF',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Home;
