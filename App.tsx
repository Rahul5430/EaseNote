// import { useCallback, useEffect, useRef, useState } from 'react';
// import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AnimatedSplashScreen from './components/AnimatedSplashScreen';

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

export default function App() {
	// const [appIsReady, setAppIsReady] = useState(false);

	// console.log(appIsReady);

	// useEffect(() => {
	// 	const prepare = async () => {
	// 		try {
	// 			await new Promise((resolve) => setTimeout(resolve, 2000));
	// 		} catch (e) {
	// 			console.warn(e);
	// 		} finally {
	// 			// Tell the application to render
	// 			setAppIsReady(true);
	// 		}
	// 	};

	// 	prepare();
	// }, []);

	// const onLayoutRootView = useCallback(async () => {
	// 	if (appIsReady) {
	// 		// This tells the splash screen to hide immediately! If we call this after
	// 		// `setAppIsReady`, then we may see a blank screen while the app is
	// 		// loading its initial state and rendering its first pixels. So instead,
	// 		// we hide the splash screen once we know the root view has already
	// 		// performed layout.
	// 		await SplashScreen.hideAsync();
	// 	}
	// }, [appIsReady]);

	// if (!appIsReady) {
	// 	return null;
	// }

	return (
		// <SafeAreaProvider onLayout={onLayoutRootView}>
		<SafeAreaProvider>
			<AnimatedSplashScreen />
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
