import { Page } from "@app/_components/_core";
import {
  ActiveLogin,
  AdvertisingSettings,
  EmailAccessSettings,
  InvoiceSettings,
  MembershipPlans,
  NotificationSettings,
  OrganizationSettings,
  PaymentMethodSettings,
  ResetPasswordSettings,
  StatementSettings,
  TeamSettings,
  TwoFactorAuth,
} from "@app/_components/user/settings";
import withAuth from "@app/_hoc/withAuth";
import { SettingsLayout } from "@app/_layouts/SettingsLayout";
import { SoloLayout } from "@app/_layouts/SoloLayout";
import { StretchedLayout } from "@app/_layouts/StretchedLayout";
import ChatAppPage from "@app/pages/apps/chat";
import ContactAppPage from "@app/pages/apps/contact";
import InvoicePage1 from "@app/pages/apps/invoice-1";
import MailAppPage from "@app/pages/apps/mail";
import ForgotPassword from "@app/pages/auth/forgot-password";
import Login1 from "@app/pages/auth/login1";
import Login2 from "@app/pages/auth/login2";
import ResetPassword from "@app/pages/auth/reset-password";
import Signup1 from "@app/pages/auth/signup1";
import Signup2 from "@app/pages/auth/signup2";
import SamplePage from "@app/pages/dashboards/sample";
import DnDPage from "@app/pages/extensions/dnd";
import DropzonePage from "@app/pages/extensions/dropzone";
import CkEditorPage from "@app/pages/extensions/editors/ck";
import WysiwygEditorPage from "@app/pages/extensions/editors/wysiwyg";
import SweetAlertsPage from "@app/pages/extensions/sweet-alert";
import NotFoundErrorPage from "@app/pages/extra-pages/404";
import InternalServerErrorPage from "@app/pages/extra-pages/500";
import AboutUsPage from "@app/pages/extra-pages/about-us";
import CallOutsPage from "@app/pages/extra-pages/call-outs";
import ContactUsPage from "@app/pages/extra-pages/contact-us";
import LockScreenPage from "@app/pages/extra-pages/lock-screen";
import PricingPlanPage from "@app/pages/extra-pages/pricing-plan";
import ProjectsGridPage from "@app/pages/grid-views/projects";
import UsersGridPage from "@app/pages/grid-views/users";
import ProjectsListPage from "@app/pages/list-views/projects";
import UsersListPage from "@app/pages/list-views/users";
import MetricsPage from "@app/pages/metrics";
import BasicCalendarPage from "@app/pages/modules/calendars/basic";
import CultureCalendarPage from "@app/pages/modules/calendars/culture";
import PopupCalendarPage from "@app/pages/modules/calendars/popup";
import RenderingCalendarPage from "@app/pages/modules/calendars/rendering";
import SelectableCalendarPage from "@app/pages/modules/calendars/selectable";
import TimeslotCalendarPage from "@app/pages/modules/calendars/timeslot";
import AreaChartPage from "@app/pages/modules/charts/area";
import BarChartPage from "@app/pages/modules/charts/bar";
import ComposedChartPage from "@app/pages/modules/charts/composed";
import LineChartPage from "@app/pages/modules/charts/line";
import PieChartPage from "@app/pages/modules/charts/pie";
import RadarChartPage from "@app/pages/modules/charts/radar";
import RadialChartPage from "@app/pages/modules/charts/radial";
import ScatterChartPage from "@app/pages/modules/charts/scatter";
import TreeMapChartPage from "@app/pages/modules/charts/treemap";
import MarkerClustererPage from "@app/pages/modules/maps/clustering";
import DirectionsMapPage from "@app/pages/modules/maps/directions";
import DrawingViewMapPage from "@app/pages/modules/maps/drawing";
import GeoLocationMapPage from "@app/pages/modules/maps/geo-location";
import KmLayerMapPage from "@app/pages/modules/maps/kml";
import OverlayMapPage from "@app/pages/modules/maps/overlay";
import PopupInfoMapPage from "@app/pages/modules/maps/popup-info";
import SimpleMapPage from "@app/pages/modules/maps/simple";
import StreetViewPanoramaPage from "@app/pages/modules/maps/street-view";
import StyledMapPage from "@app/pages/modules/maps/styled";
import OnboardingPage1 from "@app/pages/onboarding-1";
import OnboardingPage2 from "@app/pages/onboarding-2";
import OnboardingPage3 from "@app/pages/onboarding-3";
import UserProfile1 from "@app/pages/user/profile-1";
import ProfilePage2 from "@app/pages/user/profile-2";
import ProfilePage3 from "@app/pages/user/profile-3";
import ProfilePage4 from "@app/pages/user/profile-4";
import PublicProfile from "@app/pages/user/settings/public-profile";
import ChangePassword from "@app/pages/user/settings/change-password";
import EditProfile from "@app/pages/user/settings/edit-profile";
import SocialWallApp from "@app/pages/user/social-wall";
import { WidgetsPage } from "@app/pages/widgets";
import { createBrowserRouter } from "react-router-dom";
import NewPage from "@app/pages/dashboards/newpage"; // Import New Page
import AdminDashboard from "@app/pages/admin-dashboard/dashboard";
import { element } from "prop-types";
import EmployeesPage from "@app/pages/admin-dashboard/employees";
import EmployeeDashboard from "@app/pages/employee-dashboard/employeeDashboard";
import Unauthorized from "@app/pages/errors/unauthorized";

const routes = [
  {
    path: "/",
    element: <StretchedLayout />,
    children: [
      {
        path: "/admin/dashboard",
        element: <Page Component={AdminDashboard} hoc={withAuth} />,
      },
      {
        path: "/admin/employees",
        element: <Page Component={EmployeesPage} hoc={withAuth} />,
      },
      {
        path: "/employee/dashboard",
        element: <Page Component={EmployeeDashboard} hoc={withAuth} />,
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      }
    ],
  },

  {
    path: "/auth",
    element: <SoloLayout />,
    children: [
      {
        path: "login-1",
        element: <Login1 />,
      },
      {
        path: "login-2",
        element: <Login2 />,
      },
      {
        path: "signup-1",
        element: <Signup1 />,
      },
      {
        path: "signup-2",
        element: <Signup2 />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "/extra-pages",
    element: <SoloLayout />,
    children: [
      {
        path: "404",
        element: <NotFoundErrorPage />,
      },
      {
        path: "500",
        element: <InternalServerErrorPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundErrorPage />,
  },
];

export const router = createBrowserRouter(routes);
