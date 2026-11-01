import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { ExternalLink, Plus, Trash2 } from 'lucide-react-native';
import { Button, Card, EmptyState, ErrorBanner, IconButton, LoadingState, Screen, Tag } from '@/components/ui';
import { SearchField } from '@/components/forms';
import { FormModal } from '@/components/FormModal';
import { DocumentForm } from '@/components/DocumentForm';
import { deleteDocument, listDocuments } from '@/lib/api';
import { useLoader } from '@/lib/useLoader';
import { colors, fonts, spacing } from '@/constants/theme';
import type { DocumentRow } from '@/lib/types';

export default function DocumentsScreen() {
  const documents = useLoader(listDocuments);
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const visible = (documents.data ?? []).filter((doc) =>
    `${doc.title} ${doc.category} ${doc.notes}`.toLowerCase().includes(normalizedQuery)
  );

  async function handleDelete(doc: DocumentRow) {
    setActionError(null);
    try {
      await deleteDocument(doc.id);
      documents.reload();
    } catch {
      setActionError('No pudimos eliminar el documento. Intenta de nuevo.');
    }
  }

  function handleSaved() {
    setFormOpen(false);
    documents.reload();
  }

  return (
    <Screen
      eyebrow="Mis archivos importantes"
      title="Documentos"
      subtitle="Guarda datos descriptivos, notas y enlaces a documentos importantes."
      action={<Button label="Nuevo documento" icon={<Plus size={18} color={colors.neutral[0]} />} onPress={() => setFormOpen(true)} />}>
      <SearchField value={query} onChangeText={setQuery} placeholder="Buscar documento..." />
      <ErrorBanner message={documents.error ?? actionError} />

      <Card>
        {documents.loading && !documents.data ? (
          <LoadingState />
        ) : visible.length === 0 ? (
          <EmptyState message={query ? 'Ningún documento coincide con tu búsqueda.' : 'Aún no hay documentos en tu lista.'} />
        ) : (
          visible.map((doc) => (
            <View key={doc.id} style={styles.row}>
              <View style={styles.body}>
                <Text style={styles.title}>{doc.title}</Text>
                <View style={styles.tagRow}>
                  <Tag label={doc.category} tone="info" />
                </View>
                {doc.notes ? <Text style={styles.notes}>{doc.notes}</Text> : null}
                {doc.url ? (
                  <Pressable
                    onPress={() => Linking.openURL(doc.url!)}
                    accessibilityRole="link"
                    style={({ pressed }) => [styles.link, pressed && { opacity: 0.7 }]}>
                    <Text style={styles.linkText}>Abrir enlace</Text>
                    <ExternalLink size={14} color={colors.primary[700]} />
                  </Pressable>
                ) : null}
              </View>
              <IconButton
                icon={<Trash2 size={18} color={colors.neutral[500]} />}
                label={`Eliminar ${doc.title}`}
                onPress={() => handleDelete(doc)}
              />
            </View>
          ))
        )}
      </Card>

      <FormModal visible={formOpen} title="Agregar documento o enlace" onClose={() => setFormOpen(false)}>
        <DocumentForm onSaved={handleSaved} />
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
  notes: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.neutral[500] },
  link: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  linkText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary[600], textDecorationLine: 'underline' },
});
