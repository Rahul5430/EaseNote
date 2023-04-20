import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { TypographyVariant, useTheme } from './base/ThemeContext';
import { colors } from '../../themes';
import { RFValue } from '../../helpers/responsiveFontSize';

export interface MaterialTextProps extends RNTextProps {
	/**
	 * The variant of the text.
	 *
	 * @default "body1"
	 */
	variant?: TypographyVariant;

	/**
	 * The color of the text.
	 *
	 * @default "on-background"
	 */
	color?: string;
}

const MaterialText: React.FC<MaterialTextProps> = ({
	variant = 'body1',
	color = 'on-background',
	style,
	...rest
}) => {
	const { typography } = useTheme();

	return (
		<RNText
			{...rest}
			style={[
				typography[variant],
				{
					color: colors.darkGrey,
					fontFamily: 'Ovo',
					fontSize: RFValue(14),
				},
				style,
			]}
		/>
	);
};

export default MaterialText;
