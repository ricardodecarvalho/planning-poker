import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from "firebase/auth";
import { auth, firestore } from "../firebase";
import { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        const userDocRef = doc(firestore, "users", user.uid);

        const userData = {
          displayName: user?.displayName,
          email: user?.email,
          uid: user?.uid,
          createdAt: new Date().toISOString(),
        };

        await setDoc(userDocRef, userData);
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
      });
  };

  const getDisplayName = () => {
    if (auth.currentUser?.displayName) {
      return auth.currentUser.displayName.split(" ")[0];
    }
    return auth.currentUser?.email?.split("@")[0];
  };

  return {
    user,
    loading,
    loginWithGoogle,
    getDisplayName,
  };
};

export default useAuth;
