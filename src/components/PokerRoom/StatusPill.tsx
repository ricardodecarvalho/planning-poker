import styled, { css } from 'styled-components';

type Category = 'new' | 'indeterminate' | 'done' | string | null | undefined;

const tones: Record<
  'new' | 'indeterminate' | 'done',
  ReturnType<typeof css>
> = {
  new: css`
    background: var(--surface-sunken);
    color: var(--text-secondary);
    border-color: var(--border-subtle);
  `,
  indeterminate: css`
    background: var(--info-bg);
    color: var(--info);
    border-color: var(--info-border);
  `,
  done: css`
    background: var(--success-bg);
    color: var(--success);
    border-color: var(--success-border);
  `,
};

const Pill = styled.span<{ $category: 'new' | 'indeterminate' | 'done' }>`
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 7px;
  border-radius: var(--radius-full);
  border: 1px solid transparent;
  font-size: 10.5px;
  font-weight: 700;
  font-family: var(--font-body);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
  ${({ $category }) => tones[$category]}
`;

interface StatusPillProps {
  status?: string | null;
  category?: Category;
}

const StatusPill = ({ status, category }: StatusPillProps) => {
  if (!status) return null;
  const cat =
    category === 'indeterminate' || category === 'done' ? category : 'new';
  return <Pill $category={cat}>{status}</Pill>;
};

export default StatusPill;
