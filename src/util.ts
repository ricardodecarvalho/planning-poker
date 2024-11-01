import { User } from "firebase/auth";

export const getUniqueDisplayNames = (users: User[]) => {
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