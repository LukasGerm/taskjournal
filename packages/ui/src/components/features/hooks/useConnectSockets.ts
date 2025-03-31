import { useEffect } from "react";
import { useChannelSocket } from "./useSocket";

export const useConnectSockets = () => {
  const channelSocket = useChannelSocket();
  useEffect(() => {
    channelSocket.connect();
    return () => {
      channelSocket.disconnect();
    };
  }, []);
};
