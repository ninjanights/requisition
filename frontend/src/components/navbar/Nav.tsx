import { useAuth } from "../../context/AuthContext";
import PublicNavbar from "./PublicNavbar";
import AdminNavbar from "./AdminNavbar";

const Navbar = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (user?.role === "ADMIN") {
    return <AdminNavbar />;
  }

  return <PublicNavbar />;
};

export default Navbar;
