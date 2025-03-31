import { ChannelType } from "shared/src/types/channels.types.ts";

export const getChannels = async () => {
  const data = await fetch(import.meta.env.VITE_API_URL + "/channels");

  const json = await data.json();

  return json as ChannelType[];
};

export const getChannel = async (id: string) => {
  const data = await fetch(import.meta.env.VITE_API_URL + "/channels/" + id);

  const json = await data.json();

  return json as ChannelType;
};

export const createChannel = async (name: string) => {
  await fetch(import.meta.env.VITE_API_URL + "/channels", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
};

export const deleteChannel = async (id: string) => {
  await fetch(import.meta.env.VITE_API_URL + "/channels", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
};
