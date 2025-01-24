import { Participant } from "./hooks/useParticipants";
import { Vote } from "./hooks/useVotes";

export const getUniqueDisplayNames = (users: Participant[]) => {
  const nameOccurrences: Record<string, number> = {};
  const uniqueNames = new Set<string>();

  return users.map((user) => {
    let baseName;

    // Verifica se displayName existe e tenta extrair nome e inicial do sobrenome
    if (user.displayName) {
      const nameParts = user.displayName.split(" ");
      baseName = nameParts[0];

      // Adiciona a inicial do sobrenome se houver mais de uma parte no nome
      if (nameParts.length > 1) {
        baseName += ` ${nameParts[1][0]}.`;
      }
    } else {
      // Se não houver displayName, usa a parte antes do "@" no email ou "User" como fallback
      baseName = user.email?.split("@")[0] || "User";
    }

    // Se o nome gerado já foi usado, incrementa o contador e anexa um número ao final
    let uniqueName = baseName;
    if (uniqueNames.has(uniqueName)) {
      // Conta as ocorrências para definir o índice correto
      nameOccurrences[baseName] = (nameOccurrences[baseName] || 1) + 1;
      uniqueName = `${baseName} ${nameOccurrences[baseName]}`;
    } else {
      // Marca o nome como usado para evitar duplicações
      uniqueNames.add(uniqueName);
      nameOccurrences[baseName] = 1;
    }

    return { ...user, displayName: uniqueName };
  });
};

export interface UserColorScheme {
  bg: string;
  text: string;
}

const colors = [
  { bg: "bg-primary", text: "text-light" },
  { bg: "bg-secondary", text: "text-light" },
  { bg: "bg-success", text: "text-light" },
  { bg: "bg-danger", text: "text-light" },
  { bg: "bg-warning", text: "text-dark" },
  { bg: "bg-info", text: "text-dark" },
  { bg: "bg-light", text: "text-dark" },
  { bg: "bg-dark", text: "text-light" },
];

export const randomColorScheme = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

type VotesGrouped = Record<string | number, Participant[]>;

export interface VotingStatus {
  hasVoted: Array<Participant & { vote: Vote }>;
  hasNotVoted: Participant[];
  average: number;
  votesGrouped: VotesGrouped;
}

export const getVotingStatus = (
  users: Participant[],
  votes: Vote[]
): VotingStatus => {
  const voteMap = new Map<string, Vote>(
    votes.map((vote) => [vote.userId, vote])
  );

  const hasVoted: Array<Participant & { vote: Vote }> = [];
  const hasNotVoted: Participant[] = [];

  users.forEach((user) => {
    const vote = voteMap.get(user.uid);
    if (vote) {
      hasVoted.push({ ...user, vote });
    } else {
      hasNotVoted.push(user);
    }
  });

  const validVotes = hasVoted.filter(
    (user) => typeof user.vote.voteValue === "number"
  );

  const totalVotes: number = validVotes.reduce(
    (acc, user) => acc + (user.vote.voteValue || 0),
    0
  );

  const average = validVotes.length ? totalVotes / validVotes.length : 0;

  const votesGrouped = validVotes.reduce<VotesGrouped>((acc, user) => {
    const voteValue = user.vote.voteValue;
    if (!acc[voteValue]) {
      acc[voteValue] = [];
    }

    acc[voteValue].push(user);
    return acc;
  }, {});

  return { hasVoted, hasNotVoted, average, votesGrouped };
};
