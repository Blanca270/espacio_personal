import { supabase } from '@/lib/supabase';
import type { BibliographyListRow, BibliographyRow, DocumentRow, ReferenceRow, TaskRow } from '@/lib/types';

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

export type NewBibliography = Pick<
  BibliographyRow,
  'kind' | 'title' | 'authors' | 'year' | 'source' | 'url' | 'doi' | 'pages' | 'personal_notes' | 'list_id'
>;

export async function listBibliography(): Promise<BibliographyRow[]> {
  const result = await supabase.from('bibliography_entries').select('*').order('created_at', { ascending: false });
  check(result);
  return result.data ?? [];
}

export async function createBibliography(input: NewBibliography) {
  check(await supabase.from('bibliography_entries').insert(input));
}

export async function deleteBibliography(id: string) {
  check(await supabase.from('bibliography_entries').delete().eq('id', id));
}

export async function setBibliographyList(id: string, listId: string | null) {
  check(await supabase.from('bibliography_entries').update({ list_id: listId }).eq('id', id));
}

export async function listBibliographyLists(): Promise<BibliographyListRow[]> {
  const result = await supabase.from('bibliography_lists').select('*').order('name', { ascending: true });
  check(result);
  return result.data ?? [];
}

export async function createBibliographyList(name: string) {
  check(await supabase.from('bibliography_lists').insert({ name }));
}

export async function deleteBibliographyList(id: string) {
  check(await supabase.from('bibliography_lists').delete().eq('id', id));
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
