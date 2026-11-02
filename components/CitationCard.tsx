import { StyleSheet, Text, View } from 'react-native';
import { ArrowRightLeft, Check, Copy, Trash2 } from 'lucide-react-native';
import { Button, IconButton, Tag } from '@/components/ui';
import { formatApaCitation } from '@/lib/citation';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import type { BibliographyRow } from '@/lib/types';

type CitationCardProps = {
  entry: BibliographyRow;
  listName: string | null;
  copied: boolean;
  onCopy: () => void;
  onMove: () => void;
  onDelete: () => void;
};

export function CitationCard({ entry, listName, copied, onCopy, onMove, onDelete }: CitationCardProps) {
  return (
    <View style={styles.row}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{entry.title}</Text>
          <View style={styles.tagRow}>
            <Tag label={entry.kind} tone="info" />
            {listName ? <Tag label={listName} /> : null}
            {entry.pages ? <Tag label={`p. ${entry.pages}`} /> : null}
          </View>
        </View>
        <IconButton icon={<ArrowRightLeft size={17} color={colors.neutral[500]} />} label={`Mover ${entry.title}`} onPress={onMove} />
        <IconButton icon={<Trash2 size={17} color={colors.neutral[500]} />} label={`Eliminar ${entry.title}`} onPress={onDelete} />
      </View>
      <View style={styles.citation}>
        <Text style={styles.citationText} selectable>
          {formatApaCitation(entry)}
        </Text>
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
          onPress={onCopy}
          icon={copied ? <Check size={16} color={colors.success[700]} /> : <Copy size={16} color={colors.primary[700]} />}
        />
      </View>
    </View>
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
  notes: { gap: 4, paddingLeft: spacing.xs, borderLeftWidth: 3, borderLeftColor: colors.accent[700] },
  notesLabel: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, color: colors.accent[700] },
  notesText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.neutral[700] },
  copyRow: { flexDirection: 'row' },
});
