import { createLazyFileRoute } from "@tanstack/react-router";
import Void from "../../assets/void.svg";

export const Route = createLazyFileRoute("/app/")({
  component: () => (
    <div className="flex gap-4 flex-col justify-center items-center w-full">
      <img src={Void} alt="Void" className="w-1/5" />
      <h1 className="text-5xl">Wow, such empty!</h1>
      <h2 className="text-l">Select a channel to see whats going on</h2>
    </div>
  ),
});
