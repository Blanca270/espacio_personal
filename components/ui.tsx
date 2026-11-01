import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle, type StyleProp } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radius, shadows, spacing } from '@/constants/theme';

type ScreenProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function Screen({ eyebrow, title, subtitle, action, children }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.inner}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.eyebrow}>{eyebrow}</Text>
              <Text style={styles.title}>{title}</Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
            {action}
          </View>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  icon?: ReactNode;
};

export function Button({ label, onPress, variant = 'primary', disabled = false, icon }: ButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.buttonPrimary : styles.buttonSecondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {icon}
      <Text style={isPrimary ? styles.buttonLabelPrimary : styles.buttonLabelSecondary}>{label}</Text>
    </Pressable>
  );
}

export function IconButton({ icon, label, onPress }: { icon: ReactNode; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
    >
      {icon}
    </Pressable>
  );
}

type TagTone = 'default' | 'info' | 'error' | 'success' | 'warning';

const tagTones: Record<TagTone, { background: string; text: string }> = {
  default: { background: colors.primary[100], text: colors.primary[700] },
  info: { background: colors.secondary[100], text: colors.secondary[700] },
  error: { background: colors.error[100], text: colors.error[700] },
  success: { background: colors.success[100], text: colors.success[700] },
  warning: { background: colors.warning[100], text: colors.warning[700] },
};

export function Tag({ label, tone = 'default' }: { label: string; tone?: TagTone }) {
  const palette = tagTones[tone];
  return (
    <View style={[styles.tag, { backgroundColor: palette.background }]}>
      <Text style={[styles.tagLabel, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

export function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <View style={styles.errorBanner} accessibilityRole="alert">
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

export function NoticeBanner({ children }: { children: ReactNode }) {
  return (
    <View style={styles.notice}>
      <Text style={styles.noticeText}>{children}</Text>
    </View>
  );
}

export function LoadingState() {
  return (
    <View style={styles.centered}>
      <ActivityIndicator color={colors.primary[600]} />
    </View>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral[50] },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.sm, paddingBottom: spacing.lg },
  inner: { width: '100%', maxWidth: 880, alignSelf: 'center', gap: spacing.sm, paddingTop: spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.sm,
    flexWrap: 'wrap',
    paddingBottom: spacing.xs,
  },
  headerText: { flexShrink: 1, gap: 6 },
  eyebrow: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.primary[500],
  },
  title: { fontFamily: fonts.bold, fontSize: 32, lineHeight: 38, letterSpacing: -0.5, color: colors.primary[700] },
  subtitle: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 23, color: colors.neutral[500], maxWidth: 560 },
  card: {
    backgroundColor: colors.neutral[0],
    borderWidth: 1,
    borderColor: colors.neutral[100],
    borderRadius: radius.lg,
    padding: spacing.sm,
    gap: spacing.xs,
    minWidth: 0,
    boxShadow: shadows.card,
  },
  sectionTitle: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 24, color: colors.neutral[900] },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  buttonPrimary: { backgroundColor: colors.primary[700], borderColor: colors.primary[700], boxShadow: shadows.button },
  buttonSecondary: { backgroundColor: colors.neutral[0], borderColor: colors.neutral[200] },
  buttonLabelPrimary: { fontFamily: fonts.semibold, fontSize: 15, color: colors.neutral[0] },
  buttonLabelSecondary: { fontFamily: fonts.semibold, fontSize: 15, color: colors.primary[700] },
  pressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5 },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  tagLabel: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16 },
  errorBanner: {
    backgroundColor: colors.error[100],
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 12,
  },
  errorText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.error[700] },
  notice: {
    backgroundColor: colors.warning[100],
    borderWidth: 1,
    borderColor: colors.warning[300],
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  noticeText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 22, color: colors.warning[700] },
  centered: { paddingVertical: spacing.md, alignItems: 'center' },
  empty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.neutral[200],
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.neutral[50],
  },
  emptyText: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.neutral[500], textAlign: 'center' },
});
