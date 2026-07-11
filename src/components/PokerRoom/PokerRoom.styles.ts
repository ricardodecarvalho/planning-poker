import styled from 'styled-components';

export const Content = styled.div`
  max-width: 1560px;
  margin: 0 auto;
  padding: 32px clamp(16px, 4vw, 32px) 96px;
`;

/* ---------- toolbar ---------- */
export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 20px;

  h1 {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(20px, 2.4vw, 26px);
    letter-spacing: -0.02em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  h1 {
    min-width: 0;
  }
`;

export const TitleEditRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const NameInput = styled.input`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(20px, 2.4vw, 26px);
  letter-spacing: -0.02em;
  color: var(--text-primary);
  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 4px 10px;
  min-width: 0;
  width: min(420px, 60vw);

  &:focus-visible {
    outline: none;
    border-color: var(--border-focus);
    box-shadow: var(--shadow-focus);
  }
`;

export const TitleIconButton = styled.button<{ $tone?: 'save' }>`
  flex: none;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-colors);

  &:hover {
    background: var(--fill-hover);
    color: ${({ $tone }) =>
      $tone === 'save' ? 'var(--success)' : 'var(--text-primary)'};
  }
  &:focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
  }
`;

export const CopyButton = styled.button`
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 13.5px;
  font-family: var(--font-mono);
  transition: var(--transition-colors);

  &:hover {
    color: var(--brand-primary);
  }
`;

export const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const HistoryButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: var(--control-md);
  padding: 0 15px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--surface-card);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-weight: var(--weight-semibold);
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition-colors);

  &:hover {
    background: var(--fill-hover);
  }
  &:focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
  }

  .count {
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: var(--radius-full);
    background: var(--surface-sunken);
    border: 1px solid var(--border-subtle);
    color: var(--text-secondary);
    font-size: 11.5px;
    font-weight: 700;
    font-family: var(--font-mono);
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

/* ---------- desktop layout ---------- */
export const DesktopSplit = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
`;

export const TableStage = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 34px;
`;

export const TableWrap = styled.div`
  width: 100%;
  max-width: 1040px;
  padding: 26px;
  background: var(--surface-sunken);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-2xl);
`;

export const Felt = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 8.4;
  border-radius: 280px;
  background: radial-gradient(
    ellipse at 50% 42%,
    var(--green-600) 0%,
    var(--green-800) 62%,
    var(--green-900) 100%
  );
  box-shadow:
    inset 0 0 0 10px rgba(0, 0, 0, 0.18),
    inset 0 0 70px rgba(0, 0, 0, 0.34),
    var(--shadow-lg);
  border: 3px solid rgba(0, 0, 0, 0.25);
`;

export const CenterPot = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

export const PotRevealed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 158px;
  height: 158px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.28);
  border: 3px solid rgba(255, 255, 255, 0.28);
  justify-content: center;
  animation: ppFade var(--duration-slow) var(--ease-out);

  .label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.7);
  }
  .value {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 44px;
    line-height: 1;
    color: #fff;
  }
  .sub {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.72);
  }
`;

export const PotHidden = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 158px;
  height: 158px;
  border-radius: 50%;
  border: 2px dashed rgba(255, 255, 255, 0.34);
  justify-content: center;
  text-align: center;
  padding: 0 12px;

  .value {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 30px;
    line-height: 1;
    color: #fff;
  }
  .sub {
    font-size: 12.5px;
    color: rgba(255, 255, 255, 0.78);
    line-height: 1.3;
  }
`;

export const SeatName = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
`;

/* ---------- distribution (desktop) ---------- */
export const Distribution = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
  animation: ppFade var(--duration-slow) var(--ease-out);

  .caption {
    font-size: 13px;
    color: var(--text-muted);
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
`;

export const DistChip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  padding: 5px 6px 5px 14px;
  box-shadow: var(--shadow-xs);

  .value {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 16px;
    color: var(--text-primary);
  }
  .count {
    min-width: 24px;
    height: 24px;
    padding: 0 7px;
    border-radius: var(--radius-full);
    background: var(--brand-primary);
    color: var(--brand-on-primary);
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

/* ---------- hand (desktop) ---------- */
export const HandSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const Eyebrow = styled.span`
  font-size: 12px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

export const Hand = styled.div`
  display: flex;
  gap: 12px;
  padding: 24px 8px 12px;
  overflow-x: auto;
  max-width: 100%;
  align-items: flex-end;
`;

export const HandCard = styled.button<{ $selected: boolean }>`
  flex: none;
  width: 64px;
  height: 92px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 26px;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  background: var(--surface-card);
  transition:
    transform var(--duration-base) var(--ease-out),
    border-color var(--duration-fast),
    box-shadow var(--duration-fast);

  ${({ $selected }) =>
    $selected
      ? `border:2px solid var(--brand-primary); color:var(--brand-primary);
         transform:translateY(-18px);
         box-shadow:0 14px 26px rgba(0,0,0,.22), var(--shadow-focus);`
      : `border:1px solid var(--border); color:var(--text-primary);
         box-shadow:var(--shadow-sm);`}

  &:disabled {
    opacity: 0.5;
    cursor: default;
    transform: none;
  }
  &:not(:disabled):hover {
    transform: translateY(-8px);
  }

  .corner {
    position: absolute;
    font-size: 11px;
    font-weight: 700;
  }
  .corner.tl {
    top: 6px;
    left: 8px;
  }
  .corner.br {
    bottom: 6px;
    right: 8px;
    transform: rotate(180deg);
  }
`;

/* ---------- mobile ---------- */
export const MobileWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-bottom: 20px;
`;

export const StripHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  .count {
    font-size: 12.5px;
    color: var(--text-secondary);
    font-weight: 600;
  }
`;

export const Strip = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
`;

export const StripCard = styled.div`
  flex: none;
  width: 74px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 12px 6px 10px;

  .name {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
`;

export const StatusCard = styled.div`
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  animation: ppFade var(--duration-base) var(--ease-out);

  .avg-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .avg-value {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 46px;
    line-height: 1;
    color: var(--brand-primary);
  }
  .avg-sub {
    font-size: 12.5px;
    color: var(--text-secondary);
  }
  .hr {
    width: 100%;
    height: 1px;
    background: var(--border-subtle);
  }
  .bars {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

export const StatusWaiting = styled.div`
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;

  .value {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 30px;
    color: var(--text-primary);
  }
  .sub {
    font-size: 13.5px;
    color: var(--text-secondary);
  }
`;

export const DistRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .value {
    width: 40px;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 17px;
    flex: none;
    color: var(--text-primary);
  }
  .track {
    flex: 1;
    height: 8px;
    border-radius: 999px;
    background: var(--surface-sunken);
    overflow: hidden;
  }
  .fill {
    height: 100%;
    background: var(--brand-primary);
    border-radius: 999px;
  }
  .count {
    width: 24px;
    text-align: right;
    font-size: 13px;
    color: var(--text-secondary);
    font-family: var(--font-mono);
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
`;

export const MobileCard = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 3 / 4;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 22px;
  position: relative;
  transition:
    transform var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast),
    box-shadow var(--duration-fast);

  ${({ $selected }) =>
    $selected
      ? `background:var(--brand-primary); border:2px solid var(--brand-primary);
         color:var(--brand-on-primary); box-shadow:var(--shadow-md);`
      : `background:var(--surface-card); border:1px solid var(--border);
         color:var(--text-primary);`}

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
