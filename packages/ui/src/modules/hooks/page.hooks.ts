import {
  useQuery,
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createPage,
  getAllPagesByUserId,
  getPageById,
  updatePageTitle,
} from "@/adapters/page.adapter.ts";
import { Page } from "shared/src/generated"; // Import Page from shared location

export const PAGE_QUERY_KEY_BASE = "pages";

interface CreatePageInput {
  userId: string;
  content: string;
  title: string;
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

export const useUpdatePageTitle = () => {
  const queryClient = useQueryClient();

  const optimisticallyUpdateTitle = (id: string, title: string) => {
    const previousPage = queryClient.getQueryData<Page>([
      PAGE_QUERY_KEY_BASE,
      "single",
      id,
    ]);

    // Optimistically update the single page cache
    if (previousPage) {
      queryClient.setQueryData([PAGE_QUERY_KEY_BASE, "single", id], {
        ...previousPage,
        title,
      });

      // Also update the page in the pages list if it exists
      // This ensures the sidebar shows the updated title immediately
      if (previousPage.userId) {
        const pagesCache = queryClient.getQueryData<Page[]>([
          PAGE_QUERY_KEY_BASE,
          previousPage.userId,
        ]);
        if (pagesCache) {
          queryClient.setQueryData(
            [PAGE_QUERY_KEY_BASE, previousPage.userId],
            pagesCache.map((page) =>
              page.id === id ? { ...page, title } : page
            )
          );
        }
      }
    }

    return { previousPage };
  };

  const persistTitleChange = async (id: string, title: string) => {
    try {
      // Cancel any outgoing refetches to avoid conflicts
      await queryClient.cancelQueries({
        queryKey: [PAGE_QUERY_KEY_BASE, "single", id],
      });

      // Call the actual mutation
      const data = await updatePageTitle(id, title);

      // On success
      if (data) {
        // We don't need to invalidate the queries here as we've already
        // optimistically updated the cache, but we can refetch in the background
        // without immediately displaying the refetch result
        queryClient.invalidateQueries({
          queryKey: [PAGE_QUERY_KEY_BASE, data.userId],
          refetchType: "inactive",
        });
      }

      return data;
    } catch (error) {
      console.error("Error updating page title:", error);

      throw error;
    }
  };

  return {
    optimisticallyUpdateTitle,
    persistTitleChange,
  };
};

// Get a single page by ID with suspense
export const usePage = (pageId: string) => {
  return useSuspenseQuery<Page | null, Error>({
    queryKey: [PAGE_QUERY_KEY_BASE, "single", pageId],
    queryFn: async () => {
      return await getPageById(pageId);
    },
  });
};
