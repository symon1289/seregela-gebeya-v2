import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./i18n/i18n";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            keepPreviousData: true,
            staleTime: 1000 * 60 * 60,
        },
    } as any,
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <App />
                {/*<ReactQueryDevtools*/}
                {/*    initialIsOpen={false}*/}
                {/*    buttonPosition="bottom-left"*/}
                {/*/>*/}
                <ToastContainer position="top-right" autoClose={4000} />
            </QueryClientProvider>
        </Provider>
    </StrictMode>
);
