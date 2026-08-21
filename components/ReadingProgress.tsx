"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;

      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (documentHeight <= 0) {
        setProgress(0);
        return;
      }

      setProgress((scrollTop / documentHeight) * 100);
    };

    window.addEventListener("scroll", updateProgress);

    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  return (
    <div className="fixed left-0 top-0 z-[9999] h-1 w-full">
      <div
        className="h-full bg-yellow-600 transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}