import { useCreateChannel } from "./hooks/useCreateChannel";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/molecules/dialog.tsx";
import { Button } from "@/components/ui/atoms/button.tsx";

export const AddChannel = () => {
  const { createChannel } = useCreateChannel();
  const [channelName, setChannelName] = useState("");

  const handleCreateChannel = () => {
    createChannel(channelName);
    setChannelName("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Channel</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="font-bold">Create a channel</DialogTitle>
        <div>Choose a name and go for it</div>
        <input
          type="text"
          placeholder="Channel name"
          className="border border-gray-300 p-2 w-full"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button
              onClick={handleCreateChannel}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Create
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
