import { NavLink, useNavigate } from "react-router-dom";
import { Home as HomeIcon, MessageSquareCode, Upload } from "lucide-react";
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
        <div className="flex items-center gap-4">
          <NavLink to="/admin" className="font-semibold">
            {"{admin:requisition}"}
          </NavLink>

          <div className="h-6 w-px bg-neutral-400" />

          <NavLink
            to="/docs"
            className={({ isActive }) =>
              isActive
                ? "text-black text-[12px] font-bold"
                : "text-gray-500 hover:text-black text-[12px] font-bold"
            }
          >
            About Us
          </NavLink>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6">

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive
                ? "text-black text-[12px] font-bold"
                : "text-gray-500 hover:text-black text-[12px] font-bold"
            }
          >
            <span className="flex items-center gap-2">
              <HomeIcon className="h-3 w-3" />
              Home
            </span>
          </NavLink>

          <div className="flex items-center gap-2">
            <NavLink
              to="/ask"
              className={({ isActive }) =>
                isActive
                  ? "text-black text-[12px] font-bold"
                  : "text-gray-500 hover:text-black text-[12px] font-bold"
              }
            >
              <span className="flex items-center gap-2">
                <MessageSquareCode className="h-3 w-3" />
                Ask
              </span>
            </NavLink>

            <span className="text-gray-400">·</span>

            <NavLink
              to="/requisitions/import"
              className={({ isActive }) =>
                isActive
                  ? "text-black text-[12px] font-bold"
                  : "text-gray-500 hover:text-black text-[12px] font-bold"
              }
            >
              <span className="flex items-center gap-2">
                <Upload className="h-3 w-3" />
                Post
              </span>
            </NavLink>
          </div>

          {/* User */}
          <div className="border-l pl-6 text-[12px] font-bold text-neutral-600">
            {user?.email}
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="ml-4 text-[12px] font-bold text-red-600 hover:text-red-700"
          >
            Logout
          </button>

        </div>
      </nav>
    </header>
  );
};

export default AdminNavbar;