/*
# Create bibliography lists

1. New Tables
- `bibliography_lists`: named groups for organizing citations (id, name, created_at).

2. Modified Tables
- `bibliography_entries`: adds `list_id`, an optional link to a list. Existing references stay unassigned (null).

3. Security
- Row Level Security enabled on `bibliography_lists`.
- Single-tenant app with no sign-in, so the data is intentionally shared. Policies allow anon and authenticated roles to read, create, update and delete lists.
- Grants are given to anon and authenticated only.

4. Important Notes
- Deleting a list does not delete its references; they become unassigned (`ON DELETE SET NULL`).
- No existing data is removed or changed.
*/

CREATE TABLE IF NOT EXISTS bibliography_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bibliography_lists ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON bibliography_lists TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_bibliography_lists" ON bibliography_lists;
CREATE POLICY "anon_select_bibliography_lists" ON bibliography_lists FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_bibliography_lists" ON bibliography_lists;
CREATE POLICY "anon_insert_bibliography_lists" ON bibliography_lists FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_bibliography_lists" ON bibliography_lists;
CREATE POLICY "anon_update_bibliography_lists" ON bibliography_lists FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_bibliography_lists" ON bibliography_lists;
CREATE POLICY "anon_delete_bibliography_lists" ON bibliography_lists FOR DELETE TO anon, authenticated USING (true);

ALTER TABLE bibliography_entries ADD COLUMN IF NOT EXISTS list_id uuid REFERENCES bibliography_lists(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS bibliography_entries_list_id_idx ON bibliography_entries (list_id);
