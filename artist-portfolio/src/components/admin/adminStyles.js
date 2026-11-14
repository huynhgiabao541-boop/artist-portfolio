export const DEFAULT_CATEGORIES = [
  { key: 'water-ink', label: 'TRANH MÀU NƯỚC & MỰC' },
  { key: 'concept', label: 'MINH HỌA Ý NIỆM' },
  { key: 'exhibition', label: 'TRIỂN LÃM 2021-2025' },
];

export const inputStyle = {
  width: '100%',
  padding: '0.85rem 1rem',
  background: '#ffffff',
  border: '1px solid var(--outline-hairline, #eae5db)',
  color: '#1b1c1a',
  fontFamily: 'var(--font-body, Georgia, serif)',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
};

export const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-label, sans-serif)',
  fontSize: '11px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--on-surface-variant, #555758)',
  marginBottom: '0.45rem',
  fontWeight: '600',
};

const CATEGORY_LABELS = {
  'water-ink': 'Màu nước & Mực',
  concept: 'Minh họa ý niệm',
  exhibition: 'Triển lãm',
};

export const slugifyCategoryKey = (label) =>
  label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const formatCategoryLabel = (category) =>
  CATEGORY_LABELS[category] || (category || '').toUpperCase();

