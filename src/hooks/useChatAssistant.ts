import { httpsCallable } from "firebase/functions";
import { useCallback, useState } from "react";
import { functions } from "../firebase";

type Language = "pt-BR" | "en-US";

export type Vote = {
  name: string;
  value: string;
};

const useChatAssistant = () => {
  const [loading, setLoading] = useState(false);

  const sendToChatAssistant = useCallback(async (votes: Vote[]) => {
    if (votes.length === 0) {
      console.warn("No votes provided to chat assistant");
      return "";
    }

    setLoading(true);

    const callable = httpsCallable<
      { votes: Vote[]; language: Language },
      string
    >(functions, "chatAssistant");

    const result = await callable({ votes, language: "en-US" });

    setLoading(false);
    return result.data;
  }, []);

  return { sendToChatAssistant, loading };
};

export default useChatAssistant;
