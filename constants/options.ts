export const DOCUMENT_CATEGORIES = ['Personal', 'Trabajo', 'Estudios', 'Trámites', 'Otro'] as const;
export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

export const NOTE_TYPE = 'Nota de investigación';
export const REFERENCE_TYPES = [NOTE_TYPE, 'Libro', 'Artículo académico', 'Archivo', 'Fotografía', 'Otro'] as const;
export type ReferenceType = (typeof REFERENCE_TYPES)[number];

export const TASK_PRIORITIES = ['Normal', 'Alta', 'Baja'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const BIBLIOGRAPHY_KINDS = ['Libro', 'Artículo', 'Sitio web', 'Tesis', 'Otro'] as const;
export type BibliographyKind = (typeof BIBLIOGRAPHY_KINDS)[number];
