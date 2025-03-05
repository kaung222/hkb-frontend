import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react-router/v6";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <NuqsAdapter>
            <Toaster richColors={true} />
            <RouterProvider router={router} />
          </NuqsAdapter>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
