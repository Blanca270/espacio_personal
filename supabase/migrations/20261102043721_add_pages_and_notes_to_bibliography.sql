/*
# Add page and personal note fields to bibliography entries

1. Modified Tables
- `bibliography_entries`: adds `pages` (text, page number or range such as "45-52") and `personal_notes` (text, free-form notes about the source). Both default to an empty string.

2. Security
- No changes to Row Level Security or grants; the existing table-level grants already cover new columns.

3. Important Notes
- Existing rows are kept unchanged and receive empty values for the new fields.
*/

ALTER TABLE bibliography_entries ADD COLUMN IF NOT EXISTS pages text NOT NULL DEFAULT '';
ALTER TABLE bibliography_entries ADD COLUMN IF NOT EXISTS personal_notes text NOT NULL DEFAULT '';
