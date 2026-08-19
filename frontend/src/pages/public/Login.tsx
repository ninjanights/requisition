import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import useBackendStatus from "../../hooks/useBackendStatus";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();
  const { user, isLoading: authLoading } = useAuth();

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

  const online = useBackendStatus();

  useEffect(() => {
    if (!authLoading && user?.role === "ADMIN") {
      // Admins who are already logged in should not access /login
      navigate("/admin", { replace: true });
    }
  }, [authLoading, user, navigate]);

  return (
    <div className="flex min-h-fit flex-col my-[100px] bg-neutral-300">
      <main className="flex flex-1 items-center justify-center bg-neutral-300 px-4 py-6 sm:px-6">
        <div className="flex w-full max-w-md -translate-y-2 flex-col items-center text-center">
          {/** backend status */}
          <p className="mb-3 text-xs font-bold text-neutral-500 text-center">
            {online ? "Awake" : "Sleeping"}
          </p>
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
                className="mb-1 block text-xs font-bold text-neutral-700 sm:text-sm"
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
                className=" font-black border-4 border-neutral-400 w-full rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-700"
              />
            </div>

            <div className="text-left">
              <label
                htmlFor="password"
                className="mb-1 block text-xs font-bold text-neutral-700 sm:text-sm"
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
                className="home-auth-input font-black border-4 border-neutral-400 w-full rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-700
                 "
              />
            </div>

            {error && <p className="text-[10px] font-bold text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="bg-neutral-500 w-full max-w-md rounded-xl px-6 py-5 text-center
               text-lg font-bold text-neutral-300"
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
            onClick={handlePublicWelcome}
            className=" bg-[#281C59] mt-4 w-full max-w-md rounded-xl px-6 py-5 text-center text-lg font-bold text-neutral-300"
          >
            {"{Public:Welcome}"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
