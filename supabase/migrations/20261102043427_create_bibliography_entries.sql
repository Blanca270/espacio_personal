/*
# Create bibliography entries table

1. New Tables
- `bibliography_entries`: bibliographic references (kind, title, authors, year, source, url, doi, created_at)

2. Security
- Row Level Security enabled.
- Single-tenant app with no sign-in, so the data is intentionally shared. Policies allow anon and authenticated roles to read, create, update and delete rows.
- Grants are given to anon and authenticated only.

3. Important Notes
- No existing tables or data are modified.
*/

CREATE TABLE IF NOT EXISTS bibliography_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'Libro',
  title text NOT NULL,
  authors text NOT NULL DEFAULT '',
  year text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT '',
  url text,
  doi text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bibliography_entries ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON bibliography_entries TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_bibliography_entries" ON bibliography_entries;
CREATE POLICY "anon_select_bibliography_entries" ON bibliography_entries FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_bibliography_entries" ON bibliography_entries;
CREATE POLICY "anon_insert_bibliography_entries" ON bibliography_entries FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_bibliography_entries" ON bibliography_entries;
CREATE POLICY "anon_update_bibliography_entries" ON bibliography_entries FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_bibliography_entries" ON bibliography_entries;
CREATE POLICY "anon_delete_bibliography_entries" ON bibliography_entries FOR DELETE TO anon, authenticated USING (true);
