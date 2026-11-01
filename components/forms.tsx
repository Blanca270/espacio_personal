import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';
import { Search } from 'lucide-react-native';
import { colors, fonts, radius, shadows, spacing } from '@/constants/theme';

type TextFieldProps = TextInputProps & { label: string };

export function TextField({ label, multiline, style, onFocus, onBlur, ...inputProps }: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.neutral[500]}
        multiline={multiline}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[styles.input, multiline && styles.multiline, focused && styles.inputFocused, style]}
        {...inputProps}
      />
    </View>
  );
}

export function SearchField({ value, onChangeText, placeholder }: { value: string; onChangeText: (text: string) => void; placeholder: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.search, focused && styles.inputFocused]}>
      <Search size={18} color={colors.neutral[500]} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.neutral[500]}
        accessibilityLabel={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.searchInput}
      />
    </View>
  );
}

type OptionPickerProps<T extends string> = {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
};

export function OptionPicker<T extends string>({ label, options, value, onChange }: OptionPickerProps<T>) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.options}>
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && styles.optionPressed]}
            >
              <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6 },
  label: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: colors.neutral[700] },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.neutral[900],
    backgroundColor: colors.neutral[0],
  },
  inputFocused: { borderColor: colors.primary[600], boxShadow: shadows.focus },
  multiline: { height: undefined, minHeight: 112, paddingTop: 12, textAlignVertical: 'top' },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: 46,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.neutral[0],
    maxWidth: 420,
    width: '100%',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.neutral[900],
    outlineStyle: 'none',
  } as object,
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  option: {
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.neutral[50],
  },
  optionPressed: { opacity: 0.8 },
  optionSelected: { backgroundColor: colors.primary[700], borderColor: colors.primary[700] },
  optionLabel: { fontFamily: fonts.semibold, fontSize: 14, color: colors.neutral[700] },
  optionLabelSelected: { color: colors.neutral[0] },
});
