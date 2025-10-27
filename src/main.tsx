import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./pages/Dashboard";
import Authorization from "./routes/Authorization";
import RouteProtection from "./routes/RouteProtection";
import Login from "./pages/Login";
import PublicRoute from "./routes/PublicRoute";
import Users from "./pages/users/Users";
import AddUser from "./pages/users/add/AddUser";
import EditUser from "./pages/users/edit/EditUser";
import News from "./pages/news/News";
import AddNews from "./pages/news/add/AddNews";
import EditNews from "./pages/news/edit/EditNews";
import ViewNews from "./pages/news/view/ViewNews";
import Promotions from "./pages/promotions/Promotions";
import AddPromotion from "./pages/promotions/add/AddPromotion";
import EditPromotion from "./pages/promotions/edit/EditPromotion";
import ViewPromotion from "./pages/promotions/view/ViewPromotion";
import Company from "./pages/company/Company";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Authorization />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <RouteProtection>
        <Dashboard />
      </RouteProtection>
    ),
  },
  //users
  {
    path: "/users",
    element: (
      <RouteProtection>
        <Users />
      </RouteProtection>
    ),
  },
  {
    path: "/users/add",
    element: (
      <RouteProtection>
        <AddUser />
      </RouteProtection>
    ),
  },
  {
    path: "/users/edit/:id",
    element: (
      <RouteProtection>
        <EditUser />
      </RouteProtection>
    ),
  },
  {
    path: "/news",
    element: (
      <RouteProtection>
        <News />
      </RouteProtection>
    ),
  },
  {
    path: "/news/add",
    element: (
      <RouteProtection>
        <AddNews />
      </RouteProtection>
    ),
  },
  {
    path: "/news/edit/:id",
    element: (
      <RouteProtection>
        <EditNews />
      </RouteProtection>
    ),
  },
  {
    path: "/news/view/:id",
    element: (
      <RouteProtection>
        <ViewNews />
      </RouteProtection>
    ),
  },
  {
    path: "/promotions",
    element: (
      <RouteProtection>
        <Promotions />
      </RouteProtection>
    ),
  },
  {
    path: "/promotions/add",
    element: (
      <RouteProtection>
        <AddPromotion />
      </RouteProtection>
    ),
  },
  {
    path: "/promotions/edit/:id",
    element: (
      <RouteProtection>
        <EditPromotion />
      </RouteProtection>
    ),
  },
  {
    path: "/promotions/view/:id",
    element: (
      <RouteProtection>
        <ViewPromotion />
      </RouteProtection>
    ),
  },
  {
    path: "/company",
    element: (
      <RouteProtection>
        <Company />
      </RouteProtection>
    ),
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
