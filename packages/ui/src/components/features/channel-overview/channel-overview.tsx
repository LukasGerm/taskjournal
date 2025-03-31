import { useEffect, useRef, useState } from "react";
import { ChannelLine } from "@/components/ui/molecules/channel-line";
import { useChannelSocket } from "../hooks/useSocket";
import { AddChannel } from "./add-channel.tsx";
import { useActiveChannelConnections } from "./hooks/useActiveChannelConnections";
import { useChannels } from "./hooks/useChannels";
import { useDeleteChannel } from "./hooks/useDeleteChannel";
import { useConnectToChannel } from "./hooks/useConnectToChannel";

export const ChannelOverview = () => {
  const { data } = useChannels();
  const { deleteChannel } = useDeleteChannel();
  const socket = useChannelSocket();

  const { connectToChannel, streams } = useConnectToChannel({
    onSuccess: () => {
      setConnected(true);
    },
  });

  const activeConnections = useActiveChannelConnections();

  const [connected, setConnected] = useState(false);

  const handleDelete = (id: string) => {
    deleteChannel(id);
  };

  const handleConnect = async (id: string) => {
    await connectToChannel(id);
  };

  const handleDisconnect = () => {
    socket.emit("disconnectFromChannel", () => {
      setConnected(false);
    });
  };

  return (
    <div className="flex items-stretch border-r border-r-gray-300 h-screen p-4 min-w-60 flex-col">
      <div className="flex flex-col gap-1 flex-1">
        {data?.map((channel) => (
          <ChannelLine
            id={channel.id}
            key={channel.id}
            name={channel.name}
            onDelete={() => {
              handleDelete(channel.id);
            }}
            onDoubleClick={() => {
              handleConnect(channel.id);
            }}
            activeUsers={activeConnections[channel.id]?.users || []}
          />
        ))}
        <div className="border-t border-t-gray-300 py-2">
          <AddChannel />
        </div>
      </div>
      {connected && (
        <button onClick={handleDisconnect}>Leave voice channel</button>
      )}
      {Array.from(streams).map(([_, stream]) => (
        <AudioStream key={stream.id} stream={stream}></AudioStream>
      ))}
    </div>
  );
};

const AudioStream = (props: { stream: MediaStream }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && props.stream) {
      audioRef.current.srcObject = props.stream;
    }
  }, [props.stream]);

  return <audio autoPlay={true} ref={audioRef}></audio>;
};
