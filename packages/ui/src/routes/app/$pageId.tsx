import { createFileRoute } from "@tanstack/react-router";
import { usePage } from "@/modules/hooks/page.hooks";
import EmptyPageComponent from "@/modules/pages/page-error";
import PageContentView from "@/modules/pages/page-content-view"; // Import the new component

export const Route = createFileRoute("/app/$pageId")({
  loader: ({ params }) => {
    const pageId = params.pageId;
    return { pageId };
  },
  pendingComponent: () => (
    <div className="p-4">
      <div className="h-8 w-1/3 bg-gray-200 animate-pulse rounded"></div>
    </div>
  ),
  component: PageLoaderComponent,
});

function PageLoaderComponent() {
  const { pageId } = Route.useLoaderData();
  const { data: page, error } = usePage(pageId);

  if (error || !page) {
    return <EmptyPageComponent />;
  }

  // If page is loaded and exists, render PageContentView
  return <PageContentView page={page} pageId={pageId} key={pageId} />;
}
