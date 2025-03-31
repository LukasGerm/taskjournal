import { useEffect, useState } from "react";
import { useChannelSocket } from "../../hooks/useSocket";

interface ActiveChannelConnection {
  users: string[];
}

export const useActiveChannelConnections = () => {
  const [activeChannelConnections, setActiveChannelConnections] = useState<
    Record<string, ActiveChannelConnection>
  >({});

  const channelSocket = useChannelSocket();
  useEffect(() => {
    channelSocket.on(
      "activeChannelConnections",
      (connections: Record<string, ActiveChannelConnection>) => {
        setActiveChannelConnections(connections);
      },
    );

    return () => {
      channelSocket.off("activeChannelConnections");
    };
  }, []);

  return activeChannelConnections;
};
