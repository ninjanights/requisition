import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import useBackendStatus from "../../hooks/useBackendStatus";

const blueprintItems = [
  {
    head: "Session-based isolated access",
    body: "every user gets their own isolated session. Create a requisition and your 24h session window gets extended.",
  },
  {
    head: "Admin manages everything",
    body: "from creating to submitting and approving requisitions, while being able to see everyone's requisitions.",
  },
  {
    head: "SQL-powered requisition insights",
    body: "ask for filtered, aggregated, or calculated details from your requisition data without manually writing SQL.",
  },
  {
    head: "Just write what you need",
    body: "add a requisition simply by describing it in human language. Gemini talks to the database logic and handles the insertion for you.",
  },
  {
    head: "Don't know the <id> or requisition title?",
    body: "dw. Give us the least amount of information you remember, and our RAG system will find the right requisition for you, thanks to Jina, Neon, Render.",
  },
];

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
    <div className="min-h-fit bg-neutral-300 py-[60px] sm:py-[60px]">
      <main className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 px-5 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
        <section className="flex flex-col justify-between gap-8 text-neutral-500">
          <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start">
              <img
                src="/ticket.png"
                alt="Requisition tickets"
                className="h-[100px] w-[100px] shrink-0 object-contain"
              />
              <span className="hidden pt-10 text-[18px] 
              font-black leading-none text-neutral-500 sm:block">·</span>
              <pre className="max-w-full overflow-x-auto text-left font-mono text-[9px] font-semibold leading-4 text-neutral-500">
{`const spaceXRequisition = {
  data: {
    createdDate: "2026-08-16T15:30:40.811204Z",
    department: "Propulsion",
    items: [
      {
        description: "Raptor Engine Combustion Chamber Pressure Sensor",
        qty: "12.0",
        unit: "pcs",
        rate: "4850.0",
        total: "58200.0",
      },
    ],
    project: "Starship Raptor Engine Test Stand",
    requestedBy: 1,
    requisitionNo: "PR-000001",
    status: "Submitted",
  },
};`}
              </pre>
            </div>

            <h2 className="mb-4 text-[18px] font-black text-neutral-700">Blueprint</h2>

            <ul className="space-y-3 text-[12px] font-semibold leading-5 text-neutral-500">
              {blueprintItems.map((item) => (
                <li key={item.head}>
                  <span className="font-extrabold text-neutral-500">{item.head}</span>
                  {" - "}
                  {item.body}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-neutral-500">
            <span>Assignment Proj.</span>
            <span className="h-4 w-px bg-neutral-500" />
            <a
              href="https://github.com/ninjanights/requisition"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-neutral-800"
            >
              github.com/ninjanights.com/requisition
            </a>
            <span className="h-4 w-px bg-neutral-500" />
            <Link to="/docs" className="transition hover:text-neutral-800">
              About Us
            </Link>
          </div>
        </section>

        <div className="hidden w-px bg-neutral-500/60 lg:block" />
        <div className="h-px bg-neutral-500/60 lg:hidden" />

        <section className="flex items-center justify-center">
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
        </section>
      </main>
    </div>
  );
};

export default Login;


