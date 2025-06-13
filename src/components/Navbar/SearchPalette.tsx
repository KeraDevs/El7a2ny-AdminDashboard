import { useEffect, useState } from "react";
import { SearchPaletteProps } from "@/types/navigation";

const SearchPalette = ({ isOpen, onClose }: SearchPaletteProps) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (!isOpen) onClose();
      }
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 ">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white dark:bg-gray-900 shadow-xl">
        <div className="p-4">
          {/* Search input */}
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex w-full items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Type a command or search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Navigation section */}
          <div className="mt-4">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              NAVIGATION
            </div>
            <div className="mt-2 space-y-1">
              {[
                { name: "Dashboard", shortcut: "d" },
                { name: "Product", shortcut: "p" },
                { name: "Kanban", shortcut: "k" },
                { name: "Profile", shortcut: "p" },
                { name: "Login", shortcut: "l" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-sm px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <span className="text-sm">{item.name}</span>
                  <kbd className="ml-auto flex h-5 items-center gap-1 rounded border bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-[10px] font-medium">
                    {item.shortcut}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPalette;
