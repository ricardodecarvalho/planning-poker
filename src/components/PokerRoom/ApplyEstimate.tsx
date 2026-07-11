import { useTranslation } from 'react-i18n-lite';
import { Check } from 'lucide-react';

import Button from '../ui/Button';

interface ApplyEstimateProps {
  points: number;
  onApply: () => void;
  block?: boolean;
}

/**
 * Owner action shown after the votes are revealed for the active backlog item.
 * Applies the suggested estimate (nearest card to the average), which saves the
 * round to history, marks the item estimated, clears the votes and advances to
 * the next un-estimated item.
 */
const ApplyEstimate = ({ points, onApply, block }: ApplyEstimateProps) => {
  const { t } = useTranslation();

  return (
    <Button
      variant="primary"
      size="lg"
      block={block}
      iconLeft={<Check size={18} />}
      onClick={onApply}
    >
      {t('pokerRoom.applyEstimate').replace('{points}', String(points))}
    </Button>
  );
};

export default ApplyEstimate;
