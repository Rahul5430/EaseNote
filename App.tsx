import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AnimatedSplashScreen from './screens/AnimatedSplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';

export default function App() {
	const [user, setUser] = useState(null);

	return (
		<SafeAreaProvider>
			<PaperProvider>
				{!user ? (
					<OnboardingScreen setUser={setUser} />
				) : (
					<AnimatedSplashScreen setUser={setUser} />
				)}
			</PaperProvider>
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
