import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { randomColorScheme } from '../util';
import { Participant } from './useParticipants';
import useUserContext from '../context/useUserContext';
import { useTranslation } from 'react-i18n-lite';

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuthStateChanged, setLoadingAuthStateChanged] = useState(true);
  const [loadingLoginWithGoogle, setLoadingLoginWithGoogle] = useState(false);

  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  const { setUserContext } = useUserContext();

  useEffect(() => {
    setLoadingAuthStateChanged(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuthStateChanged(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    setLoadingLoginWithGoogle(true);

    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        const userDocRef = doc(firestore, 'users', user.uid);

        const userData: Participant = {
          displayName: user.displayName,
          email: user.email,
          uid: user.uid,
          createdAt: new Date().toISOString(),
          photoURL: user?.photoURL,
          colorScheme: randomColorScheme(),
          state: 'online',
        };

        setUserContext(userData);

        await setDoc(userDocRef, userData);

        toast.success(t('login.success'));

        navigate(location.state?.redirect || '/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);

        const email = error?.customData?.email;
        console.log(email);

        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(credential);

        toast.error(t('login.error'));
      })
      .finally(() => {
        setLoadingLoginWithGoogle(false);
      });
  };

  const getDisplayName = () => {
    if (auth.currentUser?.displayName) {
      return auth.currentUser.displayName.split(' ')[0];
    }
    return auth.currentUser?.email?.split('@')[0];
  };

  return {
    user,
    loadingAuthStateChanged,
    loadingLoginWithGoogle,
    loginWithGoogle,
    getDisplayName,
  };
};

export default useAuth;
