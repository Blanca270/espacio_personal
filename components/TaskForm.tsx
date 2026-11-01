import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, ErrorBanner } from '@/components/ui';
import { OptionPicker, TextField } from '@/components/forms';
import { createTask } from '@/lib/api';
import { TASK_PRIORITIES, type TaskPriority } from '@/constants/options';
import { spacing } from '@/constants/theme';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function TaskForm({ onSaved }: { onSaved: () => void }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Normal');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    const cleanTitle = title.trim();
    const cleanDate = dueDate.trim();
    if (!cleanTitle) {
      setError('Escribe la tarea.');
      return;
    }
    if (cleanDate && (!ISO_DATE.test(cleanDate) || Number.isNaN(Date.parse(cleanDate)))) {
      setError('La fecha debe tener el formato AAAA-MM-DD, por ejemplo 2026-12-31.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createTask({ title: cleanTitle, due_date: cleanDate || null, priority });
      onSaved();
    } catch {
      setError('No pudimos guardar la tarea. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.form}>
      <TextField label="¿Qué necesitas hacer?" value={title} onChangeText={setTitle} placeholder="Ej. Revisar bibliografía" />
      <TextField
        label="Fecha límite (opcional)"
        value={dueDate}
        onChangeText={setDueDate}
        placeholder="AAAA-MM-DD"
        autoCapitalize="none"
        maxLength={10}
      />
      <OptionPicker label="Prioridad" options={TASK_PRIORITIES} value={priority} onChange={setPriority} />
      <ErrorBanner message={error} />
      <Button label={saving ? 'Guardando…' : 'Agregar tarea'} onPress={handleSave} disabled={saving} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.sm },
});
