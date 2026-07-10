import styled from 'styled-components';
import { Participant } from '../hooks/useParticipants';

const initials = (displayName: string) =>
  displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((name) => name[0])
    .join('')
    .toUpperCase();

// Deterministic, brand-aligned background for the initials fallback.
const palette = [
  'var(--green-600)',
  'var(--coral-500)',
  'var(--blue-500)',
  'var(--amber-600)',
  'var(--green-700)',
  'var(--coral-600)',
  'var(--blue-600)',
  'var(--neutral-600)',
];

const colorFor = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return palette[hash % palette.length];
};

const statusColor = (state?: string) => {
  if (state === 'online') return 'var(--success)';
  if (state === 'away') return 'var(--warning)';
  return 'var(--neutral-400)';
};

const Root = styled.span<{ $size: number }>`
  position: relative;
  display: inline-flex;
  flex: none;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
`;

const Initials = styled.span<{ $size: number; $bg: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: ${({ $bg }) => $bg};
  color: #fff;
  font-family: var(--font-display);
  font-weight: var(--weight-bold);
  font-size: ${({ $size }) => Math.max(10, Math.round($size * 0.4))}px;
  letter-spacing: 0;
  line-height: 1;
  user-select: none;
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  border-radius: var(--radius-full);
  object-fit: cover;
`;

const StatusDot = styled.span<{ $size: number; $color: string }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: ${({ $size }) => Math.max(8, Math.round($size * 0.28))}px;
  height: ${({ $size }) => Math.max(8, Math.round($size * 0.28))}px;
  border-radius: var(--radius-full);
  background: ${({ $color }) => $color};
  border: 2px solid var(--surface-card);
`;

interface AvatarProps extends Partial<Participant> {
  size?: number;
  isShowState?: boolean;
}

const Avatar = ({
  photoURL,
  displayName,
  state,
  size = 32,
  isShowState = true,
}: AvatarProps) => {
  const name = displayName || '';

  return (
    <Root $size={size} title={name || undefined}>
      {photoURL ? (
        <Photo src={photoURL} alt={name} width={size} height={size} />
      ) : (
        <Initials $size={size} $bg={colorFor(name || '?')}>
          {name ? initials(name) : '?'}
        </Initials>
      )}
      {isShowState && (
        <StatusDot $size={size} $color={statusColor(state)}>
          <span className="visually-hidden">{state}</span>
        </StatusDot>
      )}
    </Root>
  );
};

export default Avatar;
