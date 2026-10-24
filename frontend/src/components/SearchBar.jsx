import { useEffect, useState } from "react";

const SearchBar = ({ value, onDebouncedChange }) => {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      onDebouncedChange(inputValue.trim());
    }, 450);

    return () => clearTimeout(timer);
  }, [inputValue, onDebouncedChange]);

  return (
    <div className="w-full rounded-2xl border border-slate-300 bg-white shadow-lg shadow-slate-200/70">
      <input
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="Search medicines, e.g. Paracetamol"
        className="w-full rounded-2xl px-5 py-4 text-base text-slate-800 outline-none placeholder:text-slate-400"
      />
    </div>
  );
};

export default SearchBar;
