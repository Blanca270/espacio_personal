import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Trash2 } from 'lucide-react-native';
import { IconButton, Tag } from '@/components/ui';
import { colors, fonts, spacing } from '@/constants/theme';
import type { TaskRow } from '@/lib/types';

type TaskItemProps = {
  task: TaskRow;
  onToggle: (task: TaskRow) => void;
  onDelete: (task: TaskRow) => void;
};

function formatDueDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

const priorityTone = { Alta: 'error', Normal: 'info', Baja: 'default' } as const;

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const tone = priorityTone[task.priority as keyof typeof priorityTone] ?? 'default';
  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => onToggle(task)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.done }}
        accessibilityLabel={`Marcar "${task.title}" como ${task.done ? 'pendiente' : 'completada'}`}
        style={({ pressed }) => [styles.checkbox, task.done && styles.checkboxDone, pressed && { opacity: 0.7 }]}
      >
        {task.done ? <Check size={14} color={colors.neutral[0]} strokeWidth={3} /> : null}
      </Pressable>
      <View style={styles.body}>
        <Text style={[styles.title, task.done && styles.titleDone]}>{task.title}</Text>
        <View style={styles.meta}>
          {task.due_date ? <Text style={styles.metaText}>{formatDueDate(task.due_date)}</Text> : null}
          <Tag label={`Prioridad ${task.priority.toLowerCase()}`} tone={tone} />
        </View>
      </View>
      <IconButton
        icon={<Trash2 size={17} color={colors.neutral[500]} />}
        label={`Eliminar tarea ${task.title}`}
        onPress={() => onDelete(task)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: colors.primary[700], borderColor: colors.primary[700] },
  body: { flex: 1, minWidth: 0, gap: 6 },
  title: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 21, color: colors.neutral[900] },
  titleDone: { textDecorationLine: 'line-through', color: colors.neutral[500] },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' },
  metaText: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.neutral[500] },
});
