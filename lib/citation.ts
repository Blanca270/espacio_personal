import type { BibliographyRow } from '@/lib/types';

export function formatApaCitation(entry: Pick<BibliographyRow, 'authors' | 'year' | 'title' | 'source' | 'url' | 'doi'>) {
  const link = entry.doi ? `https://doi.org/${entry.doi}` : entry.url;
  const parts = [entry.authors, `(${entry.year || 's.f.'})`, entry.title, entry.source, link]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));
  return parts.map((part, index) => (index === parts.length - 1 || part.endsWith('.') ? part : `${part}.`)).join(' ');
}
