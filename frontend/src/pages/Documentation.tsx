import { useState } from "react";

type WorkflowKey = "database" | "backend" | "frontend" | "retrievals";

const workflowSections: Record<
  WorkflowKey,
  {
    title: string;
    steps: Array<{ lead: string; body: string }>;
    stack: string;
  }
> = {
  database: {
    title: "Database Process",
    steps: [
      {
        lead: "Designed the database schema with SQLAlchemy",
        body: "users, requisitions, and requisition_items, connected through user -> requisitions -> items relationships.",
      },
      {
        lead: "Created the SQLAlchemy models and Pydantic schemas",
        body: "for database structure and request/response validation.",
      },
      {
        lead: "Connected PostgreSQL with Neon",
        body: "and used Alembic migrations to create and update the database schema.",
      },
      {
        lead: "Added and seeded the Admin user",
        body: "with securely hashed credentials.",
      },
      {
        lead: "Added RequisitionStatus enum",
        body: "with DRAFT, SUBMITTED, APPROVED, and REJECTED states.",
      },
      {
        lead: "Created usp_get_requisition() PostgreSQL function",
        body: "to return a complete requisition with its items and calculated totals as JSON.",
      },
      {
        lead: "Added browser-session fields",
        body: "session_id and session_expires_at to support 24-hour public user sessions.",
      },
      {
        lead: "Added PostgreSQL pgvector extension",
        body: "to prepare the database for storing embeddings and semantic search.",
      },
    ],
    stack: "SQLAlchemy • Alembic • PostgreSQL • Neon • PostgreSQL Functions • pgvector",
  },
  backend: {
    title: "Backend & Security Process",
    steps: [
      {
        lead: "Built FastAPI routes",
        body: "for authentication, requisition creation, admin approvals, embeddings, and question answering.",
      },
      {
        lead: "Centralized service logic",
        body: "so requisition, import, search, SQL generation, and question routing stay separated from API handlers.",
      },
      {
        lead: "Added session-based authentication",
        body: "with HTTP-only cookies, hashed passwords, and role-aware protected routes.",
      },
      {
        lead: "Validated requests and responses",
        body: "through Pydantic schemas before data reaches the database layer.",
      },
    ],
    stack: "FastAPI • Pydantic • SQLAlchemy • HTTP-only Cookies • Password Hashing",
  },
  frontend: {
    title: "Frontend Process",
    steps: [
      {
        lead: "Created the React application with Vite",
        body: "and organized public, admin, requisition, ask, and documentation pages.",
      },
      {
        lead: "Added reusable layouts and navigation",
        body: "for public users and admin users with protected route handling.",
      },
      {
        lead: "Connected frontend services to the API",
        body: "for login, requisition management, embedding actions, and question responses.",
      },
      {
        lead: "Styled the interface with Tailwind CSS",
        body: "using compact, consistent app-level classes for forms, panels, and buttons.",
      },
    ],
    stack: "React • TypeScript • Vite • Tailwind CSS • React Router • Axios",
  },
  retrievals: {
    title: "Retrievals & Generation Process",
    steps: [
      {
        lead: "Generated requisition embeddings",
        body: "so stored requisition data can be searched semantically.",
      },
      {
        lead: "Used vector search",
        body: "to retrieve relevant requisitions before answering user questions.",
      },
      {
        lead: "Routed questions through backend services",
        body: "to decide when to use SQL, semantic retrieval, or generated answers.",
      },
      {
        lead: "Connected Gemini and Jina services",
        body: "for extraction, embeddings, retrieval context, and final response generation.",
      },
    ],
    stack: "Gemini • Jina Embeddings • pgvector • Semantic Search • RAG",
  },
};

const workflowTabs: Array<{ key: WorkflowKey; label: string }> = [
  { key: "database", label: "Database" },
  { key: "backend", label: "Backend & Security" },
  { key: "frontend", label: "Frontend" },
  { key: "retrievals", label: "Retrievals & Generation" },
];

