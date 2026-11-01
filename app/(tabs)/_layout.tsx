import { Tabs } from 'expo-router';
import { BookOpen, CheckSquare, FileText, FolderOpen, Home } from 'lucide-react-native';
import { colors, fonts } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[700],
        tabBarInactiveTintColor: colors.neutral[500],
        tabBarStyle: {
          backgroundColor: colors.neutral[0],
          borderTopColor: colors.neutral[100],
          height: 64,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11 },
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Inicio', tabBarIcon: ({ size, color }) => <Home size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="documentos"
        options={{ title: 'Documentos', tabBarIcon: ({ size, color }) => <FileText size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="investigacion"
        options={{ title: 'Investigación', tabBarIcon: ({ size, color }) => <BookOpen size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="tareas"
        options={{ title: 'Tareas', tabBarIcon: ({ size, color }) => <CheckSquare size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="archivos"
        options={{ title: 'Archivos', tabBarIcon: ({ size, color }) => <FolderOpen size={size} color={color} /> }}
      />
    </Tabs>
  );
}
