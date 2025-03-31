import { useChannelSocket } from "../../hooks/useSocket.ts";
import { useEffect, useRef, useState } from "react";

export const useConnectToChannel = (props: { onSuccess?: () => void }) => {
  const socket = useChannelSocket();
  const [peerStreams, setPeerStreams] = useState<Map<string, MediaStream>>(
    new Map(),
  );
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnections = useRef(new Map<string, RTCPeerConnection>());

  const handleICECandidate =
    (peerId: string) => (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        socket.emit("newIceCandidate", {
          candidate: event.candidate,
          to: peerId,
        });
      }
    };

  const handleTrack = (peerId: string) => (event: RTCTrackEvent) => {
    const [remoteStream] = event.streams;
    console.log("Received track from:", peerId);
    setPeerStreams((prev) => {
      const newStreams = new Map(prev);
      newStreams.set(peerId, remoteStream);
      return newStreams;
    });
  };

  const createPeerConnection = (peerId: string) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.addEventListener("icecandidate", handleICECandidate(peerId));
    peerConnection.addEventListener("track", handleTrack(peerId));

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStreamRef.current!);
      });
    }

    peerConnections.current.set(peerId, peerConnection);
    return peerConnection;
  };

  useEffect(() => {
    const handleOfferVoiceConnection = async (data: {
      offer: RTCSessionDescriptionInit;
      from: string;
    }) => {
      console.log("Received offer from:", data.from);

      const peerConnection = createPeerConnection(data.from);

      try {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.offer),
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socket.emit("answerVoiceConnection", {
          answer,
          to: data.from,
        });
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    };

    const handleAnswerVoiceConnection = async (data: {
      answer: RTCSessionDescriptionInit;
      from: string;
    }) => {
      console.log("Received answer from:", data.from);

      const peerConnection = peerConnections.current.get(data.from);
      if (!peerConnection) return;

      try {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.answer),
        );
      } catch (err) {
        console.error("Error handling answer:", err);
      }
    };

    const handleNewICECandidate = async (data: {
      candidate: RTCIceCandidate;
      from: string;
    }) => {
      const peerConnection = peerConnections.current.get(data.from);
      if (!peerConnection) return;

      try {
        await peerConnection.addIceCandidate(
          new RTCIceCandidate(data.candidate),
        );
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    };

    const handleUserJoined = async (newPeerId: string) => {
      console.log("User joined:", newPeerId);

      const peerConnection = createPeerConnection(newPeerId);

      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socket.emit("offerVoiceConnection", {
          offer,
          to: newPeerId,
        });
      } catch (err) {
        console.error("Error creating offer:", err);
      }
    };

    const handleUserLeft = (peerId: string) => {
      console.log("User left:", peerId);

      const peerConnection = peerConnections.current.get(peerId);
      if (peerConnection) {
        peerConnection.close();
        peerConnections.current.delete(peerId);
      }

      setPeerStreams((prev) => {
        const newStreams = new Map(prev);
        newStreams.delete(peerId);
        return newStreams;
      });
    };

    socket.on("offerVoiceConnection", handleOfferVoiceConnection);
    socket.on("answerVoiceConnection", handleAnswerVoiceConnection);
    socket.on("newIceCandidate", handleNewICECandidate);
    socket.on("userJoined", handleUserJoined);
    socket.on("userLeft", handleUserLeft);

    return () => {
      socket.off("offerVoiceConnection", handleOfferVoiceConnection);
      socket.off("answerVoiceConnection", handleAnswerVoiceConnection);
      socket.off("newIceCandidate", handleNewICECandidate);
      socket.off("userJoined", handleUserJoined);
      socket.off("userLeft", handleUserLeft);

      peerConnections.current.forEach((connection) => {
        connection.close();
      });
      peerConnections.current.clear();
      setPeerStreams(new Map());
    };
  }, [socket]);

  const connectToChannel = async (channel: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      localStreamRef.current = stream;

      socket.emit("joinChannel", { channel });
      props.onSuccess?.();
    } catch (error) {
      console.error("Error getting user media:", error);
      throw error;
    }
  };

  return {
    connectToChannel,
    streams: peerStreams,
  };
};
