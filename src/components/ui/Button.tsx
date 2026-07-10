import { ButtonHTMLAttributes, ReactNode } from 'react';
import styled, { css } from 'styled-components';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  block?: boolean;
}

const sizes: Record<Size, ReturnType<typeof css>> = {
  sm: css`
    height: var(--control-sm);
    padding: 0 var(--space-3);
    font-size: var(--text-sm);
  `,
  md: css`
    height: var(--control-md);
    padding: 0 var(--space-4);
    font-size: var(--text-sm);
  `,
  lg: css`
    height: var(--control-lg);
    padding: 0 var(--space-5);
    font-size: var(--text-base);
  `,
};

const variants: Record<Variant, ReturnType<typeof css>> = {
  primary: css`
    background: var(--brand-primary);
    color: var(--brand-on-primary);
    border-color: var(--brand-primary);
    &:hover:not(:disabled) {
      background: var(--brand-primary-hover);
      border-color: var(--brand-primary-hover);
    }
    &:active:not(:disabled) {
      background: var(--brand-primary-active);
    }
  `,
  secondary: css`
    background: var(--surface-card);
    color: var(--text-primary);
    border-color: var(--border);
    box-shadow: var(--shadow-xs);
    &:hover:not(:disabled) {
      border-color: var(--border-strong);
      background: var(--fill-hover);
    }
  `,
  ghost: css`
    background: transparent;
    color: var(--text-secondary);
    border-color: transparent;
    &:hover:not(:disabled) {
      background: var(--fill-hover);
      color: var(--text-primary);
    }
  `,
  danger: css`
    background: var(--danger);
    color: #fff;
    border-color: var(--danger);
    &:hover:not(:disabled) {
      filter: brightness(0.94);
    }
  `,
};

const StyledButton = styled.button<{
  $variant: Variant;
  $size: Size;
  $block?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: ${({ $block }) => ($block ? '100%' : 'auto')};
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-weight: var(--weight-semibold);
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition:
    var(--transition-colors),
    box-shadow var(--duration-fast) var(--ease-standard),
    transform var(--duration-fast) var(--ease-standard),
    filter var(--duration-fast) var(--ease-standard);

  ${({ $size }) => sizes[$size]}
  ${({ $variant }) => variants[$variant]}

  &:active:not(:disabled) {
    transform: translateY(0.5px);
  }
  &:focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    flex: none;
  }
`;

const Button = ({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  block,
  children,
  ...rest
}: ButtonProps) => {
  return (
    <StyledButton $variant={variant} $size={size} $block={block} {...rest}>
      {iconLeft}
      {children}
      {iconRight}
    </StyledButton>
  );
};

export default Button;
