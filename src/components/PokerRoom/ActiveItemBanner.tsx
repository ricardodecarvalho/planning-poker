import styled from 'styled-components';
import { useTranslation } from 'react-i18n-lite';
import { FileText, PartyPopper } from 'lucide-react';

import Badge from '../ui/Badge';
import { Item } from '../../hooks/useItems';

const Card = styled.div<{ $mobile?: boolean }>`
  width: 100%;
  max-width: ${({ $mobile }) => ($mobile ? 'none' : '1040px')};
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  padding: ${({ $mobile }) => ($mobile ? '13px 15px' : '15px 18px')};
  display: flex;
  align-items: center;
  gap: ${({ $mobile }) => ($mobile ? '12px' : '14px')};
`;

const IconTile = styled.span<{ $mobile?: boolean }>`
  flex: none;
  width: ${({ $mobile }) => ($mobile ? '36px' : '40px')};
  height: ${({ $mobile }) => ($mobile ? '36px' : '40px')};
  border-radius: var(--radius-md);
  background: var(--surface-sunken);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
`;

const Middle = styled.div`
  flex: 1;
  min-width: 0;

  .head {
    display: flex;
    align-items: center;
    gap: 9px;
  }
  .key {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
  }
  .summary {
    margin-top: 3px;
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 16px;
    letter-spacing: -0.01em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Eyebrow = styled.span`
  flex: none;
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Done = styled.div<{ $mobile?: boolean }>`
  width: 100%;
  max-width: ${({ $mobile }) => ($mobile ? 'none' : '1040px')};
  background: var(--success-bg);
  border: 1px solid var(--success-border);
  border-radius: var(--radius-lg);
  padding: ${({ $mobile }) => ($mobile ? '13px 15px' : '14px 18px')};
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--success);
  font-size: ${({ $mobile }) => ($mobile ? '13.5px' : '14px')};
  font-weight: 600;
`;

interface ActiveItemBannerProps {
  item?: Item;
  allEstimated: boolean;
  mobile?: boolean;
}

/**
 * Shows the backlog item currently being estimated ("Estimando"), or a success
 * banner once the whole backlog is estimated. Renders nothing when there is no
 * active item and the backlog isn't finished — so rooms without a backlog are
 * visually unchanged.
 */
const ActiveItemBanner = ({
  item,
  allEstimated,
  mobile,
}: ActiveItemBannerProps) => {
  const { t } = useTranslation();

  if (item) {
    return (
      <Card $mobile={mobile}>
        <IconTile $mobile={mobile}>
          <FileText size={mobile ? 18 : 20} />
        </IconTile>
        <Middle>
          <div className="head">
            {item.key && <span className="key">{item.key}</span>}
            {item.type && <Badge tone="info">{item.type}</Badge>}
          </div>
          <div className="summary">{item.summary}</div>
        </Middle>
        {!mobile && <Eyebrow>{t('pokerRoom.estimating')}</Eyebrow>}
      </Card>
    );
  }

  if (allEstimated) {
    return (
      <Done $mobile={mobile}>
        <PartyPopper size={mobile ? 17 : 18} color="var(--success)" />
        <span>{t('pokerRoom.backlogDone')}</span>
      </Done>
    );
  }

  return null;
};

export default ActiveItemBanner;
