import useBackendStatus from "../hooks/useBackendStatus";

const Footer = () => {
  const online = useBackendStatus();

  return (
    <footer className="w-full bg-transparent">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-xs font-bold text-neutral-600">
        <div className="text-center w-full">
          {'{'}
          <span>github:</span>
          <a
            href="https://github.com/ninjanights/requisition"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-1 text-neutral-600 hover:underline"
          >
            github/ninjanights/requisition
          </a>, v:1.0.0
          {'}'}
        </div>

        <div className="ml-4 hidden items-center gap-1.5 sm:inline-flex">
          <span className="text-xs font-medium text-neutral-500">{online ? "Awake" : "Sleeping"}</span>
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${
              online ? "bg-[#ADD7B9]" : "bg-[#F7DFC2]"
            } animate-breathe`}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
