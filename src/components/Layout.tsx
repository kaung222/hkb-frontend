import { Outlet, useNavigate } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { LOGIN } from "@/constants/pathname.const.ts";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar, AppSideBarSkeletonLoading } from "./app-sidebar";
import { useCurrentUser } from "@/api/user/current-user";

const LayoutSkeletonLoading = () => {
  return (
    <SidebarProvider>
      <AppSideBarSkeletonLoading />
      <main className="w-full relative overflow-hidden">
        <SidebarTrigger />
        <Outlet />
        <div className="fixed z-50 right-2 top-5">
          <ModeToggle />
        </div>
      </main>
    </SidebarProvider>
  );
};

const Layout = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const { data: user, isLoading } = useCurrentUser();
  useEffect(() => {
    if (!accessToken) {
      navigate(LOGIN);
    }
  }, [accessToken, navigate]);

  if (isLoading) return <LayoutSkeletonLoading />;
  return (
    <SidebarProvider>
      {/* <div className=""></div> */}
      <AppSidebar />
      <main className="w-full relative overflow-hidden">
        <SidebarTrigger />
        <Outlet />
        <div className="fixed z-50 right-2 top-5">
          <ModeToggle />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default Layout;
