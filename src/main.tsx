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
import EditCompany from "./pages/company/edit/EditCompany";
import Carousel from "./pages/company/Carousel";
import Services from "./pages/company/Services";
import Awards from "./pages/company/Awards";
import Branches from "./pages/company/Branches";
import EditBranches from "./pages/company/edit/EditBranches";
import AddBranches from "./pages/company/add/AddBranches";
import AddServices from "./pages/company/add/AddServices";
import EditServices from "./pages/company/edit/EditServices";
import EditCarousel from "./pages/company/edit/EditCarousel";
import AddAwards from "./pages/company/add/AddAwards";
import EditAwards from "./pages/company/edit/EditAwards";
import Visas from "./pages/visa/Visas";
import AddVisa from "./pages/visa/add/AddVisa";
import EditVisa from "./pages/visa/edit/EditVisa";
import ViewVisa from "./pages/visa/view/ViewVisa";
import AddInformation from "./pages/visa/add/AddInformation";
import EditInformation from "./pages/visa/edit/EditInformation";
import Blogs from "./pages/blogs/Blogs";
import ViewBlog from "./pages/blogs/view/ViewBlog";
import AddBlog from "./pages/blogs/add/AddBlog";
import EditBlog from "./pages/blogs/edit/EditBlog";
import Tours from "./pages/tours/Tours";
import AddTour from "./pages/tours/AddTour";
import EditTour from "./pages/tours/EditTour";
import AddTourInfo from "./pages/tours/AddTourInfo";
import EditTourInfo from "./pages/tours/EditTourInfo";
import ViewTour from "./pages/tours/ViewTour";
import RailPass from "./pages/rail-pass/RailPass";
import AddRailPass from "./pages/rail-pass/AddRailPass";
import EditRailPass from "./pages/rail-pass/EditRailPass";
import AddRailPassInfo from "./pages/rail-pass/AddRailPassInfo";
import EditRailPassInfo from "./pages/rail-pass/EditRailPassInfo";
import ViewRailPass from "./pages/rail-pass/ViewRailPass";

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
    path: "/company/details",
    element: (
      <RouteProtection>
        <Company />
      </RouteProtection>
    ),
  },
  {
    path: "/company/carousel",
    element: (
      <RouteProtection>
        <Carousel />
      </RouteProtection>
    ),
  },
  {
    path: "/company/carousel/edit",
    element: (
      <RouteProtection>
        <EditCarousel />
      </RouteProtection>
    ),
  },
  {
    path: "/company/services",
    element: (
      <RouteProtection>
        <Services />
      </RouteProtection>
    ),
  },
  {
    path: "/company/services/add",
    element: (
      <RouteProtection>
        <AddServices />
      </RouteProtection>
    ),
  },
  {
    path: "/company/services/edit/:id",
    element: (
      <RouteProtection>
        <EditServices />
      </RouteProtection>
    ),
  },
  {
    path: "/company/awards",
    element: (
      <RouteProtection>
        <Awards />
      </RouteProtection>
    ),
  },
  {
    path: "/company/awards/add",
    element: (
      <RouteProtection>
        <AddAwards />
      </RouteProtection>
    ),
  },
  {
    path: "/company/awards/edit/:id",
    element: (
      <RouteProtection>
        <EditAwards />
      </RouteProtection>
    ),
  },
  {
    path: "/company/branches",
    element: (
      <RouteProtection>
        <Branches />
      </RouteProtection>
    ),
  },
  {
    path: "/company/branches/add",
    element: (
      <RouteProtection>
        <AddBranches />
      </RouteProtection>
    ),
  },
  {
    path: "/company/branches/edit/:id",
    element: (
      <RouteProtection>
        <EditBranches />
      </RouteProtection>
    ),
  },
  {
    path: "/company/edit",
    element: (
      <RouteProtection>
        <EditCompany />
      </RouteProtection>
    ),
  },
  {
    path: "/visas/visa",
    element: (
      <RouteProtection>
        <Visas />
      </RouteProtection>
    ),
  },
  {
    path: "/visas/visa/view/:id",
    element: (
      <RouteProtection>
        <ViewVisa />
      </RouteProtection>
    ),
  },
  {
    path: "/visas/visa/add",
    element: (
      <RouteProtection>
        <AddVisa />
      </RouteProtection>
    ),
  },
  {
    path: "/visas/visa/edit/:id",
    element: (
      <RouteProtection>
        <EditVisa />
      </RouteProtection>
    ),
  },
  {
    path: "/visas/information/add",
    element: (
      <RouteProtection>
        <AddInformation />
      </RouteProtection>
    ),
  },
  {
    path: "/visas/information/edit/:id",
    element: (
      <RouteProtection>
        <EditInformation />
      </RouteProtection>
    ),
  },
  {
    path: "/blogs",
    element: (
      <RouteProtection>
        <Blogs />
      </RouteProtection>
    ),
  },
  {
    path: "/blogs/view/:id",
    element: (
      <RouteProtection>
        <ViewBlog />
      </RouteProtection>
    ),
  },
  {
    path: "/blogs/add",
    element: (
      <RouteProtection>
        <AddBlog />
      </RouteProtection>
    ),
  },
  {
    path: "/blogs/edit/:id",
    element: (
      <RouteProtection>
        <EditBlog />
      </RouteProtection>
    ),
  },
  {
    path: "/tours",
    element: (
      <RouteProtection>
        <Tours />
      </RouteProtection>
    ),
  },
  {
    path: "/tours/add",
    element: (
      <RouteProtection>
        <AddTour />
      </RouteProtection>
    ),
  },
  {
    path: "/tours/edit/:id",
    element: (
      <RouteProtection>
        <EditTour />
      </RouteProtection>
    ),
  },
  {
    path: "/tours/information/add",
    element: (
      <RouteProtection>
        <AddTourInfo />
      </RouteProtection>
    ),
  },
  {
    path: "/tours/information/edit/:id",
    element: (
      <RouteProtection>
        <EditTourInfo />
      </RouteProtection>
    ),
  },
  {
    path: "/tours/view/:id",
    element: (
      <RouteProtection>
        <ViewTour />
      </RouteProtection>
    ),
  },
  {
    path: "/rail-passes",
    element: (
      <RouteProtection>
        <RailPass />
      </RouteProtection>
    ),
  },
  {
    path: "/rail-passes/add",
    element: (
      <RouteProtection>
        <AddRailPass />
      </RouteProtection>
    ),
  },
  {
    path: "/rail-passes/edit/:id",
    element: (
      <RouteProtection>
        <EditRailPass />
      </RouteProtection>
    ),
  },
  {
    path: "/rail-passes/information/add",
    element: (
      <RouteProtection>
        <AddRailPassInfo />
      </RouteProtection>
    ),
  },
  {
    path: "/rail-passes/information/edit/:id",
    element: (
      <RouteProtection>
        <EditRailPassInfo />
      </RouteProtection>
    ),
  },
  {
    path: "/rail-passes/view/:id",
    element: (
      <RouteProtection>
        <ViewRailPass />
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
