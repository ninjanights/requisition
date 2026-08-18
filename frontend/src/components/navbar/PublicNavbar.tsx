import { NavLink, useNavigate } from "react-router-dom";

const PublicNavbar = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-transparent">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Brand */}
        <NavLink
          to="/"
          className="font-semibold"
        >
          {"{public:requisition}"}
        </NavLink>

        {/* Navigation */}
        <div className="flex items-center gap-6">

          {/* Return */}
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-black"
                : "text-gray-500 hover:text-black"
            }
          >
            Return
          </NavLink>

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-black"
                : "text-gray-500 hover:text-black"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/ask"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-black"
                : "text-gray-500 hover:text-black"
            }
          >
            Ask
          </NavLink>

        </div>
      </nav>
    </header>
  );
};

export default PublicNavbar;