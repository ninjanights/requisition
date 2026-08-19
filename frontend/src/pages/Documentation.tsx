const Documentation = () => {
  const itemClass = "text-[12px] font-bold text-neutral-600";

  return (
    <div className="app-page-wide">
      <h1 className="app-title mb-8 flex items-center justify-center">About Us</h1>

      <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-center sm:divide-x sm:divide-neutral-500">
      

        <div className="sm:px-8 sm:py-0 py-4">
          <h3 className="mb-2 text-[16px] font-bold text-[#281c59]">Backend</h3>
          <ul className="space-y-1">
            <li className={itemClass}>Python</li>
            <li className={itemClass}>FastAPI</li>
            <li className={itemClass}>SQLAlchemy</li>
            <li className={itemClass}>Alembic</li>
            <li className={itemClass}>Pydantic</li>
            <li className={itemClass}>PostgreSQL</li>
            <li className={itemClass}>pgvector</li>
          </ul>
        </div>
          <div className="sm:px-8 sm:py-0 py-4">
          <h3 className="mb-2 text-[16px] font-bold text-[#281c59]">Frontend</h3>
          <ul className="space-y-1">
            <li className={itemClass}>React</li>
            <li className={itemClass}>TypeScript</li>
            <li className={itemClass}>Vite</li>
            <li className={itemClass}>Tailwind CSS</li>
            <li className={itemClass}>React Router</li>
            <li className={itemClass}>Axios</li>
          </ul>
        </div>


        <div className="sm:px-8 sm:py-0 py-4">
          <h3 className="mb-2 text-[16px] font-bold text-[#281c59]">Authentication</h3>
          <ul className="space-y-1">
            <li className={itemClass}>Session-based authentication</li>
            <li className={itemClass}>HTTP-only cookies</li>
            <li className={itemClass}>JWT support</li>
            <li className={itemClass}>Role-based access</li>
          </ul>
        </div>

        <div className="sm:px-8 sm:py-0 py-4">
          <h3 className="mb-2 text-[16px] font-bold text-[#281c59]">AI</h3>
          <ul className="space-y-1">
            <li className={itemClass}>Google Gemini : requisition extraction + question answering</li>
            <li className={itemClass}>Jina Embeddings</li>
            <li className={itemClass}>Vector semantic search</li>
            <li className={itemClass}>RAG pipeline</li>
          </ul>
        </div>
        <div className="sm:px-8 sm:py-0 py-4">
          <h3 className="mb-2 text-[16px] font-bold text-[#281c59]">We're live with</h3>
          <ul className="space-y-1">
            
            <li className={itemClass}>Backend : Render</li>
            <li className={itemClass}>Frontend : Vercel</li>
            <li className={itemClass}>Database : Neon PostgreSQL</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Documentation;

