import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/app/$channel");

export const ChannelDetails = () => {
  const data = routeApi.useLoaderData();
  return (
    <div>
      <h1 className="text-2xl font-bold">{data?.name}</h1>
    </div>
  );
};
