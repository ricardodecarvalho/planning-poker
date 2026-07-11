import { ReactNode } from 'react';
import styled, { css } from 'styled-components';

type Tone = 'info' | 'success' | 'neutral' | 'warning';

const tones: Record<Tone, ReturnType<typeof css>> = {
  info: css`
    background: var(--info-bg);
    color: var(--info);
  `,
  success: css`
    background: var(--success-bg);
    color: var(--success);
  `,
  neutral: css`
    background: var(--surface-sunken);
    color: var(--text-secondary);
  `,
  warning: css`
    background: var(--warning-bg);
    color: var(--warning);
  `,
};

const StyledBadge = styled.span<{ $tone: Tone }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 20px;
  padding: 0 8px;
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.01em;
  white-space: nowrap;

  ${({ $tone }) => tones[$tone]}
`;

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
}

const Badge = ({ tone = 'neutral', children }: BadgeProps) => (
  <StyledBadge $tone={tone}>{children}</StyledBadge>
);

export default Badge;
