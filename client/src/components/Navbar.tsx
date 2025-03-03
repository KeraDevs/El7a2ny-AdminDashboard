const Navbar = () => {
  return (
    <div className="stiky top-0 z-10 flex flex-col">
      <header className="flex h-14 items-center gap-2 border-b bg-background px-4 lg:h-[60px]">
        <button
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-7 w-7 *:size-5"
          data-sidebar="trigger"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-panel-left"
          >
            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            <path d="M9 3v18"></path>
          </svg>
          <span className="sr-only">Toggle Sidebar</span>
        </button>
      </header>
    </div>
  );
};

export default Navbar;
