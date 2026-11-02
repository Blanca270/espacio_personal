import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { FolderPlus, ListChecks, Plus, Trash2 } from 'lucide-react-native';
import { Button, Card, EmptyState, ErrorBanner, LoadingState, Screen } from '@/components/ui';
import { OptionPicker, SearchField } from '@/components/forms';
import { FormModal } from '@/components/FormModal';
import { BibliographyForm } from '@/components/BibliographyForm';
import { BibliographyListForm } from '@/components/BibliographyListForm';
import { CitationCard } from '@/components/CitationCard';
import { MoveToListForm } from '@/components/MoveToListForm';
import { deleteBibliography, deleteBibliographyList, listBibliography, listBibliographyLists } from '@/lib/api';
import { useLoader } from '@/lib/useLoader';
import { formatApaCitation } from '@/lib/citation';
import { BIBLIOGRAPHY_ALL, BIBLIOGRAPHY_NO_LIST } from '@/constants/options';
import { colors, spacing } from '@/constants/theme';
import type { BibliographyRow } from '@/lib/types';

const LIST_COPY_KEY = 'list';

export default function CitationsScreen() {
  const entries = useLoader(listBibliography);
  const lists = useLoader(listBibliographyLists);
  const [query, setQuery] = useState('');
  const [listFilter, setListFilter] = useState(BIBLIOGRAPHY_ALL);
  const [formOpen, setFormOpen] = useState(false);
  const [listFormOpen, setListFormOpen] = useState(false);
  const [movingEntry, setMovingEntry] = useState<BibliographyRow | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!copiedKey) return;
    const timer = setTimeout(() => setCopiedKey(null), 2000);
    return () => clearTimeout(timer);
  }, [copiedKey]);

  const allLists = lists.data ?? [];
  const listNameById = useMemo(() => new Map(allLists.map((list) => [list.id, list.name])), [allLists]);
  const filterOptions = [BIBLIOGRAPHY_ALL, BIBLIOGRAPHY_NO_LIST, ...allLists.map((list) => list.name)];
  const activeFilter = filterOptions.includes(listFilter) ? listFilter : BIBLIOGRAPHY_ALL;
  const selectedList = allLists.find((list) => list.name === activeFilter) ?? null;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (entries.data ?? [])
      .filter((entry) => {
        if (activeFilter === BIBLIOGRAPHY_NO_LIST) return entry.list_id === null;
        if (selectedList) return entry.list_id === selectedList.id;
        return true;
      })
      .filter((entry) => `${entry.title} ${entry.authors} ${entry.source} ${entry.kind}`.toLowerCase().includes(q))
      .sort((a, b) => formatApaCitation(a).localeCompare(formatApaCitation(b), 'es'));
  }, [entries.data, query, activeFilter, selectedList]);

  async function handleCopy(key: string, text: string) {
    setActionError(null);
    try {
      await Clipboard.setStringAsync(text);
      setCopiedKey(key);
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

  async function handleDeleteList() {
    if (!selectedList) return;
    setActionError(null);
    try {
      await deleteBibliographyList(selectedList.id);
      setListFilter(BIBLIOGRAPHY_ALL);
      lists.reload();
      entries.reload();
    } catch {
      setActionError('No pudimos eliminar la lista. Intenta de nuevo.');
    }
  }

  function handleSaved() {
    setFormOpen(false);
    entries.reload();
  }

  function handleListSaved() {
    setListFormOpen(false);
    lists.reload();
  }

  function handleMoved() {
    setMovingEntry(null);
    entries.reload();
  }

  const loadError = entries.error ?? lists.error;

  return (
    <Screen
      eyebrow="Fuentes para tus trabajos"
      title="Referencias bibliográficas"
      subtitle="Guarda tus fuentes, organízalas en listas y copia sus citas en formato APA."
      action={
        <View style={styles.actions}>
          <Button label="Nueva lista" variant="secondary" icon={<FolderPlus size={18} color={colors.primary[700]} />} onPress={() => setListFormOpen(true)} />
          <Button label="Nueva referencia" icon={<Plus size={18} color={colors.neutral[0]} />} onPress={() => setFormOpen(true)} />
        </View>
      }>
      <SearchField value={query} onChangeText={setQuery} placeholder="Buscar por título, autor o editorial..." />
      <OptionPicker label="Mostrar" options={filterOptions} value={activeFilter} onChange={setListFilter} />
      <ErrorBanner message={loadError ?? actionError} />

      {selectedList || visible.length > 0 ? (
        <View style={styles.listActions}>
          {visible.length > 0 ? (
            <Button
              label={copiedKey === LIST_COPY_KEY ? 'Lista copiada' : 'Copiar lista en APA'}
              variant="secondary"
              icon={<ListChecks size={16} color={colors.primary[700]} />}
              onPress={() => handleCopy(LIST_COPY_KEY, visible.map(formatApaCitation).join('\n\n'))}
            />
          ) : null}
          {selectedList ? (
            <Button label="Eliminar lista" variant="secondary" icon={<Trash2 size={16} color={colors.primary[700]} />} onPress={handleDeleteList} />
          ) : null}
        </View>
      ) : null}

      <Card>
        {entries.loading && !entries.data ? (
          <LoadingState />
        ) : visible.length === 0 ? (
          <EmptyState message={query || activeFilter !== BIBLIOGRAPHY_ALL ? 'Ninguna referencia coincide con tu búsqueda o lista.' : 'Aún no tienes referencias bibliográficas.'} />
        ) : (
          visible.map((entry) => (
            <CitationCard
              key={entry.id}
              entry={entry}
              listName={entry.list_id ? listNameById.get(entry.list_id) ?? null : null}
              copied={copiedKey === entry.id}
              onCopy={() => handleCopy(entry.id, formatApaCitation(entry))}
              onMove={() => setMovingEntry(entry)}
              onDelete={() => handleDelete(entry)}
            />
          ))
        )}
      </Card>

      <FormModal visible={formOpen} title="Nueva referencia bibliográfica" onClose={() => setFormOpen(false)}>
        <BibliographyForm lists={allLists} onSaved={handleSaved} />
      </FormModal>
      <FormModal visible={listFormOpen} title="Nueva lista" onClose={() => setListFormOpen(false)}>
        <BibliographyListForm lists={allLists} onSaved={handleListSaved} />
      </FormModal>
      <FormModal visible={movingEntry !== null} title="Mover a otra lista" onClose={() => setMovingEntry(null)}>
        {movingEntry ? <MoveToListForm entry={movingEntry} lists={allLists} onSaved={handleMoved} /> : null}
      </FormModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  listActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
});
