import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="app-shell">
      <main className="min-h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
