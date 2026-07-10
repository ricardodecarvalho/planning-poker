import styled from 'styled-components';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  ariaLabel?: string;
}

const Track = styled.button<{ $checked: boolean }>`
  position: relative;
  flex: none;
  width: 46px;
  height: 26px;
  padding: 0;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  background: ${({ $checked }) =>
    $checked ? 'var(--brand-primary)' : 'var(--border-strong)'};
  transition: background-color var(--duration-base) var(--ease-standard);

  &:focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
  }
`;

const Thumb = styled.span<{ $checked: boolean }>`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  background: #fff;
  box-shadow: var(--shadow-sm);
  transform: translateX(${({ $checked }) => ($checked ? '20px' : '0')});
  transition: transform var(--duration-base) var(--ease-out);
`;

const Switch = ({ checked, onChange, id, ariaLabel }: SwitchProps) => {
  return (
    <Track
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      $checked={checked}
      onClick={() => onChange(!checked)}
    >
      <Thumb $checked={checked} />
    </Track>
  );
};

export default Switch;
