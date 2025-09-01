import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ProductList from "./components/productlist";
import LoginPage from "./components/login";
import SignupPage from "./components/signup";
import CartPage from "./components/cartpage";
import OrderPlacement from "./components/orderplacement";
import ProductDetailed from "./components/productdetailed";
import UserProfile from "./components/userprofile";
import OrderHistory from "./components/orderhistory";
import ProtectedRoute from "./components/protected";

const router = createBrowserRouter([
    { path: "", element: <App /> },
    { path: "login", element: <LoginPage /> },
    { path: "signup", element: <SignupPage /> },

    // Protected routes
    {
        element: <ProtectedRoute />,
        children: [
            { path: "products", element: <ProductList /> },
            {path:"/products/:productId", element:<ProductDetailed/> },
            { path: "cart", element: <CartPage /> },
            { path: "orders", element: <OrderHistory /> },
            { path: "user", element: <UserProfile /> },
            { path: "checkout", element: <OrderPlacement /> },
        ],
    },
]);

export default router;
