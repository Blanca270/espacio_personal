import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, ErrorBanner } from '@/components/ui';
import { OptionPicker, TextField } from '@/components/forms';
import { createReference } from '@/lib/api';
import { REFERENCE_TYPES, type ReferenceType } from '@/constants/options';
import { spacing } from '@/constants/theme';

export function ReferenceForm({ onSaved }: { onSaved: () => void }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ReferenceType>(REFERENCE_TYPES[0]);
  const [author, setAuthor] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError('Escribe un título.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createReference({ title: cleanTitle, type, author: author.trim(), body: body.trim() });
      onSaved();
    } catch {
      setError('No pudimos guardar la referencia. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.form}>
      <TextField label="Título" value={title} onChangeText={setTitle} placeholder="Título del libro, artículo o idea" />
      <OptionPicker label="Tipo" options={REFERENCE_TYPES} value={type} onChange={setType} />
      <TextField
        label="Autor o institución (opcional)"
        value={author}
        onChangeText={setAuthor}
        placeholder="Apellido, nombre o institución"
      />
      <TextField
        label="Resumen, referencia o comentario"
        value={body}
        onChangeText={setBody}
        placeholder="Anota los datos que quieras recordar..."
        multiline
      />
      <ErrorBanner message={error} />
      <Button label={saving ? 'Guardando…' : 'Guardar en investigación'} onPress={handleSave} disabled={saving} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.sm },
});
