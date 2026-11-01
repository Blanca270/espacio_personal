import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react-native';
import { Button, Card, EmptyState, ErrorBanner, LoadingState, Screen } from '@/components/ui';
import { OptionPicker } from '@/components/forms';
import { FormModal } from '@/components/FormModal';
import { TaskForm } from '@/components/TaskForm';
import { TaskItem } from '@/components/TaskItem';
import { deleteTask, listTasks, setTaskDone } from '@/lib/api';
import { useLoader } from '@/lib/useLoader';
import { colors } from '@/constants/theme';
import type { TaskRow } from '@/lib/types';

const FILTERS = ['Todas', 'Pendientes', 'Completadas'] as const;
type Filter = (typeof FILTERS)[number];

export default function TasksScreen() {
  const tasks = useLoader(listTasks);
  const [filter, setFilter] = useState<Filter>('Todas');
  const [formOpen, setFormOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const visible = useMemo(() => {
    const all = tasks.data ?? [];
    if (filter === 'Pendientes') return all.filter((task) => !task.done);
    if (filter === 'Completadas') return all.filter((task) => task.done);
    return all;
  }, [tasks.data, filter]);

  async function handleToggle(task: TaskRow) {
    setActionError(null);
    try {
      await setTaskDone(task.id, !task.done);
      tasks.reload();
    } catch {
      setActionError('No pudimos actualizar la tarea. Intenta de nuevo.');
    }
  }

  async function handleDelete(task: TaskRow) {
    setActionError(null);
    try {
      await deleteTask(task.id);
      tasks.reload();
    } catch {
      setActionError('No pudimos eliminar la tarea. Intenta de nuevo.');
    }
  }

  function handleSaved() {
    setFormOpen(false);
    tasks.reload();
  }

  return (
    <Screen
      eyebrow="Pendientes"
      title="Tareas"
      subtitle="Registra pendientes y marca lo que hayas terminado."
      action={<Button label="Nueva tarea" icon={<Plus size={18} color={colors.neutral[0]} />} onPress={() => setFormOpen(true)} />}>
      <OptionPicker label="Mostrar" options={FILTERS} value={filter} onChange={setFilter} />
      <ErrorBanner message={tasks.error ?? actionError} />

      <Card>
        {tasks.loading && !tasks.data ? (
          <LoadingState />
        ) : visible.length === 0 ? (
          <EmptyState message="No hay tareas en esta vista." />
        ) : (
          visible.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
          ))
        )}
      </Card>

      <FormModal visible={formOpen} title="Nueva tarea" onClose={() => setFormOpen(false)}>
        <TaskForm onSaved={handleSaved} />
      </FormModal>
    </Screen>
  );
}
