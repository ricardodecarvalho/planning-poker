import { httpsCallable } from "firebase/functions";
import { useCallback, useState } from "react";
import { functions } from "../firebase";

type Vote = { name: string; value: string };

const useChatAssistant = () => {
  const [loading, setLoading] = useState(false);

  const sendToChatAssistant = useCallback(async (votes: Vote[]) => {
    setLoading(true);

    const callable = httpsCallable<Vote[], string>(
      functions,
      "chatAssistant"
    );

    const result = await callable(votes);
    
    setLoading(false);
    return result.data
  }, []);

  return { sendToChatAssistant, loading };
};

export default useChatAssistant;
