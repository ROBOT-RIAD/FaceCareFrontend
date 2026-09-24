import { App } from "@/App";
import { createBrowserRouter } from "react-router";
import Homepage from "@/pages/home/Homepage";



export const router = createBrowserRouter([
    {
        Component: App,
        path: "/",
        children: [
            {
                Component: Homepage,
                index: true,
            }

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
