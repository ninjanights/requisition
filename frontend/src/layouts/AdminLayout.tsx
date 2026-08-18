import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/navbar/AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-300">
      <main className="bg-neutral-300">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;