import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/$pageId")({
  component: PageComponent,
});

function PageComponent() {
  const { pageId } = Route.useParams();

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Page Details</h1>
      <p>Current Page ID: {pageId}</p>
      {/* You can fetch and display page content here based on pageId */}
    </div>
  );
}
