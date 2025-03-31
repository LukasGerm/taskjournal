import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChannel } from "../../../../adapters/channels.adapter";
import { CHANNELS_QUERY_KEY } from "./useChannels";

export const useDeleteChannel = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["deleteChannel"],
    mutationFn: deleteChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CHANNELS_QUERY_KEY] });
    },
  });

  return {
    deleteChannel: mutation.mutate,
    isPending: mutation.isPending,
  };
};
