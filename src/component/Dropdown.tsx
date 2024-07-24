import React, { useState, useEffect, useRef } from "react";

interface DropdownProps {
  label: string;
  selected: string;
  options: string[];
  onOptionSelect: (option: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  selected,
  options,
  onOptionSelect,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="mb-4 relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {selected}
      </div>
      {dropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-52 overflow-y-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none p-2 border-b border-gray-300"
            placeholder="Search"
          />
          {options
            .filter((option) =>
              option.toLowerCase().includes(search.toLowerCase())
            )
            .map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  onOptionSelect(option);
                  setDropdownOpen(false);
                  setSearch("");
                }}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {option}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
