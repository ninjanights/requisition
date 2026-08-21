import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import useBackendStatus from "../../hooks/useBackendStatus";

const Login = () => {
  const navigate = useNavigate();

  const { user, isLoading: authLoading, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      await login({
        email,
        password,
      });

      navigate("/admin");
    } catch (error: any) {
      setError(error.response?.data?.detail || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublicWelcome = () => {
    navigate("/home");
  };

  const { status, isAwake, isChecking } = useBackendStatus();

  useEffect(() => {
    if (!authLoading && user?.role === "ADMIN") {
      // Admins who are already logged in should not access /login
      navigate("/admin", { replace: true });
    }
  }, [authLoading, user, navigate]);

  return (
    <div className="flex min-h-fit flex-col bg-neutral-300 py-[100px]">
      <main className="flex flex-1 items-center justify-center bg-neutral-300 px-4 py-6 sm:px-6">
        <div className="flex w-full max-w-md -translate-y-2 flex-col items-center text-center">
          {/** backend status */}
          <div className="mb-5 text-center">
            {/* Backend status */}
            <div className="flex items-center justify-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full animate-breathe ${
                  isAwake ? "bg-teal-400" : "bg-yellow-400"
                }`}
              />

              {/* Vertical divider */}
              <span className="h-4 w-[1px] bg-neutral-400" />

              <span className="text-[12px] font-bold text-neutral-500">
                {isChecking && "Awakening"}
                {status === "awake" && "Awake"}
                {status === "sleeping" && "Sleeping"}
              </span>
            </div>

            {/* Explanation */}
            <p className="mt-2 text-xs font-bold text-neutral-600">
              This demo runs on a free-tier server, so it may take a few moments
              to wake up.
            </p>

            <p className="mt-0.5 text-xs font-semibold text-neutral-500">
              Thanks for your patience
            </p>
          </div>

          <h1 className="mb-3 text-3xl font-black leading-none text-neutral-900 sm:text-5xl">
            {"{Requisition}"}
          </h1>

          <p className="mb-6 text-[10px] font-bold text-neutral-500">
            A place for keeping your requisits.
          </p>

          <form onSubmit={handleLogin} className="w-full space-y-2">
            <div className="text-left">
              <label
                htmlFor="email"
                className="mb-1 block text-[12px] font-bold text-neutral-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                required
                className="app-input px-4 py-3"
              />
            </div>

            <div className="text-left">
              <label
                htmlFor="password"
                className="mb-1 block text-[12px] font-bold text-neutral-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                className="app-input px-4 py-3"
              />
            </div>

            {error && (
              <p className="text-[10px] font-bold text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || !isAwake}
              className="bg-[#B4B4B3] font-black
              rounded-[10px]
              w-full max-w-md px-6 py-5 
               text-center text-[12px]
               
               
               "
            >
              {isLoading ? "Logging in..." : "{Admin:Login}"}
            </button>
          </form>

          <div className=" h-px w-full bg-neutral-300" />
          <div className="mt-6 h-px w-full max-w-md bg-neutral-400"></div>

          <p className="mt-2 text-[10px] font-bold text-neutral-500">
            Not an Admin? Come on in!
          </p>

          <button
            type="button"
            disabled={isLoading || !isAwake}
            onClick={handlePublicWelcome}
            className="app-button mt-4 w-full max-w-md px-6 py-5 text-center text-[16px]"
          >
            {"Public*:Welcome"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
