import { NavLink } from "react-router-dom";
import { Home as HomeIcon, MessageSquareCode, Upload, ArrowLeft } from "lucide-react";

const PublicNavbar = () => {
  

  return (
    <header className="bg-transparent">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Brand */}
        <div className="flex items-center gap-4">
          <NavLink to="/" className="font-black">
            {"{Public:Requisition}"}
          </NavLink>

          <div className="h-6 w-px bg-neutral-400" />

          <NavLink
            to="/docs"
            className={({ isActive }) =>
              isActive
                ? "text-black text-[12px] font-bold"
                : "text-gray-500 text-[12px] font-bold hover:text-black"
            }
          >
            About Us
          </NavLink>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-black text-[12px] font-bold"
                : "text-gray-500 text-[12px] font-bold hover:text-black"
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
                  : "text-gray-500 text-[12px] font-bold hover:text-black"
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
                  : "text-gray-500 text-[12px] font-bold hover:text-black"
              }
            >
              <span className="flex items-center gap-2">
                <Upload className="h-3 w-3" />
                Post
              </span>
            </NavLink>
          </div>

          <div className="border-l border-neutral-500 pl-6 text-[12px] font-bold text-neutral-600 flex items-center">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? "text-black"
                  : "text-gray-500 hover:text-black"
              }
            >
              <span className="flex items-center gap-2">
                <ArrowLeft className="h-3 w-3" />
                Return
              </span>
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default PublicNavbar;