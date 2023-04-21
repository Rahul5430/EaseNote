/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	Animated,
	Easing,
	NativeSyntheticEvent,
	StyleProp,
	StyleSheet,
	TargetedEvent,
	TextInput as RNTextInput,
	TextInputFocusEventData,
	TextInputProps as RNTextInputProps,
	View,
	ViewStyle,
} from 'react-native';

import { RFValue } from '../../helpers/responsiveFontSize';
import { colors } from '../../themes';
import { useStyles } from './hooks/use-styles';
import MaterialText from './MaterialText';

export interface MaterialTextInputProps extends RNTextInputProps {
	/**
	 * The variant to use.
	 *
	 * @default "filled"
	 */
	variant?: 'filled' | 'outlined' | 'standard';

	/**
	 * Whether to display the asterisk.
	 *
	 * @default "false"
	 */
	required?: boolean;

	/**
	 * The label to display.
	 */
	label?: string;

	/**
	 * The element placed before the text input.
	 */
	leading?:
		| React.ReactNode
		| ((props: { color: string; size: number }) => React.ReactNode | null)
		| null;

	/**
	 * The element placed after the text input.
	 */
	trailing?:
		| React.ReactNode
		| ((props: { color: string; size: number }) => React.ReactNode | null)
		| null;

	/**
	 * The color of the text input's content (e.g. label, icons, selection).
	 *
	 * @default "primary"
	 */
	color?: string;

	/**
	 * The helper text to display.
	 */
	helperText?: string;

	/**
	 * The style of the helper text.
	 */
	helperTextStyle?: RNTextInputProps['style'];

	/**
	 * The helper text to display.
	 */
	helperTextIcon?:
		| React.ReactNode
		| ((props: { color: string; size: number }) => React.ReactNode | null)
		| any
		| null;

	/**
	 * Callback function to call when user moves pointer over the input.
	 */
	onMouseEnter?: (event: NativeSyntheticEvent<TargetedEvent>) => void;

	/**
	 * Callback function to call when user moves pointer away from the input.
	 */
	onMouseLeave?: (event: NativeSyntheticEvent<TargetedEvent>) => void;

	/**
	 * The style of the container view.
	 */
	style?: StyleProp<ViewStyle>;

	/**
	 * The style of the text input container view.
	 */
	inputContainerStyle?: StyleProp<ViewStyle>;

	/**
	 * The style of the text input.
	 */
	inputStyle?: RNTextInputProps['style'];

	/**
	 * The style of the text input's label element container.
	 */
	labelContainerStyle?: StyleProp<ViewStyle>;

	/**
	 * The style of the text input's leading element container.
	 */
	leadingContainerStyle?: StyleProp<ViewStyle>;

	/**
	 * The style of the text input's trailing element container.
	 */
	trailingContainerStyle?: StyleProp<ViewStyle>;
}

