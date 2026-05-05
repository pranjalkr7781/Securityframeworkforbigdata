import { RouterProvider } from "react-router";
import { router } from "./routes";
import { SecurityProvider } from "./context/SecurityContext";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <SecurityProvider>
      <RouterProvider router={router} />
      <Toaster />
    </SecurityProvider>
  );
}