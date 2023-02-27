import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { Animated } from 'react-native';

type FadeInViewProps = PropsWithChildren<{}>;

const FadeInView: React.FC<FadeInViewProps> = (props) => {
	const fadeAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 3000,
			useNativeDriver: true,
		}).start();
	}, [fadeAnim]);

	return (
		<Animated.View style={{ opacity: fadeAnim }} {...props}>
			{props.children}
		</Animated.View>
	);
};

export default FadeInView;
