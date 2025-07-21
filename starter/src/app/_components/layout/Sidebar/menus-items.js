import { useTranslation } from "react-i18next";

export function getMenus() {
  const { t } = useTranslation();
  return [
    {
      label: t("sidebar.menu.home"),
      children: [
        {
          path: "/dashboards/sample",          // Sample Route 
          label: t("User"),
          icon: "misc",
        },
        {                                    // new routes
          path: "/dashboards/newpage",
          label: t("sidebar.menuItem.dashboard"),
          icon: "misc",
        },
      ],
    },
  ];
}
