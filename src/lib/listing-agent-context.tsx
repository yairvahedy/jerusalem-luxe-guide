import { createContext, useContext, useState, type ReactNode } from "react";
import type { Agent } from "@/lib/database.types";

type ListingAgentCtx = {
  listingAgent: Agent | null;
  setListingAgent: (agent: Agent | null) => void;
};

const ListingAgentContext = createContext<ListingAgentCtx>({
  listingAgent: null,
  setListingAgent: () => {},
});

export function ListingAgentProvider({ children }: { children: ReactNode }) {
  const [listingAgent, setListingAgent] = useState<Agent | null>(null);
  return (
    <ListingAgentContext.Provider value={{ listingAgent, setListingAgent }}>
      {children}
    </ListingAgentContext.Provider>
  );
}

export function useListingAgent() {
  return useContext(ListingAgentContext);
}
