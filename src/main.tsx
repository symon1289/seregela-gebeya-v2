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
if (import.meta.env.PROD && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js", {
                scope: "/",
            })
            .then((registration) => {
                console.log("SW registered:", registration);

                // Immediately claim any waiting worker
                if (registration.waiting) {
                    registration.waiting.postMessage({ type: "SKIP_WAITING" });
                }

                // Handle updates
                registration.addEventListener("updatefound", () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener("statechange", () => {
                            if (newWorker.state === "activated") {
                                window.location.reload();
                            }
                        });
                    }
                });
            })
            .catch((error) => {
                console.log("SW registration failed:", error);
            });
    });
}
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
