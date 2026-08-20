import useBackendStatus from "../hooks/useBackendStatus";

const Footer = () => {
  const { isAwake } = useBackendStatus();

  return (
    <footer className="w-full bg-transparent">
      <div
        className="
          mx-auto flex max-w-7xl items-center justify-center
          gap-3 px-6 py-3 text-[10px] font-semibold text-neutral-600
        "
      >
        {/* Source Code */}
        <div className="flex items-center">
          <span>Source code</span>
          <span className="mx-1.5 text-neutral-400">·</span>

          <a
            href="https://github.com/ninjanights/requisition"
            target="_blank"
            rel="noopener noreferrer"
            className=" hover:underline"
          >
            github/ninjanights/requisition
          </a>
        </div>

        {/* Vertical separator */}
        <span className="h-4 w-px bg-neutral-400" />

        {/* Version */}
        <div className="flex items-center">
          <span>Version</span>
          <span className="mx-1.5 text-neutral-400">·</span>
          <span>1.0.0</span>
        </div>

        {/* Vertical separator */}
        <span className="h-4 w-px bg-neutral-400" />

        {/* Server */}
        <div className="flex items-center">
          <span>Server</span>
          <span className="mx-1.5 text-neutral-400">·</span>

          <span className="flex items-center gap-1.5">
            <span>{isAwake ? "Awake" : "Sleeping"}</span>

            <span
              className={`block h-2 w-2 shrink-0 translate-y-[1px] rounded-full ${
                isAwake ? "bg-teal-400" : "bg-yellow-400"
              }`}
            />
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;