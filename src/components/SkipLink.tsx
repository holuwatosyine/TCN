import React from "react";

const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[1000] px-4 py-2 rounded-md bg-coaching-gold text-coaching-navy font-semibold shadow-glow"
    >
      Skip to content
    </a>
  );
};

export default SkipLink;
