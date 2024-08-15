import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// eslint-disable-next-line import/no-unresolved
import { Toaster, toast } from "sonner";
import AuthLoader from "./auth/components/auth-loader";
import ConfirmationDialog from "./components/confirmation-dialog";
import DisableSmallScreen from "./components/disable-small-screen";
import "./index.css";
import router from "./router";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(error.message);
    },
  }),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DisableSmallScreen>
      <QueryClientProvider client={queryClient}>
        <AuthLoader>
          <Toaster richColors />
          <ConfirmationDialog />
          <RouterProvider router={router} />
        </AuthLoader>
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      </QueryClientProvider>
    </DisableSmallScreen>
  </React.StrictMode>,
);
