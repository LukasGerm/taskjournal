import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChannel } from "../../../../adapters/channels.adapter";
import { CHANNELS_QUERY_KEY } from "./useChannels";

export const useCreateChannel = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["createChannel"],
    mutationFn: createChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CHANNELS_QUERY_KEY] });
    },
  });

  return {
    isPending: mutation.isPending,
    createChannel: mutation.mutate,
  };
};