const Documentation = () => {
  const itemClass = "text-[11px] font-bold leading-4 text-neutral-600";
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowKey>("database");
  const workflow = workflowSections[activeWorkflow];

  return (
    <div className="app-page-wide py-5">
      <h1 className="app-title mb-5 flex items-center justify-center">About Us</h1>

      <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-center sm:divide-x sm:divide-neutral-500">
        <div className="py-2 sm:px-5 sm:py-0">
          <h3 className="mb-1 text-[14px] font-bold text-[#5B5656]">Backend</h3>
          <ul className="space-y-0.5">
            <li className={itemClass}>Python</li>
            <li className={itemClass}>FastAPI</li>
            <li className={itemClass}>SQLAlchemy</li>
            <li className={itemClass}>Alembic</li>
            <li className={itemClass}>Pydantic</li>
            <li className={itemClass}>PostgreSQL</li>
            <li className={itemClass}>pgvector</li>
          </ul>
        </div>
        <div className="py-2 sm:px-5 sm:py-0">
          <h3 className="mb-1 text-[14px] font-bold text-[#5B5656]">Frontend</h3>
          <ul className="space-y-0.5">
            <li className={itemClass}>React</li>
            <li className={itemClass}>TypeScript</li>
            <li className={itemClass}>Vite</li>
            <li className={itemClass}>Tailwind CSS</li>
            <li className={itemClass}>React Router</li>
            <li className={itemClass}>Axios</li>
          </ul>
        </div>

        <div className="py-2 sm:px-5 sm:py-0">
          <h3 className="mb-1 text-[14px] font-bold text-[#5B5656]">Authentication</h3>
          <ul className="space-y-0.5">
            <li className={itemClass}>Session-based authentication</li>
            <li className={itemClass}>HTTP-only cookies</li>
            <li className={itemClass}>JWT support</li>
            <li className={itemClass}>Role-based access</li>
          </ul>
        </div>

        <div className="py-2 sm:px-5 sm:py-0">
          <h3 className="mb-1 text-[14px] font-bold text-[#5B5656]">AI</h3>
          <ul className="space-y-0.5">
            <li className={itemClass}>Google Gemini : requisition extraction + question answering</li>
            <li className={itemClass}>Jina Embeddings</li>
            <li className={itemClass}>Vector semantic search</li>
            <li className={itemClass}>RAG pipeline</li>
          </ul>
        </div>
        <div className="py-2 sm:px-5 sm:py-0">
          <h3 className="mb-1 text-[14px] font-bold text-[#5B5656]">We're live with</h3>
          <ul className="space-y-0.5">
            <li className={itemClass}>Backend : Render</li>
            <li className={itemClass}>Frontend : Vercel</li>
            <li className={itemClass}>Database : Neon PostgreSQL</li>
          </ul>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="app-title mb-4 flex items-center justify-center">Workflow</h2>

        <div className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-0">
          {workflowTabs.map((tab, index) => (
            <div key={tab.key} className="flex items-center">
              <button
                type="button"
                onClick={() => setActiveWorkflow(tab.key)}
                className={`px-3 py-1 text-[11px] font-extrabold transition-colors ${
                  activeWorkflow === tab.key
                    ? "text-[#5B5656]"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {tab.label}
              </button>
              {index < workflowTabs.length - 1 && (
                <span className="mx-2 hidden h-6 w-px bg-neutral-500 sm:block" />
              )}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-5 max-w-5xl text-neutral-500">
          <h3 className="mb-3 text-[15px] font-extrabold text-[#5B5656]">{workflow.title}</h3>
          <ol className="list-decimal gap-x-8 space-y-1.5 pl-5 text-[11px] font-semibold leading-4 sm:columns-2">
            {workflow.steps.map((step) => (
              <li key={step.lead}>
                <span className="font-extrabold text-neutral-600">{step.lead}</span>
                {" - "}
                {step.body}
              </li>
            ))}
          </ol>

          <h4 className="mt-4 text-[12px] font-extrabold text-[#5B5656]">Stack</h4>
          <p className="mt-1 text-[11px] font-semibold leading-4">{workflow.stack}</p>
        </div>
      </section>
    </div>
  );
};

export default Documentation;

