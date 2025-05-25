import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { PlusIcon as PlusIconSolid } from "@heroicons/react/20/solid";
import { Loader2 } from "lucide-react";
import { useUser } from "@/modules/providers/hooks/user.hooks.ts";
import { useCreatePage } from "@/modules/hooks/page.hooks.ts";
import { useRouter } from "@tanstack/react-router";

export const AddPageButton = () => {
  const { user } = useUser();
  const createPageMutation = useCreatePage();
  const router = useRouter();

  const handleAddPage = () => {
    if (!user?.id) return;

    createPageMutation.mutate(
      {
        userId: user.id,
        content: "Untitled Page",
        title: "Untitled Page",
      },
      {
        onSuccess: (newPage) => {
          router.navigate({
            to: "/app/$pageId",
            params: { pageId: newPage.id },
          });
        },
      }
    );
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="cursor-pointer"
        onClick={handleAddPage}
        disabled={createPageMutation.isPending}
      >
        {createPageMutation.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <PlusIconSolid />
        )}
        <span>{createPageMutation.isPending ? "Adding..." : "Add page"}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
