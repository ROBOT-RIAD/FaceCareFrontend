import { App } from "@/App";
import { createBrowserRouter } from "react-router";
import Homepage from "@/pages/home/Homepage";
import SkinIntelligencePage from "@/pages/skin-intelligence/SkinIntelligencePage";
import ProductsPage from "@/pages/products/ProductsPage";

export const router = createBrowserRouter([
    {
        Component: App,
        path: "/",
        children: [
            {
                Component: Homepage,
                index: true,
            },
            {
                Component: ProductsPage,
                path: "products",
            },
            {
                Component: SkinIntelligencePage,
                path: "skin-intelligence",
            },
            {
                Component: SkinIntelligencePage,
                path: "about",
            },
        ],
    },
    // {
    //     Component: Login,
    //     path: "/login",
    // },
    //   {
    //     Component: Login,
    //     path: "/login",
    //   },
    //   {
    //     Component: Register,
    //     path: "/register",
    //   },
    //   {
    //     Component: Verify,
    //     path: "/verify",
    //   },
    //   {
    //     Component: Unauthorized,
    //     path: "/unauthorized",
    //   },


]);
