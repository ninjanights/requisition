import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<div>Home</div>} />
        <Route path="/login" element={<div>Login</div>} />

        {/* Admin Routes */}
        <Route path="/admin">
          <Route path="dashboard" element={<div>Admin Dashboard</div>} />
          <Route path="requisitions" element={<div>Requisitions</div>} />
          <Route
            path="requisitions/create"
            element={<div>Create Requisition</div>}
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
