import { supabase } from '@/lib/supabase';
import type { DocumentRow, ReferenceRow, TaskRow } from '@/lib/types';

type QueryResult = { error: { message: string } | null };

function check({ error }: QueryResult) {
  if (error) throw new Error(error.message);
}

export type NewDocument = Pick<DocumentRow, 'title' | 'category' | 'url' | 'notes'>;
export type NewReference = Pick<ReferenceRow, 'title' | 'type' | 'author' | 'body'>;
export type NewTask = Pick<TaskRow, 'title' | 'due_date' | 'priority'>;

export async function listDocuments(): Promise<DocumentRow[]> {
  const result = await supabase.from('documents').select('*').order('created_at', { ascending: false });
  check(result);
  return result.data ?? [];
}

export async function createDocument(input: NewDocument) {
  check(await supabase.from('documents').insert(input));
}

export async function deleteDocument(id: string) {
  check(await supabase.from('documents').delete().eq('id', id));
}

export async function listReferences(): Promise<ReferenceRow[]> {
  const result = await supabase.from('references_items').select('*').order('created_at', { ascending: false });
  check(result);
  return result.data ?? [];
}

export async function createReference(input: NewReference) {
  check(await supabase.from('references_items').insert(input));
}

export async function deleteReference(id: string) {
  check(await supabase.from('references_items').delete().eq('id', id));
}

export async function listTasks(): Promise<TaskRow[]> {
  const result = await supabase
    .from('tasks')
    .select('*')
    .order('done', { ascending: true })
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });
  check(result);
  return result.data ?? [];
}

export async function createTask(input: NewTask) {
  check(await supabase.from('tasks').insert(input));
}

export async function setTaskDone(id: string, done: boolean) {
  check(await supabase.from('tasks').update({ done }).eq('id', id));
}

export async function deleteTask(id: string) {
  check(await supabase.from('tasks').delete().eq('id', id));
}
