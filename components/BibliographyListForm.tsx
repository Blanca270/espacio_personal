import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, ErrorBanner } from '@/components/ui';
import { TextField } from '@/components/forms';
import { createBibliographyList } from '@/lib/api';
import type { BibliographyListRow } from '@/lib/types';
import { spacing } from '@/constants/theme';
import { BIBLIOGRAPHY_ALL, BIBLIOGRAPHY_NO_LIST } from '@/constants/options';

export function BibliographyListForm({ lists, onSaved }: { lists: BibliographyListRow[]; onSaved: () => void }) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Escribe un nombre para la lista.');
      return;
    }
    const taken = [BIBLIOGRAPHY_ALL, BIBLIOGRAPHY_NO_LIST, ...lists.map((list) => list.name)];
    if (taken.some((name) => name.toLowerCase() === cleanName.toLowerCase())) {
      setError('Ese nombre ya está en uso. Elige otro.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createBibliographyList(cleanName);
      onSaved();
    } catch {
      setError('No pudimos crear la lista. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.form}>
      <TextField label="Nombre de la lista" value={name} onChangeText={setName} placeholder="Ej. Capítulo 2: Metodología" />
      <ErrorBanner message={error} />
      <Button label={saving ? 'Creando…' : 'Crear lista'} onPress={handleSave} disabled={saving} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.sm },
});
