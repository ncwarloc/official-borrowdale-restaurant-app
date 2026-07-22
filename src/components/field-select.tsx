import { Check, ChevronDown } from 'lucide-react-native';
import type { ComponentType } from 'react';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { F_BODY, useZoneGardenTheme } from '@/constants/theme';
import type { FieldIconProps } from '@/components/field-input';

export type FieldSelectProps = {
  icon?: ComponentType<FieldIconProps>;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
};

export function FieldSelect({ icon: Icon, value, onChange, options, placeholder = 'Select…', style }: FieldSelectProps) {
  const theme = useZoneGardenTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
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
        <Text style={[F_BODY, styles.value, { color: value ? theme.text : theme.textMuted }]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <ChevronDown size={15} color={theme.textMuted} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={[styles.sheet, { backgroundColor: theme.isDark ? '#1B1B1B' : '#FFFFFF' }]}>
            <FlatList
              data={options}
              keyExtractor={(option) => option}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: theme.divider }} />}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                  style={styles.option}
                >
                  <Text style={[F_BODY, styles.optionText, { color: item === value ? theme.gold : theme.text }]}>
                    {item}
                  </Text>
                  {item === value && <Check size={16} color={theme.gold} />}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
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
  value: {
    flex: 1,
    fontSize: 13,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    maxHeight: '60%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 14,
  },
});
