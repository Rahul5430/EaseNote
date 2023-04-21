import { DependencyList, useMemo } from 'react';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { SpacingFunc, useSpacingFunc } from 'react-native-flex-layout';

import { Theme, useTheme } from '../base/ThemeContext';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export const useStyles = <T extends NamedStyles<T>>(
	factory: (
		utils: Theme & {
			spacing: SpacingFunc;
		}
	) => T,
	deps?: DependencyList | undefined
): T => {
	const theme = useTheme();
	const spacing = useSpacingFunc();

	return useMemo(
		() =>
			factory({
				...theme,
				spacing,
			}),
		[factory, theme, spacing, deps]
	);
};
