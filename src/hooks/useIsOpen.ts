import { useCallback, useState } from 'react';

export default function useIsOpen(initialIsOpen = false) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  const open = useCallback(() => setIsOpen(true), [setIsOpen]);
  const close = useCallback(() => setIsOpen(false), [setIsOpen]);

  return { isOpen, open, close };
}
