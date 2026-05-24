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
import Vehicles from "./pages/vehicles/Vehicles";
import AddVehicle from "./pages/vehicles/AddVehicle";
import EditVehicle from "./pages/vehicles/EditVehicle";
import Transportation from "./pages/transportation/Transportation";
import AddTransport from "./pages/transportation/AddTransport";
import EditTransportation from "./pages/transportation/EditTransportation";
import AddTransportationInfo from "./pages/transportation/AddTransportationInfo";
import EditTransportInfo from "./pages/transportation/EditTransportInfo";
import ViewTransportation from "./pages/transportation/ViewTransportation";
import Rental from "./pages/rental/Rental";
import AddRental from "./pages/rental/AddRental";
import EditRental from "./pages/rental/EditRental";
import TypesCategories from "./pages/types-categories/TypesCategories";
import AddTypesCategories from "./pages/types-categories/AddTypesCategories";
import EditTypesCategories from "./pages/types-categories/EditTypesCategories";
import PageNotFound from "./components/error/PageNotFound";
import Bookings from "./pages/rail-pass/Bookings";
import EditBooking from "./pages/rail-pass/EditBooking";
import AddBooking from "./pages/rail-pass/AddBooking";
import ViewBooking from "./pages/rail-pass/ViewBooking";
import ViewRental from "./pages/rental/ViewRental";
import Partners from "./pages/partners/Partners";
import AddPartner from "./pages/partners/add/AddPartner";
import EditPartner from "./pages/partners/edit/EditPartner";
import ViewPartner from "./pages/partners/view/ViewPartner";
import Insurances from "./pages/insurances/Insurances";
import AddInsurance from "./pages/insurances/AddInsurance";
import EditInsurance from "./pages/insurances/EditInsurance";
import AddInsuranceInformation from "./pages/insurances/AddInsuranceInformation";
import EditInsuranceInformation from "./pages/insurances/EditInsuranceInformation";
import ViewInsurance from "./pages/insurances/ViewInsurance";
import InsuranceBookings from "./pages/insurances/bookings/InsuranceBookings";
import EditInsuranceBooking from "./pages/insurances/bookings/EditInsuranceBooking";
import AddInsuranceBooking from "./pages/insurances/bookings/AddInsuranceBooking";
import Careers from "./pages/careers/Careers";
import AddCareer from "./pages/careers/AddCareer";
import EditCareer from "./pages/careers/EditCareer";
import ViewCareer from "./pages/careers/ViewCareer";
import ViewInsuranceBooking from "./pages/insurances/bookings/view/ViewInsuranceBooking";
import Markups from "./pages/markups/Markups";
import EditMarkup from "./pages/markups/edit/EditMarkup";
import AddMarkup from "./pages/markups/add/AddMarkup";
import Scraper from "./pages/scraper/Scraper";
import EditScraper from "./components/scraper/EditScraperConfig";
import OptionsForYou from "./pages/options-for-you/OptionsForYou";
import ViewOptionBooking from "./pages/options-for-you/ViewOptionBooking";
import AddOptionBooking from "./pages/options-for-you/AddOptionBooking";
import EditOptionBooking from "./pages/options-for-you/EditOptionBooking";
import PageConfigs from "./pages/page-config/PageConfigs";
import EditPageConfig from "./pages/page-config/edit/EditPageConfig";
import AddPageConfig from "./pages/page-config/add/AddPageConfig";
import PageConfigManager from "./pages/page-config/ArrangePage";

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
    path: "/articles/happenings",
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
    path: "/articles/promotions",
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
    path: "/insurance/partners",
    element: (
      <RouteProtection>
        <Partners />
      </RouteProtection>
    ),
  },
  {
    path: "/partners/add",
    element: (
      <RouteProtection>
        <AddPartner />
      </RouteProtection>
    ),
  },
  {
    path: "/partners/edit/:id",
    element: (
      <RouteProtection>
        <EditPartner />
      </RouteProtection>
    ),
  },
  {
    path: "/partners/view/:id",
    element: (
      <RouteProtection>
        <ViewPartner />
      </RouteProtection>
    ),
  },
  {
    path: "/careers",
    element: (
      <RouteProtection>
        <Careers />
      </RouteProtection>
    ),
  },
  {
    path: "/careers/add",
    element: (
      <RouteProtection>
        <AddCareer />
      </RouteProtection>
    ),
  },
  {
    path: "/careers/edit/:id",
    element: (
      <RouteProtection>
        <EditCareer />
      </RouteProtection>
    ),
  },
  {
    path: "/careers/view/:id",
    element: (
      <RouteProtection>
        <ViewCareer />
      </RouteProtection>
    ),
  },
  {
    path: "/insurance/insurances",
    element: (
      <RouteProtection>
        <Insurances />
      </RouteProtection>
    ),
  },
  {
    path: "/insurance/add",
    element: (
      <RouteProtection>
        <AddInsurance />
      </RouteProtection>
    ),
  },
  {
    path: "/insurance/edit/:id",
    element: (
      <RouteProtection>
        <EditInsurance />
      </RouteProtection>
    ),
  },
  {
    path: "/insurance/information/add",
    element: (
      <RouteProtection>
        <AddInsuranceInformation />
      </RouteProtection>
    ),
  },
  {
    path: "/insurance/information/edit/:id",
    element: (
      <RouteProtection>
        <EditInsuranceInformation />
      </RouteProtection>
    ),
  },
  {
    path: "/insurance/view/:id",
    element: (
      <RouteProtection>
        <ViewInsurance />
      </RouteProtection>
    ),
  },
  {
    path: "/insurance/bookings",
    element: (
      <RouteProtection>
        <InsuranceBookings />
      </RouteProtection>
    ),
  },
  {
    path: "/insurance/bookings/view/:id",
    element: (
      <RouteProtection>
        <ViewInsuranceBooking />
      </RouteProtection>
    ),
  },
  {
    path: "/insurance/bookings/add",
    element: (
      <RouteProtection>
        <AddInsuranceBooking />
      </RouteProtection>
    ),
  },
  {
    path: "/insurance/bookings/edit/:id",
    element: (
      <RouteProtection>
        <EditInsuranceBooking />
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
    path: "/company/scraper",
    element: (
      <RouteProtection>
        <Scraper />
      </RouteProtection>
    ),
  },
  {
    path: "/company/scraper/edit",
    element: (
      <RouteProtection>
        <EditScraper />
      </RouteProtection>
    ),
  },
  {
    path: "/company/markups",
    element: (
      <RouteProtection>
        <Markups />
      </RouteProtection>
    ),
  },
  {
    path: "/markups/add",
    element: (
      <RouteProtection>
        <AddMarkup />
      </RouteProtection>
    ),
  },
  {
    path: "/markups/edit/:id",
    element: (
      <RouteProtection>
        <EditMarkup />
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
    path: "/articles/blogs",
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
    path: "/page-configs",
    element: (
      <RouteProtection>
        <PageConfigs />
      </RouteProtection>
    ),
  },
  {
    path: "/page-configs/edit/:id",
    element: (
      <RouteProtection>
        <EditPageConfig />
      </RouteProtection>
    ),
  },
  {
    path: "/page-configs/re-order",
    element: (
      <RouteProtection>
        <PageConfigManager />
      </RouteProtection>
    ),
  },
  {
    path: "/page-configs/add",
    element: (
      <RouteProtection>
        <AddPageConfig />
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
    path: "/transport/rail passes",
    element: (
      <RouteProtection>
        <RailPass />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/rail-passes/add",
    element: (
      <RouteProtection>
        <AddRailPass />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/rail-passes/edit/:id",
    element: (
      <RouteProtection>
        <EditRailPass />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/rail-passes/information/add",
    element: (
      <RouteProtection>
        <AddRailPassInfo />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/rail-passes/information/edit/:id",
    element: (
      <RouteProtection>
        <EditRailPassInfo />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/rail-passes/view/:id",
    element: (
      <RouteProtection>
        <ViewRailPass />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/vehicles",
    element: (
      <RouteProtection>
        <Vehicles />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/vehicles/add",
    element: (
      <RouteProtection>
        <AddVehicle />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/vehicles/edit/:id",
    element: (
      <RouteProtection>
        <EditVehicle />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/transportation",
    element: (
      <RouteProtection>
        <Transportation />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/transportation/add",
    element: (
      <RouteProtection>
        <AddTransport />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/transportation/edit/:id",
    element: (
      <RouteProtection>
        <EditTransportation />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/transportation/information/add",
    element: (
      <RouteProtection>
        <AddTransportationInfo />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/transportation/information/edit/:id",
    element: (
      <RouteProtection>
        <EditTransportInfo />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/transportation/view/:id",
    element: (
      <RouteProtection>
        <ViewTransportation />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/vehicle hire",
    element: (
      <RouteProtection>
        <Rental />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/rental/view/:id",
    element: (
      <RouteProtection>
        <ViewRental />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/rental/add",
    element: (
      <RouteProtection>
        <AddRental />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/rental/edit/:id",
    element: (
      <RouteProtection>
        <EditRental />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/bookings",
    element: (
      <RouteProtection>
        <Bookings />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/bookings/view/:id",
    element: (
      <RouteProtection>
        <ViewBooking />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/bookings/add",
    element: (
      <RouteProtection>
        <AddBooking />
      </RouteProtection>
    ),
  },
  {
    path: "/transport/bookings/edit/:id",
    element: (
      <RouteProtection>
        <EditBooking />
      </RouteProtection>
    ),
  },
  {
    path: "/options-for-you",
    element: (
      <RouteProtection>
        <OptionsForYou />
      </RouteProtection>
    ),
  },
  {
    path: "/options-for-you/add",
    element: (
      <RouteProtection>
        <AddOptionBooking />
      </RouteProtection>
    ),
  },
  {
    path: "/options-for-you/edit/:id",
    element: (
      <RouteProtection>
        <EditOptionBooking />
      </RouteProtection>
    ),
  },
  {
    path: "/options-for-you/view/:id",
    element: (
      <RouteProtection>
        <ViewOptionBooking />
      </RouteProtection>
    ),
  },
  {
    path: "/types-categories",
    element: (
      <RouteProtection>
        <TypesCategories />
      </RouteProtection>
    ),
  },
  {
    path: "/types-categories/add",
    element: (
      <RouteProtection>
        <AddTypesCategories />
      </RouteProtection>
    ),
  },
  {
    path: "/types-categories/edit/:id",
    element: (
      <RouteProtection>
        <EditTypesCategories />
      </RouteProtection>
    ),
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>,
);
