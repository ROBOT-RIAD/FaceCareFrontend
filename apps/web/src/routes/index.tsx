import { App } from "@/App";
import { createBrowserRouter } from "react-router";
import Homepage from "@/pages/home/Homepage";
import AboutPage from "@/pages/about/AboutPage";
import NotFound from "@/pages/404_not_found.tsx/Not_fount";
import RouteErrorBoundary from "@/components/layout/RouteErrorBoundary";


export const router = createBrowserRouter([
    {
        Component: App,
        ErrorBoundary: RouteErrorBoundary,
        path: "/",
        children: [
            {
                Component: Homepage,
                index: true,
            },
            {
                Component: AboutPage,
                path: "about",
            },
            {
                Component: NotFound,
                path: "*",
            },
        ],
    },
]);
