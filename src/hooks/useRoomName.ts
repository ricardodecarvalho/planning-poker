import { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18n-lite';
import { firestore } from '../firebase';

// Subscribes to the room's name in real time and exposes a rename action.
// Only the room owner is allowed to rename by the Firestore rules; the UI
// gates the control accordingly.
const useRoomName = (roomId: string | undefined) => {
  const [roomName, setRoomName] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(firestore, 'rooms', roomId);
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      const data = snapshot.data();
      setRoomName(typeof data?.name === 'string' ? data.name : '');
    });

    return () => unsubscribe();
  }, [roomId]);

  const renameRoom = async (name: string) => {
    if (!roomId) return;

    try {
      const roomRef = doc(firestore, 'rooms', roomId);
      await updateDoc(roomRef, { name: name.trim() });
    } catch (error) {
      console.error('Error renaming room: ', error);
      toast.error(t('rooms.errorRenaming'));
    }
  };

  return { roomName, renameRoom };
};

export default useRoomName;
