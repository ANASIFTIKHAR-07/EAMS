import { Header, Sidebar } from "@app/_components/layout";
import { getMenus } from "@app/_components/layout/Sidebar/menus-items";
import { Customizer, CustomizerButton } from "@app/_shared";
import {
  JumboLayout,
  JumboLayoutProvider,
} from "@jumbo/components/JumboLayout";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { defaultLayoutConfig } from "@app/_config/layouts";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";

export function StretchedLayout() {
  const location = useLocation();
  const menus = getMenus();
  const { isAuthenticated, user } = useAuth();

  return (
    <JumboLayoutProvider layoutConfig={defaultLayoutConfig}>
      <JumboLayout
        header={<Header />}
        // footer={<Footer />}
        sidebar={<Sidebar menus={menus} />}  
      >
        {/* 🔐 Only redirect if on "/" and user is authenticated */}
        {location.pathname === "/" && isAuthenticated && user?.role && (
          <Navigate
            to={
              user.role === "admin"
                ? "/admin/dashboard"
                : user.role === "employee"
                ? "/employee/dashboard"
                : "/auth/login-1"
            }
            replace
          />
        )}

        {/* ⛔ No forced redirect anymore */}
        <Outlet />
        <Customizer />
        <CustomizerButton />
      </JumboLayout>
    </JumboLayoutProvider>
  );
}
