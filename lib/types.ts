export type DocumentRow = {
  id: string;
  title: string;
  category: string;
  url: string | null;
  notes: string;
  created_at: string;
};

export type ReferenceRow = {
  id: string;
  title: string;
  type: string;
  author: string;
  body: string;
  created_at: string;
};

export type BibliographyRow = {
  id: string;
  kind: string;
  title: string;
  authors: string;
  year: string;
  source: string;
  url: string | null;
  doi: string | null;
  created_at: string;
};

export type TaskRow = {
  id: string;
  title: string;
  due_date: string | null;
  priority: string;
  done: boolean;
  created_at: string;
};
