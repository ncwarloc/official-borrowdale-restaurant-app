import type { ComponentType } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { F_BODY, useZoneGardenTheme } from '@/constants/theme';

export type FieldIconProps = { size?: number; color?: string };

export type FieldInputProps = {
  icon?: ComponentType<FieldIconProps>;
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  onBlur?: TextInputProps['onBlur'];
  onFocus?: TextInputProps['onFocus'];
};

export function FieldInput({
  icon: Icon,
  placeholder,
  value,
  onChangeText,
  style,
  secureTextEntry,
  keyboardType,
  onBlur,
  onFocus,
}: FieldInputProps) {
  const theme = useZoneGardenTheme();

  return (
    <View
      style={[
        styles.field,
        {
          backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          borderColor: theme.cardBorder,
        },
        style,
      ]}
    >
      {Icon && <Icon size={15} color={theme.textMuted} />}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={[F_BODY, styles.input, { color: theme.text }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
});
