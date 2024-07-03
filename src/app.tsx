import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes";
import { RouterProvider } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

export default function App() {
  // Create a client
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colors: {
            flashWhite: ["#F0F0F0"],
            brightGray: ["#EBF2F2"],
            munsellBlue: ["#0093AF"],
            cobaltBlue: ["#00439C"],
          },
          fontFamily: "Be Vietnam Pro, sans-serif",
        }}
      >
        <ModalsProvider>
          <Notifications position="top-right" zIndex={2077} />
          <RouterProvider router={router} />
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
