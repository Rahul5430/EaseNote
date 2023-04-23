import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { RootSiblingParent } from 'react-native-root-siblings';
import SplashScreen from 'react-native-splash-screen';

import AnimatedSplashScreen from './src/screens/AnimatedSplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';

export default function App() {
	const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

	useEffect(() => {
		SplashScreen.hide();
	}, []);

	return (
		<NavigationContainer>
			<PaperProvider>
				<RootSiblingParent>
					{!user ? (
						<OnboardingScreen setUser={setUser} />
					) : (
						<AnimatedSplashScreen setUser={setUser} />
					)}
				</RootSiblingParent>
			</PaperProvider>
		</NavigationContainer>
	);
}
