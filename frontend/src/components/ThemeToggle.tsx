import { Sun, Moon } from "lucide-react";

export const ThemeToggle = ({
  theme,
  toggleTheme,
}: {
  theme: string;
  toggleTheme: () => void;
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 border border-gray-500/30 rounded-lg">
      <button
        onClick={toggleTheme}
        className="rounded shadow-md px-3 py-2 cursor-pointer text-black dark:text-white transition-all ease-in-out hover:bg-gray-500/10 dark:hover:bg-white/5"
      >
        {theme === "dark" ? <Sun /> : <Moon />}
      </button>
    </div>
  );
};
