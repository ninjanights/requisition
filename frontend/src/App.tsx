import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import Navbar from "./components/navbar/Nav";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoutes";

import Login from "./pages/public/Login";
import PublicHome from "./pages/public/PublicHome";
import RequisitionDetails from "./pages/public/RequisitionDetails";
import Documentation from "./pages/Documentation";

import AdminHome from "./pages/admin/AdminHome";
import CreateRequisition from "./pages/public/CreateRequisition";
import Ask from "./components/Ask";
import AskPage from "./pages/AskPage";
import { Import } from "lucide-react";
import RackPage from "./pages/RackPage";

function AppWrapper() {
  const location = useLocation();
  const hideOn = ["/login"];
  const shouldHide = hideOn.includes(location.pathname);

  return (
    <>
      {!shouldHide && <Navbar />}
      <Routes>
        {/* ----------------- PUBLIC ----------------- */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/ask" element={<AskPage />} />
        <Route path="/requisitions/import" element={<RackPage />} />
        <Route path="/requisitions/import" element={<Import />} />
        <Route element={<PublicLayout />}>
          <Route path="/home" element={<PublicHome />} />
          <Route path="/requisitions/:id" element={<RequisitionDetails />} />
        </Route>

        {/* ----------------- LOGIN ----------------- */}
        <Route path="/login" element={<Login />} />

        {/* ----------------- SHARED CREATE ----------------- */}
        <Route path="/requisitions/create" element={<CreateRequisition />} />

        {/* ----------------- ADMIN ----------------- */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* /admin */}
            <Route index element={<AdminHome />} />

            {/* /admin/requisitions/:id */}
            <Route path="requisitions/:id" element={<RequisitionDetails />} />

            {/* /admin/embeddings-questions */}
            <Route
              path="embeddings-questions"
              element={<div>Embeddings & Questions</div>}
            />
          </Route>
        </Route>

        {/* ----------------- 404 ----------------- */}

        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
      {!shouldHide && <Ask />}
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
