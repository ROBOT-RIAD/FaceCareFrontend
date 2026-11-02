import { App } from "@/App";
import { createBrowserRouter } from "react-router";
import Homepage from "@/pages/home/Homepage";
import AboutPage from "@/pages/about/AboutPage";
import ProfilePage from "@/pages/userProfile/profile";
import CartPage from "@/pages/cart/cart";
import FavoritePage from "@/pages/favorite/Favorite";
import ProductPage from "@/pages/product/product";
import AISkinIntelligencePage from "@/pages/ai skine intelligence/ai_skine_intelligence";
import ChatPage from "@/pages/chat/chat";
import NotFound from "@/pages/404_not_found.tsx/Not_fount";
import RouteErrorBoundary from "@/components/layout/RouteErrorBoundary";

import OrderSuccessPage from "@/pages/order/OrderSuccess";
import OrderCancelPage from "@/pages/order/OrderCancel";

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
                Component: ProductPage,
                path: "products",
            },
            {
                Component: ProductPage,
                path: "product",
            },
            {
                Component: AISkinIntelligencePage,
                path: "ai-skin-intelligence",
            },
            {
                Component: AISkinIntelligencePage,
                path: "ai-skine-intelligence",
            },
            {
                Component: ChatPage,
                path: "chat",
            },
            {
                Component: ChatPage,
                path: "chat-assistant",
            },
            {
                Component: AboutPage,
                path: "about",
            },
            {
                Component: ProfilePage,
                path: "profile",
            },
            {
                Component: CartPage,
                path: "cart",
            },
            {
                Component: OrderSuccessPage,
                path: "order/success",
            },
            {
                Component: OrderSuccessPage,
                path: "payment/success",
            },
            {
                Component: OrderSuccessPage,
                path: "payment-status",
            },
            {
                Component: OrderCancelPage,
                path: "order/cancel",
            },
            {
                Component: OrderCancelPage,
                path: "payment/cancel",
            },
            {
                Component: FavoritePage,
                path: "favorite",
            },
            {
                Component: FavoritePage,
                path: "wishlist",
            },
            {
                Component: NotFound,
                path: "*",
            },
        ],
    },
]);
