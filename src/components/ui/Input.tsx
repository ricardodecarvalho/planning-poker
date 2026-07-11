import { ReactNode } from 'react';
import styled from 'styled-components';

const Wrapper = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;

  .label {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--text-secondary);
  }
  .hint {
    font-size: 11.5px;
    color: var(--text-muted);
    line-height: 1.4;
  }
`;

const Field = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .icon {
    position: absolute;
    left: 12px;
    display: flex;
    color: var(--text-muted);
    pointer-events: none;
  }

  input {
    width: 100%;
    height: 42px;
    padding: 0 12px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--surface-base);
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 14px;
  }
  input.with-icon {
    padding-left: 38px;
  }
  input::placeholder {
    color: var(--text-muted);
  }
  input:focus-visible {
    outline: none;
    border-color: var(--border-focus);
    box-shadow: var(--shadow-focus);
  }
`;

interface InputProps {
  label?: string;
  iconLeft?: ReactNode;
  hint?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}

const Input = ({
  label,
  iconLeft,
  hint,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
}: InputProps) => (
  <Wrapper>
    {label && <span className="label">{label}</span>}
    <Field>
      {iconLeft && <span className="icon">{iconLeft}</span>}
      <input
        className={iconLeft ? 'with-icon' : undefined}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </Field>
    {hint && <span className="hint">{hint}</span>}
  </Wrapper>
);

export default Input;
