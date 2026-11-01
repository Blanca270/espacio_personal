import { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ListChecks, Library, NotebookPen, type LucideIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Button, Card, EmptyState, ErrorBanner, NoticeBanner, Screen, SectionTitle, Tag } from '@/components/ui';
import { TextField } from '@/components/forms';
import { TaskItem } from '@/components/TaskItem';
import { createReference, deleteTask, listReferences, listTasks, setTaskDone } from '@/lib/api';
import { useLoader } from '@/lib/useLoader';
import { NOTE_TYPE } from '@/constants/options';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import type { TaskRow } from '@/lib/types';

const today = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });

export default function HomeScreen() {
  const router = useRouter();
  const references = useLoader(listReferences);
  const tasks = useLoader(listTasks);

  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);
  const [noteSaved, setNoteSaved] = useState(false);
  const [taskError, setTaskError] = useState<string | null>(null);

  const referenceItems = references.data ?? [];
  const pendingTasks = useMemo(() => (tasks.data ?? []).filter((task) => !task.done), [tasks.data]);
  const noteCount = referenceItems.filter((item) => item.type === NOTE_TYPE).length;

  async function handleSaveNote() {
    const title = noteTitle.trim();
    const body = noteBody.trim();
    if (!title || !body) {
      setNoteSaved(false);
      setNoteError('Escribe un título y el contenido de la nota.');
      return;
    }
    setSaving(true);
    setNoteError(null);
    setNoteSaved(false);
    try {
      await createReference({ title, type: NOTE_TYPE, author: '', body });
      setNoteTitle('');
      setNoteBody('');
      setNoteSaved(true);
      references.reload();
    } catch {
      setNoteError('No pudimos guardar la nota. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(task: TaskRow) {
    setTaskError(null);
    try {
      await setTaskDone(task.id, !task.done);
      tasks.reload();
    } catch {
      setTaskError('No pudimos actualizar la tarea. Intenta de nuevo.');
    }
  }

  async function handleDelete(task: TaskRow) {
    setTaskError(null);
    try {
      await deleteTask(task.id);
      tasks.reload();
    } catch {
      setTaskError('No pudimos eliminar la tarea. Intenta de nuevo.');
    }
  }

  return (
    <Screen
      eyebrow="Tu biblioteca digital"
      title="Bienvenida a tu espacio"
      subtitle="Un lugar para reunir tus notas, estudios, documentos y pendientes."
      action={<Tag label={today} />}>
      <View style={styles.stats}>
        <StatCard icon={NotebookPen} label="Notas guardadas" value={noteCount} loading={references.loading && !references.data} tone="primary" />
        <StatCard icon={ListChecks} label="Tareas pendientes" value={pendingTasks.length} loading={tasks.loading && !tasks.data} tone="accent" />
        <StatCard icon={Library} label="Referencias" value={referenceItems.length} loading={references.loading && !references.data} tone="secondary" />
      </View>

      <View style={styles.columns}>
        <Card style={styles.column}>
          <SectionTitle>Captura una idea</SectionTitle>
          <Text style={styles.muted}>Guarda una nota para consultarla después.</Text>
          <TextField label="Título" value={noteTitle} onChangeText={setNoteTitle} placeholder="Ej. Idea para mi investigación" />
          <TextField
            label="Contenido"
            value={noteBody}
            onChangeText={setNoteBody}
            placeholder="Escribe aquí..."
            multiline
          />
          <ErrorBanner message={noteError} />
          {noteSaved ? <Text style={styles.success}>Nota guardada.</Text> : null}
          <Button label={saving ? 'Guardando…' : 'Guardar nota'} onPress={handleSaveNote} disabled={saving} />
        </Card>

        <Card style={styles.column}>
          <SectionTitle>Próximas tareas</SectionTitle>
          <ErrorBanner message={tasks.error ?? taskError} />
          {tasks.loading && !tasks.data ? (
            <ActivityIndicator color={colors.primary[700]} />
          ) : pendingTasks.length === 0 ? (
            <EmptyState message="No tienes tareas pendientes. Buen trabajo." />
          ) : (
            pendingTasks.slice(0, 4).map((task) => (
              <TaskItem key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
            ))
          )}
          <View style={styles.linkRow}>
            <Button label="Ver todas las tareas" variant="secondary" onPress={() => router.navigate('/tareas')} />
          </View>
        </Card>
      </View>

      <NoticeBanner>
        Cualquier persona que tenga acceso a esta app puede ver y editar su contenido, porque todavía no hay inicio de sesión. No guardes contraseñas ni documentos sensibles aquí.
      </NoticeBanner>
    </Screen>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  loading: boolean;
  tone: 'primary' | 'accent' | 'secondary';
}) {
  const palette = statTones[tone];
  return (
    <Card style={styles.stat}>
      <View style={[styles.statIcon, { backgroundColor: palette.background }]}>
        <Icon size={18} color={palette.icon} />
      </View>
      <View style={styles.statText}>
        <Text style={styles.statLabel}>{label}</Text>
        {loading ? <ActivityIndicator color={colors.primary[600]} /> : <Text style={styles.statValue}>{value}</Text>}
      </View>
    </Card>
  );
}

const statTones = {
  primary: { background: colors.primary[100], icon: colors.primary[700] },
  accent: { background: colors.accent[100], icon: colors.accent[700] },
  secondary: { background: colors.secondary[100], icon: colors.secondary[700] },
};

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
  stat: { flexGrow: 1, flexBasis: 200, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.sm },
  statIcon: { width: 44, height: 44, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  statText: { flex: 1, gap: 2 },
  statLabel: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: colors.neutral[500] },
  statValue: { fontFamily: fonts.bold, fontSize: 26, lineHeight: 32, color: colors.neutral[900] },
  columns: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  column: { flexGrow: 1, flexBasis: 320, minWidth: 0 },
  muted: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.neutral[500], marginBottom: spacing.xs },
  success: { fontFamily: fonts.semibold, fontSize: 14, color: colors.success[700] },
  linkRow: { marginTop: spacing.xs },
});
