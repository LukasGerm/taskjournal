import { createFileRoute } from "@tanstack/react-router";
import { getChannel } from "../../adapters/channels.adapter";
import { ChannelDetails } from "@/components/features/channel-details/channel-details.tsx";

export const Route = createFileRoute("/app/$channel")({
  component: () => {
    return <ChannelDetails />;
  },
  loader: async ({ params }) => getChannel(params.channel),
});
