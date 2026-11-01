import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Plus, Trash2 } from 'lucide-react-native';
import { Button, Card, EmptyState, ErrorBanner, IconButton, LoadingState, Screen, Tag } from '@/components/ui';
import { SearchField } from '@/components/forms';
import { FormModal } from '@/components/FormModal';
import { ReferenceForm } from '@/components/ReferenceForm';
import { deleteReference, listReferences } from '@/lib/api';
import { useLoader } from '@/lib/useLoader';
import { NOTE_TYPE } from '@/constants/options';
import { colors, fonts, spacing } from '@/constants/theme';
import type { ReferenceRow } from '@/lib/types';

export default function ResearchScreen() {
  const references = useLoader(listReferences);
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (references.data ?? []).filter((item) =>
      `${item.title} ${item.type} ${item.author} ${item.body}`.toLowerCase().includes(q)
    );
  }, [references.data, query]);

  async function handleDelete(item: ReferenceRow) {
    setActionError(null);
    try {
      await deleteReference(item.id);
      references.reload();
    } catch {
      setActionError('No pudimos eliminar la nota. Intenta de nuevo.');
    }
  }

  function handleSaved() {
    setFormOpen(false);
    references.reload();
  }

  return (
    <Screen
      eyebrow="Estudios y proyectos"
      title="Investigación"
      subtitle="Organiza preguntas, lecturas, referencias y avances de tus proyectos."
      action={<Button label="Nueva referencia" icon={<Plus size={18} color={colors.neutral[0]} />} onPress={() => setFormOpen(true)} />}>
      <SearchField value={query} onChangeText={setQuery} placeholder="Buscar en notas..." />
      <ErrorBanner message={references.error ?? actionError} />

      <Card>
        {references.loading && !references.data ? (
          <LoadingState />
        ) : visible.length === 0 ? (
          <EmptyState message={query ? 'Ninguna nota coincide con tu búsqueda.' : 'Todavía no has guardado notas o referencias.'} />
        ) : (
          visible.map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={styles.body}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.tagRow}>
                  <Tag label={item.type} tone={item.type === NOTE_TYPE ? 'default' : 'info'} />
                </View>
                {item.author ? <Text style={styles.meta}>{item.author}</Text> : null}
                {item.body ? <Text style={styles.text}>{item.body}</Text> : null}
              </View>
              <IconButton
                icon={<Trash2 size={18} color={colors.neutral[500]} />}
                label={`Eliminar ${item.title}`}
                onPress={() => handleDelete(item)}
              />
            </View>
          ))
        )}
      </Card>

      <FormModal visible={formOpen} title="Agregar nota o referencia" onClose={() => setFormOpen(false)}>
        <ReferenceForm onSaved={handleSaved} />
      </FormModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  body: { flex: 1, minWidth: 0, gap: 6 },
  title: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22, color: colors.neutral[900] },
  tagRow: { flexDirection: 'row' },
  meta: { fontFamily: fonts.regular, fontSize: 13, color: colors.neutral[500] },
  text: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.neutral[700] },
});
