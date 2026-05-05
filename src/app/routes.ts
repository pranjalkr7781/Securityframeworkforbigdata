import { createBrowserRouter } from "react-router";
import { Dashboard } from "./components/Dashboard";
import { PolicyManagement } from "./components/PolicyManagement";
import { AuditLog } from "./components/AuditLog";
import { DataSources } from "./components/DataSources";
import { Verification } from "./components/Verification";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "policies", Component: PolicyManagement },
      { path: "audit", Component: AuditLog },
      { path: "data-sources", Component: DataSources },
      { path: "verification", Component: Verification },
    ],
  },
]);
