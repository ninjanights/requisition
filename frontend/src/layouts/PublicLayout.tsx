import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-300">
      <main className="bg-neutral-300">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;