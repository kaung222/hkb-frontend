import {
  BadgeDollarSignIcon,
  Home,
  Inbox,
  PackagePlusIcon,
  Settings,
  ShoppingBagIcon,
  UserPlusIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  CASH_BOOK,
  HOME,
  INVENTORY,
  SERVICE,
  SETTINGS,
  SHOP,
  USER,
} from "@/constants/pathname.const";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "@/configs/firebase";
import { toast } from "sonner";
import { SUCCESS_MSG } from "@/constants/general.const";
import { Skeleton } from "./ui/skeleton";
import { useCurrentUser } from "@/api/user/current-user";

const items = [
  {
    title: "Home",
    url: HOME,
    icon: Home,
    role: ["admin", "technician", "reception"],
  },
  {
    title: "Services",
    url: SERVICE,
    icon: Inbox,
    role: ["admin", "technician", "reception"],
  },
  // {
  //   title: "Cash Book",
  //   url: CASH_BOOK,
  //   icon: BadgeDollarSignIcon,
  //   role: ["admin"],
  // },
  {
    title: "Inventory",
    url: INVENTORY,
    icon: PackagePlusIcon,
    role: ["admin", "technician", "reception"],
  },
  {
    title: "Shops",
    url: SHOP,
    icon: ShoppingBagIcon,
    role: ["admin"],
  },
  {
    title: "Users",
    url: USER,
    icon: UserPlusIcon,
    role: ["admin"],
  },
  {
    title: "Settings",
    url: SETTINGS,
    icon: Settings,
    role: ["admin", "technician", "reception"],
  },
  // {
  //   title: "CashBook",
  //   url: "#",
  //   icon: Calendar,
  // },
  // {
  //   title: "Inventory",
  //   url: "#",
  //   icon: Search,
  // },
  // {
  //   title: "Shop",
  //   url: "#",
  //   icon: Settings,
  // },
];

export const AppSideBarSkeletonLoading = () => (
  <Sidebar className="z-20">
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="justify-center gap-x-2 pt-6">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="w-1/2 space-y-2">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-5" />
          </div>
        </SidebarGroupLabel>
        <SidebarGroupContent className="pt-10">
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton size="lg" className="justify-center" asChild>
                  <Skeleton className="">
                    <item.icon />
                    <Skeleton className="h-4 w-full" />
                  </Skeleton>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarFooter>
            <Skeleton className="w-full h-10 rounded-md mt-3" />
          </SidebarFooter>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
);

export function AppSidebar() {
  const { pathname } = useLocation();
  const { data: user, isLoading, error } = useCurrentUser();
  const [signOut] = useSignOut(auth);
  const navigate = useNavigate();

  async function handleSignOut() {
    const res = await signOut();
    localStorage.clear();
    navigate("/login");
    if (res) {
      toast.success(SUCCESS_MSG);
    }
  }

  if (isLoading) return <AppSideBarSkeletonLoading />;
  if (error) return <div className="">Errror</div>;

  return (
    <Sidebar className="z-20">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="justify-center gap-x-2 pt-6">
            <img src="/hkb-logo2.png" alt="hlakabar" className="w-16 h-16" />
            <div className="">
              <p className="text-sm">Welcome</p>
              <h1 className="font-semibold text-center text-balance">
                {user?.email}
              </h1>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent className="pt-10">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.role?.includes(user?.role) && (
                    <SidebarMenuButton
                      isActive={pathname === item.url}
                      size="lg"
                      className="justify-center"
                      asChild
                    >
                      <Link className="" to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <SidebarFooter>
              <Button onClick={handleSignOut}>Logout</Button>
            </SidebarFooter>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
