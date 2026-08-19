import useBackendStatus from "../hooks/useBackendStatus";

const Footer = () => {
  const { isAwake } = useBackendStatus();

  return (
    <footer className="w-full bg-transparent">
      <div className="mx-auto flex max-w-7xl items-center
       justify-center gap-4 px-6 py-3 text-[12px] 
       font-bold text-neutral-600">
        <div className="min-w-0 flex-1 truncate text-center sm:text-left">
          {"{"}
          <span>github:</span>
          <a
            href="https://github.com/ninjanights/requisition"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-1 text-[#281c59] hover:underline"
          >
            github/ninjanights/requisition
          </a>
          , v:1.0.0
          {"}"}
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:inline-flex">
          <span className="text-[12px] font-bold text-neutral-500">
            Backend: {isAwake ? "Awake" : "Sleeping"}
          </span>
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${
              isAwake ? "bg-teal-400" : "bg-yellow-400"
            } `}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;


