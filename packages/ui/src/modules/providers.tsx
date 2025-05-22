import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@/modules/providers/user-provider.tsx";
import React from "react";

// Create a single QueryClient instance to be used by the QueryClientProvider
const queryClient = new QueryClient();

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>{children}</UserProvider>
    </QueryClientProvider>
  );
};
