import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/")({
  component: () => (
    <div className="flex gap-4 flex-col justify-center items-center w-full">
      <h1 className="text-5xl">Wow, such empty!</h1>
    </div>
  ),
});
