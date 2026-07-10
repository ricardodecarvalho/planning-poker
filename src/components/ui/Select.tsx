import { SelectHTMLAttributes } from 'react';
import styled from 'styled-components';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  size?: 'sm' | 'md';
  block?: boolean;
}

const Wrapper = styled.div<{ $block?: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: ${({ $block }) => ($block ? '100%' : 'auto')};

  svg {
    position: absolute;
    right: 10px;
    pointer-events: none;
    color: var(--text-muted);
  }
`;

const StyledSelect = styled.select<{ $size: 'sm' | 'md' }>`
  appearance: none;
  width: 100%;
  height: ${({ $size }) =>
    $size === 'sm' ? 'var(--control-sm)' : 'var(--control-md)'};
  padding: 0 32px 0 var(--space-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-card);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  cursor: pointer;
  transition: var(--transition-colors);

  &:hover {
    border-color: var(--border-strong);
  }
  &:focus-visible {
    outline: none;
    border-color: var(--border-focus);
    box-shadow: var(--shadow-focus);
  }
`;

const Select = ({
  options,
  size = 'md',
  block,
  ...rest
}: SelectProps) => {
  return (
    <Wrapper $block={block}>
      <StyledSelect $size={size} {...rest}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </StyledSelect>
      <ChevronDown size={16} aria-hidden />
    </Wrapper>
  );
};

export default Select;
