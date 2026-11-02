import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, ErrorBanner } from '@/components/ui';
import { OptionPicker, TextField } from '@/components/forms';
import { createBibliography } from '@/lib/api';
import type { BibliographyListRow } from '@/lib/types';
import { BIBLIOGRAPHY_KINDS, BIBLIOGRAPHY_NO_LIST, type BibliographyKind } from '@/constants/options';
import { spacing } from '@/constants/theme';

export function BibliographyForm({ lists, onSaved }: { lists: BibliographyListRow[]; onSaved: () => void }) {
  const [kind, setKind] = useState<BibliographyKind>('Libro');
  const [listName, setListName] = useState(BIBLIOGRAPHY_NO_LIST);
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [year, setYear] = useState('');
  const [source, setSource] = useState('');
  const [url, setUrl] = useState('');
  const [doi, setDoi] = useState('');
  const [pages, setPages] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    const cleanTitle = title.trim();
    const cleanYear = year.trim();
    const cleanUrl = url.trim();
    const cleanDoi = doi.trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, '');
    if (!cleanTitle) {
      setError('Escribe el título de la obra.');
      return;
    }
    if (cleanYear && !/^\d{4}$/.test(cleanYear)) {
      setError('El año debe tener cuatro dígitos, por ejemplo 2024.');
      return;
    }
    if (cleanUrl && !/^https?:\/\//i.test(cleanUrl)) {
      setError('El enlace debe comenzar con http:// o https://');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createBibliography({
        kind,
        title: cleanTitle,
        authors: authors.trim(),
        year: cleanYear,
        source: source.trim(),
        url: cleanUrl || null,
        doi: cleanDoi || null,
        pages: pages.trim(),
        personal_notes: personalNotes.trim(),
        list_id: lists.find((list) => list.name === listName)?.id ?? null,
      });
      onSaved();
    } catch {
      setError('No pudimos guardar la referencia. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.form}>
      <OptionPicker label="Tipo de fuente" options={BIBLIOGRAPHY_KINDS} value={kind} onChange={setKind} />
      <OptionPicker label="Lista" options={[BIBLIOGRAPHY_NO_LIST, ...lists.map((list) => list.name)]} value={listName} onChange={setListName} />
      <TextField label="Título" value={title} onChangeText={setTitle} placeholder="Ej. Métodos de investigación" />
      <TextField
        label="Autores"
        value={authors}
        onChangeText={setAuthors}
        placeholder="Apellido, N.; Apellido, N."
      />
      <View style={styles.row}>
        <View style={styles.half}>
          <TextField label="Año" value={year} onChangeText={setYear} placeholder="2024" keyboardType="number-pad" maxLength={4} />
        </View>
        <View style={styles.half}>
          <TextField label="Editorial o revista" value={source} onChangeText={setSource} placeholder="Ej. Editorial Trillas" />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.half}>
          <TextField label="Página o rango (opcional)" value={pages} onChangeText={setPages} placeholder="Ej. 45-52" />
        </View>
        <View style={styles.half}>
          <TextField label="DOI (opcional)" value={doi} onChangeText={setDoi} placeholder="10.1000/xyz123" autoCapitalize="none" />
        </View>
      </View>
      <TextField
        label="Enlace (opcional)"
        value={url}
        onChangeText={setUrl}
        placeholder="https://..."
        autoCapitalize="none"
        keyboardType="url"
      />
      <TextField
        label="Notas personales (opcional)"
        value={personalNotes}
        onChangeText={setPersonalNotes}
        placeholder="Qué te aportó esta fuente, ideas para citarla, dudas..."
        multiline
      />
      <ErrorBanner message={error} />
      <Button label={saving ? 'Guardando…' : 'Guardar referencia'} onPress={handleSave} disabled={saving} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  half: { flexGrow: 1, flexBasis: 200 },
});
