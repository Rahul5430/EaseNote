import { useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AnimatedSplashScreen from './src/screens/AnimatedSplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export default function App() {
	const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

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