const MaterialTextInput = React.forwardRef(
	(
		{
			variant = 'outlined',
			required = false,
			label,
			leading,
			trailing,
			color = 'primary',
			helperText,
			helperTextIcon,
			helperTextStyle,
			onMouseEnter,
			onMouseLeave,
			style,
			inputContainerStyle,
			inputStyle,
			labelContainerStyle,
			leadingContainerStyle,
			trailingContainerStyle,
			placeholder,
			onFocus,
			onBlur,
			...rest
		}: MaterialTextInputProps,
		ref
	) => {
		const leadingNode =
			typeof leading === 'function'
				? leading({ color: '#949494', size: 24 })
				: leading;

		const trailingNode =
			typeof trailing === 'function'
				? trailing({ color: '#949494', size: 24 })
				: trailing;

		const [hovered, setHovered] = useState(false);

		const handleMouseEnter = useCallback(
			(event: NativeSyntheticEvent<TargetedEvent>) => {
				onMouseEnter?.(event);
				setHovered(true);
			},
			[onMouseEnter]
		);

		const handleMouseLeave = useCallback(
			(event: NativeSyntheticEvent<TargetedEvent>) => {
				onMouseLeave?.(event);
				setHovered(false);
			},
			[onMouseLeave]
		);

		const [focused, setFocused] = useState(false);

		const handleFocus = useCallback(
			(event: NativeSyntheticEvent<TextInputFocusEventData>) => {
				onFocus?.(event);
				setFocused(true);
			},
			[onFocus]
		);

		const handleBlur = useCallback(
			(event: NativeSyntheticEvent<TextInputFocusEventData>) => {
				onBlur?.(event);
				setFocused(false);
			},
			[onBlur]
		);

		const focusAnimation = useMemo(() => new Animated.Value(0), []);

		useEffect(() => {
			Animated.timing(focusAnimation, {
				toValue: focused ? 1 : 0,
				duration: 200,
				easing: Easing.out(Easing.ease),
				useNativeDriver: false,
			}).start();
		}, [focused]);

		const active = useMemo(
			() => focused || (rest.value?.length || 0) > 0,
			[focused, rest.value]
		);

		const activeAnimation = useMemo(
			() => new Animated.Value(active ? 1 : 0),
			[]
		);

		useEffect(() => {
			Animated.timing(activeAnimation, {
				toValue: active ? 1 : 0,
				duration: 200,
				easing: Easing.out(Easing.ease),
				useNativeDriver: false,
			}).start();
		}, [active]);

		const styles = useStyles(
			() => ({
				inputContainer: {
					flexDirection: 'row',
					backgroundColor: colors.skin,
				},
				input: {
					flex: 1,
					minHeight: variant === 'standard' ? 48 : 56,
					paddingStart: leadingNode
						? 12
						: variant === 'standard'
						? 0
						: 16,
					paddingEnd: trailingNode
						? 10
						: variant === 'standard'
						? 0
						: 16,
					color: colors.black,
				},
				leading: {
					justifyContent: 'center',
					alignItems: 'center',
					width: 24,
					height: 24,
					marginStart: variant === 'standard' ? 0 : 12,
					marginVertical: variant === 'standard' ? 12 : 16,
				},
				trailing: {
					justifyContent: 'center',
					alignItems: 'center',
					height: 24,
					marginStart: 0,
					marginEnd: variant === 'standard' ? 0 : 16,
					marginVertical: variant === 'standard' ? 12 : 16,
				},
				underline: {
					position: 'absolute',
					start: 0,
					end: 0,
					bottom: 0,
					height: 1,
					backgroundColor: hovered
						? colors.lightInputGrey
						: '#949494',
				},
				underlineFocused: {
					position: 'absolute',
					start: 0,
					end: 0,
					bottom: 0,
					height: 2,
					backgroundColor: colors.black,
				},
				outline: {
					borderWidth: focused ? 2 : 1,
					borderColor: focused
						? colors.darkRed
						: hovered
						? colors.lightInputGrey
						: rest.value?.length
						? colors.darkGrey
						: '#949494',
				},
				outlineLabelGap: {
					position: 'absolute',
					top: 0,
					start: -4,
					end: -4,
					height: focused ? 2 : 1,
					// backgroundColor: colors.main,
				},
				labelContainer: {
					justifyContent: 'center',
					position: 'absolute',
					top: 0,
					start:
						variant === 'standard'
							? leadingNode
								? leadingContainerStyle &&
								  // @ts-ignore
								  typeof leadingContainerStyle.width ===
										'number'
									? // @ts-ignore
									  leadingContainerStyle.width + 12
									: 36
								: 0
							: leadingNode
							? 48
							: 16,
					height: variant === 'standard' ? 48 : 56,
				},
				helperText: {
					color: colors.darkRed,
				},
				helperTextIcon: {
					flexDirection: 'row',
				},
			}),
			[!!leadingNode, !!trailingNode, variant, focused, hovered]
		);

		const shake = useRef(new Animated.Value(0.5)).current;

		const translateXAnim = shake.interpolate({
			inputRange: [0, 1],
			outputRange: [-16, 16],
		});

		const getAnimationStyles = () => ({
			transform: [
				{
					translateX: translateXAnim,
				},
			],
		});

		const runAnimation = () => {
			Animated.sequence([
				Animated.timing(shake, {
					delay: 300,
					toValue: 1,
					duration: 200,
					easing: Easing.out(Easing.sin),
					useNativeDriver: true,
				}),
				Animated.timing(shake, {
					toValue: 0,
					duration: 100,
					easing: Easing.out(Easing.sin),
					useNativeDriver: true,
				}),
				Animated.timing(shake, {
					toValue: 1,
					duration: 100,
					easing: Easing.out(Easing.sin),
					useNativeDriver: true,
				}),
				Animated.timing(shake, {
					toValue: 0,
					duration: 100,
					easing: Easing.out(Easing.sin),
					useNativeDriver: true,
				}),
				Animated.timing(shake, {
					toValue: 0.5,
					duration: 200,
					easing: Easing.out(Easing.sin),
					useNativeDriver: true,
				}),
			]).start();
		};

		const firstUpdate = useRef(true);
		useLayoutEffect(() => {
			if (firstUpdate.current) {
				firstUpdate.current = false;
				return;
			}

			if (
				helperText ===
					'Enter correct mobile number, an OTP will be generated on this number' ||
				helperText === 'You cannot change unique business later' ||
				helperText === ''
			) {
				return;
			}
			runAnimation();
		}, [helperText]);

		return (
			<View style={[style]}>
				<View
					style={[
						styles.inputContainer,
						variant !== 'standard' && {
							borderTopStartRadius: 10,
							borderTopEndRadius: 10,
							borderBottomStartRadius: 10,
							borderBottomEndRadius: 10,
						},
						variant === 'filled' && {
							borderBottomStartRadius: 0,
							borderBottomEndRadius: 0,
						},
						inputContainerStyle,
					]}
				>
					{leadingNode && (
						<View style={[styles.leading, leadingContainerStyle]}>
							{leadingNode}
						</View>
					)}

					<RNTextInput
						ref={ref}
						style={[
							styles.input,
							{
								fontSize: RFValue(16),
								letterSpacing: 0.15,
							},
							variant === 'filled' &&
								label && {
									paddingTop: 18,
								},
							inputStyle,
						]}
						placeholder={
							label
								? focused
									? placeholder
									: undefined
								: placeholder
						}
						// selectionColor={'black'}
						placeholderTextColor={'#999999'}
						onFocus={handleFocus}
						onBlur={handleBlur}
						{...({
							onMouseEnter: handleMouseEnter,
							onMouseLeave: handleMouseLeave,
							...rest,
						} as any)}
					/>

					{trailingNode && (
						<View style={[styles.trailing, trailingContainerStyle]}>
							{trailingNode}
						</View>
					)}

					{(variant === 'filled' || variant === 'standard') && (
						<>
							<View
								style={[styles.underline]}
								pointerEvents='none'
							/>
							<Animated.View
								style={[
									styles.underlineFocused,
									{
										transform: [
											{ scaleX: activeAnimation },
										],
									},
								]}
								pointerEvents='none'
							/>
						</>
					)}

					{variant === 'outlined' && (
						<View
							style={[
								StyleSheet.absoluteFill,
								{
									borderTopStartRadius: 10,
									borderTopEndRadius: 10,
									borderBottomStartRadius: 10,
									borderBottomEndRadius: 10,
								},
								rest.multiline && {
									borderTopStartRadius: 40,
									borderTopEndRadius: 40,
									borderBottomStartRadius: 40,
									borderBottomEndRadius: 40,
								},
								styles.outline,
							]}
							pointerEvents='none'
						/>
					)}

					{!!label && (
						<View
							style={[styles.labelContainer, labelContainerStyle]}
							pointerEvents='none'
						>
							{variant === 'outlined' && (
								<Animated.View
									style={[
										styles.outlineLabelGap,
										{
											transform: [
												{ scaleX: activeAnimation },
											],
										},
									]}
								/>
							)}
							<Animated.Text
								style={[
									{
										fontSize: RFValue(16),
										letterSpacing: 0.15,
									},
									{
										color: activeAnimation.interpolate({
											inputRange: [0, 1],
											outputRange: [
												colors.lightInputGrey,
												colors.black,
											],
										}),
										fontSize: activeAnimation.interpolate({
											inputRange: [0, 1],
											outputRange: [
												RFValue(16),
												RFValue(14),
											],
										}),
										transform: [
											{
												translateY:
													activeAnimation.interpolate(
														{
															inputRange: [0, 1],
															outputRange: [
																0,
																variant ===
																'filled'
																	? -12
																	: variant ===
																	  'outlined'
																	? -28
																	: -24,
															],
														}
													),
											},
										],
										backgroundColor:
											variant === 'outlined'
												? colors.white
												: 'transparent',
										paddingLeft:
											variant === 'outlined' ? 2 : 0,
									},
								]}
							>
								{label}
								{required && (
									<Animated.Text
										style={{
											color: colors.golden,
											fontSize: RFValue(18),
										}}
									>
										*
									</Animated.Text>
								)}
							</Animated.Text>
						</View>
					)}
				</View>
				<Animated.View
					style={[
						{ marginTop: 4, marginHorizontal: 1 },
						getAnimationStyles(),
					]}
				>
					{helperTextIcon && helperText ? (
						<View style={styles.helperTextIcon}>
							{helperTextIcon}
							<MaterialText
								variant='body2'
								style={[
									styles.helperText,
									helperTextStyle,
									{ flex: 1, flexWrap: 'wrap' },
								]}
							>
								{helperText}
							</MaterialText>
						</View>
					) : (
						helperText && (
							<MaterialText
								variant='body2'
								style={[styles.helperText, helperTextStyle]}
							>
								{helperText}
							</MaterialText>
						)
					)}
				</Animated.View>
			</View>
		);
	}
);

export default MaterialTextInput;
