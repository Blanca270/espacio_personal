import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Check, Copy, Plus, Trash2 } from 'lucide-react-native';
import { Button, Card, EmptyState, ErrorBanner, IconButton, LoadingState, Screen, Tag } from '@/components/ui';
import { SearchField } from '@/components/forms';
import { FormModal } from '@/components/FormModal';
import { BibliographyForm } from '@/components/BibliographyForm';
import { deleteBibliography, listBibliography } from '@/lib/api';
import { useLoader } from '@/lib/useLoader';
import { formatApaCitation } from '@/lib/citation';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import type { BibliographyRow } from '@/lib/types';

export default function CitationsScreen() {
  const entries = useLoader(listBibliography);
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!copiedId) return;
    const timer = setTimeout(() => setCopiedId(null), 2000);
    return () => clearTimeout(timer);
  }, [copiedId]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (entries.data ?? [])
      .filter((entry) => `${entry.title} ${entry.authors} ${entry.source} ${entry.kind}`.toLowerCase().includes(q))
      .sort((a, b) => formatApaCitation(a).localeCompare(formatApaCitation(b), 'es'));
  }, [entries.data, query]);

  async function handleCopy(entry: BibliographyRow) {
    setActionError(null);
    try {
      await Clipboard.setStringAsync(formatApaCitation(entry));
      setCopiedId(entry.id);
    } catch {
      setActionError('No pudimos copiar la cita. Intenta de nuevo.');
    }
  }

  async function handleDelete(entry: BibliographyRow) {
    setActionError(null);
    try {
      await deleteBibliography(entry.id);
      entries.reload();
    } catch {
      setActionError('No pudimos eliminar la referencia. Intenta de nuevo.');
    }
  }

  function handleSaved() {
    setFormOpen(false);
    entries.reload();
  }

  return (
    <Screen
      eyebrow="Fuentes para tus trabajos"
      title="Referencias bibliográficas"
      subtitle="Guarda tus fuentes y copia su cita en formato APA cuando la necesites."
      action={<Button label="Nueva referencia" icon={<Plus size={18} color={colors.neutral[0]} />} onPress={() => setFormOpen(true)} />}>
      <SearchField value={query} onChangeText={setQuery} placeholder="Buscar por título, autor o editorial..." />
      <ErrorBanner message={entries.error ?? actionError} />

      <Card>
        {entries.loading && !entries.data ? (
          <LoadingState />
        ) : visible.length === 0 ? (
          <EmptyState message={query ? 'Ninguna referencia coincide con tu búsqueda.' : 'Aún no tienes referencias bibliográficas.'} />
        ) : (
          visible.map((entry) => {
            const copied = copiedId === entry.id;
            return (
              <View key={entry.id} style={styles.row}>
                <View style={styles.header}>
                  <View style={styles.headerText}>
                    <Text style={styles.title}>{entry.title}</Text>
                    <View style={styles.tagRow}>
                      <Tag label={entry.kind} tone="info" />
                      {entry.pages ? <Tag label={`p. ${entry.pages}`} /> : null}
                    </View>
                  </View>
                  <IconButton
                    icon={<Trash2 size={17} color={colors.neutral[500]} />}
                    label={`Eliminar ${entry.title}`}
                    onPress={() => handleDelete(entry)}
                  />
                </View>
                <View style={styles.citation}>
                  <Text style={styles.citationText} selectable>{formatApaCitation(entry)}</Text>
                </View>
                {entry.personal_notes ? (
                  <View style={styles.notes}>
                    <Text style={styles.notesLabel}>Mis notas</Text>
                    <Text style={styles.notesText}>{entry.personal_notes}</Text>
                  </View>
                ) : null}
                <View style={styles.copyRow}>
                  <Button
                    label={copied ? 'Cita copiada' : 'Copiar cita APA'}
                    variant="secondary"
                    onPress={() => handleCopy(entry)}
                    icon={copied ? <Check size={16} color={colors.success[700]} /> : <Copy size={16} color={colors.primary[700]} />}
                  />
                </View>
              </View>
            );
          })
        )}
      </Card>

      <FormModal visible={formOpen} title="Nueva referencia bibliográfica" onClose={() => setFormOpen(false)}>
        <BibliographyForm onSaved={handleSaved} />
      </FormModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs },
  headerText: { flex: 1, minWidth: 0, gap: 6 },
  title: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22, color: colors.neutral[900] },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  citation: {
    backgroundColor: colors.neutral[50],
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.neutral[100],
    padding: spacing.xs,
  },
  citationText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 22, color: colors.neutral[700] },
  copyRow: { flexDirection: 'row' },
  notes: { gap: 4, paddingLeft: spacing.xs, borderLeftWidth: 3, borderLeftColor: colors.accent[700] },
  notesLabel: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, color: colors.accent[700] },
  notesText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.neutral[700] },
});
