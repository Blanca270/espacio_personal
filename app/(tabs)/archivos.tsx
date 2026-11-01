import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { FileText, Plus, X } from 'lucide-react-native';
import { Button, Card, EmptyState, ErrorBanner, IconButton, NoticeBanner, Screen, Tag } from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/constants/theme';

type PickedFile = {
  key: string;
  name: string;
  uri: string;
  size: number | null;
  mimeType: string | null;
};

const ACCEPTED_TYPES = [
  'image/*',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function formatSize(bytes: number | null) {
  if (bytes === null) return 'Tamaño desconocido';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FilesScreen() {
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handlePick() {
    setError(null);
    try {
      const result = await DocumentPicker.getDocumentAsync({ multiple: true, type: ACCEPTED_TYPES });
      if (result.canceled) return;
      const picked = result.assets.map((asset) => ({
        key: `${asset.uri}-${asset.name}`,
        name: asset.name,
        uri: asset.uri,
        size: asset.size ?? null,
        mimeType: asset.mimeType ?? null,
      }));
      setFiles((current) => [...picked, ...current]);
    } catch {
      setError('No pudimos abrir el selector de archivos. Intenta de nuevo.');
    }
  }

  function handleRemove(key: string) {
    setFiles((current) => current.filter((file) => file.key !== key));
  }

  return (
    <Screen
      eyebrow="Tu material"
      title="Fotografías y archivos"
      subtitle="Revisa imágenes y documentos seleccionados durante esta sesión."
      action={<Button label="Elegir archivos" icon={<Plus size={18} color={colors.neutral[0]} />} onPress={handlePick} />}>
      <ErrorBanner message={error} />

      <Card>
        {files.length === 0 ? (
          <EmptyState message="Los archivos que selecciones aparecerán aquí temporalmente." />
        ) : (
          files.map((file) => {
            const isImage = file.mimeType?.startsWith('image/') ?? false;
            return (
              <View key={file.key} style={styles.row}>
                {isImage ? (
                  <Image source={{ uri: file.uri }} style={styles.thumb} accessibilityLabel={file.name} />
                ) : (
                  <View style={styles.thumbFallback}>
                    <FileText size={26} color={colors.primary[700]} />
                  </View>
                )}
                <View style={styles.body}>
                  <Text style={styles.title} numberOfLines={2}>{file.name}</Text>
                  <View style={styles.tagRow}>
                    <Tag label={formatSize(file.size)} tone="info" />
                  </View>
                </View>
                <IconButton
                  icon={<X size={18} color={colors.neutral[500]} />}
                  label={`Quitar ${file.name}`}
                  onPress={() => handleRemove(file.key)}
                />
              </View>
            );
          })
        )}
      </Card>

      <NoticeBanner>
        Los archivos elegidos aquí solo se muestran en esta sesión: no se guardan de forma permanente ni se suben a internet.
      </NoticeBanner>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  thumb: { width: 64, height: 64, borderRadius: radius.sm, backgroundColor: colors.neutral[100] },
  thumbFallback: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, minWidth: 0, gap: 6 },
  title: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 21, color: colors.neutral[900] },
  tagRow: { flexDirection: 'row' },
});
