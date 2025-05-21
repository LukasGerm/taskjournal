import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { PlusIcon as PlusIconSolid } from "@heroicons/react/20/solid";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { useUser } from "@/modules/providers/hooks/user.hooks.ts";
import { useCreatePage, usePages } from "@/modules/hooks/page.hooks.ts";
import { Loader2, FileText } from "lucide-react";

export const AppSideBar = () => {
  const { user } = useUser(); // Corrected: useUser returns the user object directly
  const createPageMutation = useCreatePage();
  const {
    data: pages,
    isLoading: isLoadingPages,
    isError: isErrorPages,
  } = usePages(user.id);

  const handleAddPage = () => {
    createPageMutation.mutate({
      userId: user.id,
      content: "Untitled Page",
    });
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex gap-2 py-2 px-2 items-center">
          <Avatar>
            <AvatarFallback>
              {user.username.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{user.username}</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>My pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
                  <span>
                    {createPageMutation.isPending ? "Adding..." : "Add page"}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {isLoadingPages && (
                <>
                  <SidebarMenuSkeleton showIcon={true} />
                  <SidebarMenuSkeleton showIcon={true} />
                  <SidebarMenuSkeleton showIcon={true} />
                </>
              )}
              {isErrorPages && (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled className="text-destructive">
                    Error loading pages
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {pages?.map((page) => (
                <SidebarMenuItem key={page.id}>
                  <SidebarMenuButton className="cursor-pointer">
                    <FileText />
                    <span>
                      {page.content.length > 20
                        ? `${page.content.substring(0, 20)}...`
                        : page.content}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
