import React from "react";

export const SectionSkeleton: React.FC = () => {
  return (
    <div className="w-full py-16 px-4">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-6 w-40 bg-white/20 rounded animate-pulse" />
        <div className="hidden md:block h-6 w-24 bg-white/10 rounded animate-pulse" />
        <div className="md:col-span-2 h-40 bg-white/10 rounded-xl animate-pulse" />
        <div className="h-24 bg-white/10 rounded-xl animate-pulse" />
        <div className="h-24 bg-white/10 rounded-xl animate-pulse" />
      </div>
    </div>
  );
};
