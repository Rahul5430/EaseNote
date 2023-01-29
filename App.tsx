import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SplashScreen from './components/SplashScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
	return (
		// <View style={styles.container}>
		// 	<Text>Open up App.js to start working on your app!</Text>
		// 	<StatusBar style='auto' />
		// </View>
		<SafeAreaProvider>
			<SplashScreen />
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
