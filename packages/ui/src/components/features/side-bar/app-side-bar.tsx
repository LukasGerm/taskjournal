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
} from "@/components/ui/sidebar";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { useUser } from "@/components/features/providers/hooks/user.hooks.ts";

export const AppSideBar = () => {
  const { user } = useUser();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex gap-2 py-2 items-center">
          <Avatar>
            <AvatarFallback>{user.username.slice(0, 1)}</AvatarFallback>
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
                <SidebarMenuButton className="cursor-pointer">
                  <PlusIcon />
                  <span>Add page</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
