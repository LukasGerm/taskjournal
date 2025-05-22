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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { useUser, useLogout } from "@/modules/providers/hooks/user.hooks.ts";
import { usePages, PAGE_QUERY_KEY_BASE } from "@/modules/hooks/page.hooks.ts";
import { FileText, LogOutIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils.ts";
import { AddPageButton } from "./add-page-button.tsx";

export const AppSideBar = () => {
  const { user } = useUser();
  const {
    data: pages,
    isLoading: isLoadingPages,
    isError: isErrorPages,
  } = usePages(user.id);
  const logout = useLogout();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { pageId } = useParams({ strict: false });

  const handleLogout = async () => {
    await logout();
    queryClient.removeQueries({ queryKey: [PAGE_QUERY_KEY_BASE] });
    router.navigate({
      to: "/",
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
              <AddPageButton />

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
                  <SidebarMenuButton
                    className={cn(
                      "cursor-pointer",
                      pageId === page.id && // Use pageId from route params
                        "bg-accent text-accent-foreground"
                    )}
                    onClick={() =>
                      router.navigate({
                        to: "/app/$pageId",
                        params: { pageId: page.id },
                      })
                    }
                  >
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-pointer"
              onClick={handleLogout}
            >
              <LogOutIcon />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
