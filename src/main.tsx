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
import PageError from "./components/error/PageError";

const withErrorHandler = (element: React.ReactElement) => ({
  element,
  errorElement: <PageError />,
});

const router = createBrowserRouter([
  {
    path: "/",
    ...withErrorHandler(<Authorization />),
  },
  {
    path: "/login",
    ...withErrorHandler(
      <PublicRoute>
        <Login />
      </PublicRoute>,
    ),
  },
  {
    path: "/dashboard",
    ...withErrorHandler(
      <RouteProtection>
        <Dashboard />
      </RouteProtection>,
    ),
  },
  {
    path: "/users",
    ...withErrorHandler(
      <RouteProtection>
        <Users />
      </RouteProtection>,
    ),
  },
  {
    path: "/users/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddUser />
      </RouteProtection>,
    ),
  },
  {
    path: "/users/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditUser />
      </RouteProtection>,
    ),
  },
  {
    path: "/articles/happenings",
    ...withErrorHandler(
      <RouteProtection>
        <News />
      </RouteProtection>,
    ),
  },
  {
    path: "/news/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddNews />
      </RouteProtection>,
    ),
  },
  {
    path: "/news/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditNews />
      </RouteProtection>,
    ),
  },
  {
    path: "/news/view/:id",
    ...withErrorHandler(
      <RouteProtection>
        <ViewNews />
      </RouteProtection>,
    ),
  },
  {
    path: "/articles/promotions",
    ...withErrorHandler(
      <RouteProtection>
        <Promotions />
      </RouteProtection>,
    ),
  },
  {
    path: "/promotions/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddPromotion />
      </RouteProtection>,
    ),
  },
  {
    path: "/promotions/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditPromotion />
      </RouteProtection>,
    ),
  },
  {
    path: "/promotions/view/:id",
    ...withErrorHandler(
      <RouteProtection>
        <ViewPromotion />
      </RouteProtection>,
    ),
  },
  {
    path: "/insurance/partners",
    ...withErrorHandler(
      <RouteProtection>
        <Partners />
      </RouteProtection>,
    ),
  },
  {
    path: "/partners/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddPartner />
      </RouteProtection>,
    ),
  },
  {
    path: "/partners/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditPartner />
      </RouteProtection>,
    ),
  },
  {
    path: "/partners/view/:id",
    ...withErrorHandler(
      <RouteProtection>
        <ViewPartner />
      </RouteProtection>,
    ),
  },
  {
    path: "/careers",
    ...withErrorHandler(
      <RouteProtection>
        <Careers />
      </RouteProtection>,
    ),
  },
  {
    path: "/careers/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddCareer />
      </RouteProtection>,
    ),
  },
  {
    path: "/careers/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditCareer />
      </RouteProtection>,
    ),
  },
  {
    path: "/careers/view/:id",
    ...withErrorHandler(
      <RouteProtection>
        <ViewCareer />
      </RouteProtection>,
    ),
  },
  {
    path: "/insurance/insurances",
    ...withErrorHandler(
      <RouteProtection>
        <Insurances />
      </RouteProtection>,
    ),
  },
  {
    path: "/insurance/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddInsurance />
      </RouteProtection>,
    ),
  },
  {
    path: "/insurance/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditInsurance />
      </RouteProtection>,
    ),
  },
  {
    path: "/insurance/information/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddInsuranceInformation />
      </RouteProtection>,
    ),
  },
  {
    path: "/insurance/information/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditInsuranceInformation />
      </RouteProtection>,
    ),
  },
  {
    path: "/insurance/view/:id",
    ...withErrorHandler(
      <RouteProtection>
        <ViewInsurance />
      </RouteProtection>,
    ),
  },
  {
    path: "/insurance/bookings",
    ...withErrorHandler(
      <RouteProtection>
        <InsuranceBookings />
      </RouteProtection>,
    ),
  },
  {
    path: "/insurance/bookings/view/:id",
    ...withErrorHandler(
      <RouteProtection>
        <ViewInsuranceBooking />
      </RouteProtection>,
    ),
  },
  {
    path: "/insurance/bookings/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddInsuranceBooking />
      </RouteProtection>,
    ),
  },
  {
    path: "/insurance/bookings/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditInsuranceBooking />
      </RouteProtection>,
    ),
  },
  {
    path: "/company/details",
    ...withErrorHandler(
      <RouteProtection>
        <Company />
      </RouteProtection>,
    ),
  },
  {
    path: "/company/carousel",
    ...withErrorHandler(
      <RouteProtection>
        <Carousel />
      </RouteProtection>,
    ),
  },
  {
    path: "/company/carousel/edit",
    ...withErrorHandler(
      <RouteProtection>
        <EditCarousel />
      </RouteProtection>,
    ),
  },
  {
    path: "/company/services",
    ...withErrorHandler(
      <RouteProtection>
        <Services />
      </RouteProtection>,
    ),
  },
  {
    path: "/company/services/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddServices />
      </RouteProtection>,
    ),
  },
  {
    path: "/company/services/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditServices />
      </RouteProtection>,
    ),
  },
  {
    path: "/company/awards",
    ...withErrorHandler(
      <RouteProtection>
        <Awards />
      </RouteProtection>,
    ),
  },
  {
    path: "/company/awards/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddAwards />
      </RouteProtection>,
    ),
  },
  {
    path: "/company/awards/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditAwards />
      </RouteProtection>,
    ),
  },
  {
    path: "/company/branches",
    ...withErrorHandler(
      <RouteProtection>
        <Branches />
      </RouteProtection>,
    ),
  },
  {
    path: "/company/branches/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddBranches />
      </RouteProtection>,
    ),
  },
  {
    path: "/company/branches/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditBranches />
      </RouteProtection>,
    ),
  },
  {
    path: "/company/edit",
    ...withErrorHandler(
      <RouteProtection>
        <EditCompany />
      </RouteProtection>,
    ),
  },
  {
    path: "/company/scraper",
    ...withErrorHandler(
      <RouteProtection>
        <Scraper />
      </RouteProtection>,
    ),
  },
  {
    path: "/company/scraper/edit",
    ...withErrorHandler(
      <RouteProtection>
        <EditScraper />
      </RouteProtection>,
    ),
  },
  {
    path: "/company/markups",
    ...withErrorHandler(
      <RouteProtection>
        <Markups />
      </RouteProtection>,
    ),
  },
  {
    path: "/markups/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddMarkup />
      </RouteProtection>,
    ),
  },
  {
    path: "/markups/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditMarkup />
      </RouteProtection>,
    ),
  },
  {
    path: "/visas/visa",
    ...withErrorHandler(
      <RouteProtection>
        <Visas />
      </RouteProtection>,
    ),
  },
  {
    path: "/visas/visa/view/:id",
    ...withErrorHandler(
      <RouteProtection>
        <ViewVisa />
      </RouteProtection>,
    ),
  },
  {
    path: "/visas/visa/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddVisa />
      </RouteProtection>,
    ),
  },
  {
    path: "/visas/visa/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditVisa />
      </RouteProtection>,
    ),
  },
  {
    path: "/visas/information/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddInformation />
      </RouteProtection>,
    ),
  },
  {
    path: "/visas/information/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditInformation />
      </RouteProtection>,
    ),
  },
  {
    path: "/articles/blogs",
    ...withErrorHandler(
      <RouteProtection>
        <Blogs />
      </RouteProtection>,
    ),
  },
  {
    path: "/blogs/view/:id",
    ...withErrorHandler(
      <RouteProtection>
        <ViewBlog />
      </RouteProtection>,
    ),
  },
  {
    path: "/blogs/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddBlog />
      </RouteProtection>,
    ),
  },
  {
    path: "/blogs/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditBlog />
      </RouteProtection>,
    ),
  },
  {
    path: "/page-configs",
    ...withErrorHandler(
      <RouteProtection>
        <PageConfigs />
      </RouteProtection>,
    ),
  },
  {
    path: "/page-configs/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditPageConfig />
      </RouteProtection>,
    ),
  },
  {
    path: "/page-configs/re-order",
    ...withErrorHandler(
      <RouteProtection>
        <PageConfigManager />
      </RouteProtection>,
    ),
  },
  {
    path: "/page-configs/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddPageConfig />
      </RouteProtection>,
    ),
  },
  {
    path: "/tours",
    ...withErrorHandler(
      <RouteProtection>
        <Tours />
      </RouteProtection>,
    ),
  },
  {
    path: "/tours/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddTour />
      </RouteProtection>,
    ),
  },
  {
    path: "/tours/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditTour />
      </RouteProtection>,
    ),
  },
  {
    path: "/tours/information/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddTourInfo />
      </RouteProtection>,
    ),
  },
  {
    path: "/tours/information/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditTourInfo />
      </RouteProtection>,
    ),
  },
  {
    path: "/tours/view/:id",
    ...withErrorHandler(
      <RouteProtection>
        <ViewTour />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/rail passes",
    ...withErrorHandler(
      <RouteProtection>
        <RailPass />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/rail-passes/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddRailPass />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/rail-passes/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditRailPass />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/rail-passes/information/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddRailPassInfo />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/rail-passes/information/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditRailPassInfo />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/rail-passes/view/:id",
    ...withErrorHandler(
      <RouteProtection>
        <ViewRailPass />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/vehicles",
    ...withErrorHandler(
      <RouteProtection>
        <Vehicles />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/vehicles/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddVehicle />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/vehicles/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditVehicle />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/transportation",
    ...withErrorHandler(
      <RouteProtection>
        <Transportation />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/transportation/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddTransport />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/transportation/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditTransportation />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/transportation/information/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddTransportationInfo />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/transportation/information/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditTransportInfo />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/transportation/view/:id",
    ...withErrorHandler(
      <RouteProtection>
        <ViewTransportation />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/vehicle hire",
    ...withErrorHandler(
      <RouteProtection>
        <Rental />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/rental/view/:id",
    ...withErrorHandler(
      <RouteProtection>
        <ViewRental />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/rental/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddRental />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/rental/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditRental />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/bookings",
    ...withErrorHandler(
      <RouteProtection>
        <Bookings />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/bookings/view/:id",
    ...withErrorHandler(
      <RouteProtection>
        <ViewBooking />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/bookings/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddBooking />
      </RouteProtection>,
    ),
  },
  {
    path: "/transport/bookings/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditBooking />
      </RouteProtection>,
    ),
  },
  {
    path: "/options-for-you",
    ...withErrorHandler(
      <RouteProtection>
        <OptionsForYou />
      </RouteProtection>,
    ),
  },
  {
    path: "/options-for-you/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddOptionBooking />
      </RouteProtection>,
    ),
  },
  {
    path: "/options-for-you/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditOptionBooking />
      </RouteProtection>,
    ),
  },
  {
    path: "/options-for-you/view/:id",
    ...withErrorHandler(
      <RouteProtection>
        <ViewOptionBooking />
      </RouteProtection>,
    ),
  },
  {
    path: "/types-categories",
    ...withErrorHandler(
      <RouteProtection>
        <TypesCategories />
      </RouteProtection>,
    ),
  },
  {
    path: "/types-categories/add",
    ...withErrorHandler(
      <RouteProtection>
        <AddTypesCategories />
      </RouteProtection>,
    ),
  },
  {
    path: "/types-categories/edit/:id",
    ...withErrorHandler(
      <RouteProtection>
        <EditTypesCategories />
      </RouteProtection>,
    ),
  },
  {
    path: "*",
    ...withErrorHandler(<PageNotFound />),
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>,
);
