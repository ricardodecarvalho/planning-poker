import { useEffect, useRef, useState } from 'react';
import { Check, Pencil, X } from 'lucide-react';
import { useTranslation } from 'react-i18n-lite';
import * as S from './PokerRoom.styles';

interface RoomTitleProps {
  name: string;
  canEdit: boolean;
  onSave: (name: string) => void;
}

const RoomTitle = ({ name, canEdit, onSave }: RoomTitleProps) => {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const startEdit = () => {
    setDraft(name);
    setEditing(true);
  };

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed !== name.trim()) onSave(trimmed);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(name);
    setEditing(false);
  };

  if (editing) {
    return (
      <S.TitleEditRow>
        <S.NameInput
          ref={inputRef}
          value={draft}
          maxLength={60}
          placeholder={t('rooms.roomNamePlaceholder')}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') cancel();
          }}
        />
        <S.TitleIconButton
          type="button"
          onClick={commit}
          title={t('rooms.save')}
          aria-label={t('rooms.save')}
          $tone="save"
        >
          <Check size={18} />
        </S.TitleIconButton>
        <S.TitleIconButton
          type="button"
          onClick={cancel}
          title={t('modal.cancel')}
          aria-label={t('modal.cancel')}
        >
          <X size={18} />
        </S.TitleIconButton>
      </S.TitleEditRow>
    );
  }

  return (
    <S.TitleRow>
      <h1>{name.trim() || t('rooms.untitledRoom')}</h1>
      {canEdit && (
        <S.TitleIconButton
          type="button"
          onClick={startEdit}
          title={t('rooms.rename')}
          aria-label={t('rooms.rename')}
        >
          <Pencil size={16} />
        </S.TitleIconButton>
      )}
    </S.TitleRow>
  );
};

export default RoomTitle;
