import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPage, getAllPagesByUserId } from "@/adapters/page.adapter.ts";
import { Page } from "shared/src/generated"; // Import Page from shared location

export const PAGE_QUERY_KEY_BASE = "pages";

interface CreatePageInput {
  userId: string;
  content: string;
}

// Custom hook to fetch pages for a user
export const usePages = (userId: string) => {
  return useQuery<Page[], Error>({
    queryKey: [PAGE_QUERY_KEY_BASE, userId],
    queryFn: () => getAllPagesByUserId(userId),
  });
};

export const useCreatePage = () => {
  const queryClient = useQueryClient();

  return useMutation<Page, Error, CreatePageInput>({
    mutationFn: (newPage: CreatePageInput) =>
      createPage({ ...newPage, createdAt: new Date(), updatedAt: new Date() }),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [PAGE_QUERY_KEY_BASE, data.userId],
      });
    },
    onError: (error) => {
      console.error("Error creating page:", error);
    },
  });
};
