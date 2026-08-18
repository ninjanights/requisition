import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-transparent">
      <div className="mx-auto max-w-7xl px-6 py-3
       text-center text-xs font-bold text-neutral-600">
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
    </footer>
  );
};

export default Footer;
