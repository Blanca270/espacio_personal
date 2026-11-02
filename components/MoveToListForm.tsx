import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, ErrorBanner } from '@/components/ui';
import { OptionPicker } from '@/components/forms';
import { setBibliographyList } from '@/lib/api';
import type { BibliographyListRow, BibliographyRow } from '@/lib/types';
import { spacing } from '@/constants/theme';
import { BIBLIOGRAPHY_NO_LIST } from '@/constants/options';

export function MoveToListForm({
  entry,
  lists,
  onSaved,
}: {
  entry: BibliographyRow;
  lists: BibliographyListRow[];
  onSaved: () => void;
}) {
  const currentName = lists.find((list) => list.id === entry.list_id)?.name ?? BIBLIOGRAPHY_NO_LIST;
  const [listName, setListName] = useState(currentName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await setBibliographyList(entry.id, lists.find((list) => list.name === listName)?.id ?? null);
      onSaved();
    } catch {
      setError('No pudimos mover la referencia. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.form}>
      <OptionPicker label="Lista" options={[BIBLIOGRAPHY_NO_LIST, ...lists.map((list) => list.name)]} value={listName} onChange={setListName} />
      <ErrorBanner message={error} />
      <Button label={saving ? 'Guardando…' : 'Mover referencia'} onPress={handleSave} disabled={saving || listName === currentName} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.sm },
});
