import { NavLink } from "react-router-dom";
import {
  Home as HomeIcon,
  MessageSquareCode,
  Upload,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-[12px] font-bold transition ${
    isActive ? "text-[#120078]" : "text-neutral-500 hover:text-[#120078]"
  }`;

const PublicNavbar = () => {
  const { user } = useAuth();
  return (
    <header className="bg-transparent">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex min-w-0 items-center gap-4">
          <NavLink
            to="/"
            className="shrink-0 text-[16px] font-black text-neutral-900"
          >
            {"{Public:Requisition}"}
          </NavLink>

          <div className="h-6 w-px shrink-0 bg-neutral-400" />

          <NavLink to="/docs" className={navLinkClass}>
            About Us
          </NavLink>
        </div>

        <div className="flex items-center gap-6">
          <NavLink to="/home" className={navLinkClass}>
            <span className="flex items-center gap-2">
              <HomeIcon className="h-3 w-3" />
              Home
            </span>
          </NavLink>

          <div className="flex items-center gap-2">
            <NavLink to="/ask" className={navLinkClass}>
              <span className="flex items-center gap-2">
                <MessageSquareCode className="h-3 w-3" />
                Ask
              </span>
            </NavLink>

            <span className="text-neutral-400">·</span>

            <NavLink to="/requisitions/import" className={navLinkClass}>
              <span className="flex items-center gap-2">
                <Upload className="h-3 w-3" />
                Post
              </span>
            </NavLink>
          </div>

          <div
            className="max-w-40 truncate border-l flex align-middle
           items-center gap-2
             border-neutral-500 pl-4 text-[12px] font-bold
              text-neutral-500"
          >
            <div>
              <span>{user?.id}</span>
            </div>
            <NavLink to="/login" className={navLinkClass}>
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
