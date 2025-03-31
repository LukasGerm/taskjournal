import { useQuery } from "@tanstack/react-query";
import { getChannels } from "../../../../adapters/channels.adapter";
import { ChannelType } from "shared/src/types/channels.types.ts";

interface Channels {
  isLoading: boolean;
  data: ChannelType[] | undefined;
}

export const CHANNELS_QUERY_KEY = "channels";

export const useChannels = (): Channels => {
  const query = useQuery({
    queryKey: [CHANNELS_QUERY_KEY],
    queryFn: async () => {
      return getChannels();
    },
  });

  return {
    isLoading: query.isLoading,
    data: query.data,
  };
};
