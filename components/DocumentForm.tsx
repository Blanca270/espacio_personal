import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, ErrorBanner } from '@/components/ui';
import { OptionPicker, TextField } from '@/components/forms';
import { createDocument } from '@/lib/api';
import { DOCUMENT_CATEGORIES, type DocumentCategory } from '@/constants/options';
import { spacing } from '@/constants/theme';

export function DocumentForm({ onSaved }: { onSaved: () => void }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Personal');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    const cleanTitle = title.trim();
    const cleanUrl = url.trim();
    if (!cleanTitle) {
      setError('Escribe el nombre del documento.');
      return;
    }
    if (cleanUrl && !/^https?:\/\//i.test(cleanUrl)) {
      setError('El enlace debe comenzar con http:// o https://');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createDocument({ title: cleanTitle, category, url: cleanUrl || null, notes: notes.trim() });
      onSaved();
    } catch {
      setError('No pudimos guardar el documento. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.form}>
      <TextField label="Nombre" value={title} onChangeText={setTitle} placeholder="Ej. Constancia de curso" />
      <OptionPicker label="Categoría" options={DOCUMENT_CATEGORIES} value={category} onChange={setCategory} />
      <TextField
        label="Enlace (opcional)"
        value={url}
        onChangeText={setUrl}
        placeholder="https://..."
        autoCapitalize="none"
        keyboardType="url"
      />
      <TextField
        label="Notas"
        value={notes}
        onChangeText={setNotes}
        placeholder="Descripción o ubicación del documento"
        multiline
      />
      <ErrorBanner message={error} />
      <Button label={saving ? 'Guardando…' : 'Agregar a mi lista'} onPress={handleSave} disabled={saving} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.sm },
});
