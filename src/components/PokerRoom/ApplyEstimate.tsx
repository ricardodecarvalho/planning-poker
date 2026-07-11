import { useTranslation } from 'react-i18n-lite';
import { Check } from 'lucide-react';

import Button from '../ui/Button';

interface ApplyEstimateProps {
  points: number;
  onApply: () => void;
}

/**
 * Owner action shown in the toolbar (next to History) after the votes are
 * revealed for the active backlog item. Applies the suggested estimate
 * (nearest card to the average): saves the round to history, marks the item
 * estimated, clears the votes and advances to the next un-estimated item.
 */
const ApplyEstimate = ({ points, onApply }: ApplyEstimateProps) => {
  const { t } = useTranslation();

  return (
    <Button variant="primary" iconLeft={<Check size={17} />} onClick={onApply}>
      {t('pokerRoom.applyEstimate').replace('{points}', String(points))}
    </Button>
  );
};

export default ApplyEstimate;
