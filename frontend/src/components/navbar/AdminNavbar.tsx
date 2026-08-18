import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-transparent">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Brand */}
        <NavLink
          to="/admin"
          className="font-semibold"
        >
          {"{admin:requisition}"}
        </NavLink>

        {/* Navigation */}
        <div className="flex items-center gap-6">

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-black"
                : "text-gray-500 hover:text-black"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/embed"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-black"
                : "text-gray-500 hover:text-black"
            }
          >
            Ask & Embed
          </NavLink>

          {/* User */}
          <div className="border-l pl-6 text-sm text-gray-500">
            {user?.email}
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            Logout
          </button>

        </div>
      </nav>
    </header>
  );
};

export default AdminNavbar;